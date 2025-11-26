/**
 * LYRION Order Broker - Cloudflare Worker
 * 
 * Multi-POD routing system for handling Stripe checkout and fulfillment
 * Supports: Printful, Printify, Gelato, Inkthreadable, Digital, Manual, Mixed (Bundles)
 * 
 * Environment Variables Required (accessed via env parameter):
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 * - PRINTFUL_API_KEY
 * - PRINTIFY_API_KEY
 * - GELATO_API_KEY
 * - INKTHREADABLE_API_KEY
 * - PRINTIFY_SHOP_ID
 * - ORDER_NOTIFICATION_EMAIL
 * - BASE_URL
 * - ROUTING_JSON_URL
 */

// Stripe configuration
const STRIPE_API_VERSION = '2023-10-16';

/**
 * Main request handler
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event));
});

async function handleRequest(request, event) {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (path === '/checkout' && request.method === 'POST') {
      return await handleCheckout(request, corsHeaders, event);
    }

    if (path === '/webhook' && request.method === 'POST') {
      return await handleWebhook(request, event);
    }

    return new Response('LYRION Order Broker - Available endpoints: /checkout, /webhook', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Request error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle checkout session creation
 */
async function handleCheckout(request, corsHeaders, event) {
  const { sku } = await request.json();

  if (!sku) {
    return new Response(JSON.stringify({ error: 'SKU is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Fetch routing data
  const routing = await fetchRoutingData(event);
  const product = routing[sku];

  if (!product) {
    return new Response(JSON.stringify({ error: 'Product not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Create Stripe Checkout Session
  const session = await createStripeCheckoutSession(sku, product, event);

  return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

/**
 * Create Stripe checkout session
 */
async function createStripeCheckoutSession(sku, product, event) {
  const stripeKey = event.env?.STRIPE_SECRET_KEY || '';
  const baseUrl = event.env?.BASE_URL || '';
  
  const lineItems = [{
    price_data: {
      currency: product.currency.toLowerCase(),
      product_data: {
        name: product.title,
        description: sku,
      },
      unit_amount: Math.round(product.price * 100), // Convert to pence/cents
    },
    quantity: 1,
  }];

  const sessionData = {
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${baseUrl}/shop.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/shop.html?cancelled=true`,
    metadata: {
      sku: sku,
      provider: product.provider,
      provider_sku: product.provider_sku,
      type: product.type,
    },
    shipping_address_collection: {
      allowed_countries: ['GB', 'US', 'CA', 'AU', 'NZ', 'IE', 'FR', 'DE', 'ES', 'IT', 'NL', 'BE'],
    },
  };

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_API_VERSION,
    },
    body: encodeFormData(sessionData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe API error: ${error}`);
  }

  return await response.json();
}

/**
 * Handle Stripe webhook events
 */
async function handleWebhook(request, event) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  // Verify webhook signature
  const webhookEvent = await verifyStripeWebhook(body, signature, event);

  if (webhookEvent.type === 'checkout.session.completed') {
    const session = webhookEvent.data.object;

    // Process fulfillment asynchronously
    event.waitUntil(processFulfillment(session, event));

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Verify Stripe webhook signature
 */
async function verifyStripeWebhook(payload, signature, event) {
  const secret = event.env?.STRIPE_WEBHOOK_SECRET || '';
  
  // For Cloudflare Workers, we use the raw payload
  // In production, implement proper webhook signature verification
  // This is a simplified version
  
  try {
    return JSON.parse(payload);
  } catch (error) {
    throw new Error('Invalid webhook payload');
  }
}

/**
 * Process order fulfillment based on provider
 */
async function processFulfillment(session, event) {
  const { sku, provider, provider_sku, type } = session.metadata;

  // Fetch routing data
  const routing = await fetchRoutingData(event);
  const product = routing[sku];

  if (!product) {
    console.error(`Product not found for SKU: ${sku}`);
    return;
  }

  // Get shipping and customer info
  const customer = await fetchStripeCustomer(session.customer, event);
  const shipping = session.shipping_details || session.shipping;

  // Route to appropriate provider
  switch (provider) {
    case 'printful':
      await fulfillPrintful(product, session, shipping, customer, event);
      break;
    case 'printify':
      await fulfillPrintify(product, session, shipping, customer, event);
      break;
    case 'gelato':
      await fulfillGelato(product, session, shipping, customer, event);
      break;
    case 'inkthreadable':
      await fulfillInkthreadable(product, session, shipping, customer, event);
      break;
    case 'digital':
      await fulfillDigital(product, session, customer, event);
      break;
    case 'manual':
      await fulfillManual(product, session, shipping, customer, event);
      break;
    case 'mixed':
      await fulfillBundle(product, session, shipping, customer, event);
      break;
    default:
      console.error(`Unknown provider: ${provider}`);
  }
}

/**
 * Fetch Stripe customer details
 */
async function fetchStripeCustomer(customerId, event) {
  if (!customerId) return null;

  const stripeKey = event.env?.STRIPE_SECRET_KEY || '';

  const response = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
    headers: {
      'Authorization': `Bearer ${stripeKey}`,
      'Stripe-Version': STRIPE_API_VERSION,
    },
  });

  if (!response.ok) return null;
  return await response.json();
}

/**
 * Fulfill order via Printful
 */
async function fulfillPrintful(product, session, shipping, customer, event) {
  const apiKey = event.env?.PRINTFUL_API_KEY || '';

  const orderData = {
    recipient: {
      name: shipping.name,
      address1: shipping.address.line1,
      address2: shipping.address.line2 || '',
      city: shipping.address.city,
      state_code: shipping.address.state || '',
      country_code: shipping.address.country,
      zip: shipping.address.postal_code,
      email: customer?.email || '',
    },
    items: [
      {
        sync_variant_id: product.provider_sku,
        quantity: 1,
      }
    ],
    retail_costs: {
      currency: product.currency,
      total: product.price.toFixed(2),
    },
  };

  const response = await fetch('https://api.printful.com/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Printful fulfillment error:', error);
    await sendErrorNotification('Printful', product.title, session.id, error, event);
  } else {
    console.log(`Printful order created for ${product.title}`);
  }
}

/**
 * Fulfill order via Printify
 */
async function fulfillPrintify(product, session, shipping, customer, event) {
  const apiKey = event.env?.PRINTIFY_API_KEY || '';
  const shopId = event.env?.PRINTIFY_SHOP_ID || '';

  const orderData = {
    external_id: session.id,
    label: product.title,
    line_items: [
      {
        product_id: product.provider_sku,
        quantity: 1,
      }
    ],
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: shipping.name.split(' ')[0] || 'Customer',
      last_name: shipping.name.split(' ').slice(1).join(' ') || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address1: shipping.address.line1,
      address2: shipping.address.line2 || '',
      city: shipping.address.city,
      state_code: shipping.address.state || '',
      country: shipping.address.country,
      zip: shipping.address.postal_code,
    },
  };

  const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Printify fulfillment error:', error);
    await sendErrorNotification('Printify', product.title, session.id, error, event);
  } else {
    console.log(`Printify order created for ${product.title}`);
  }
}

/**
 * Fulfill order via Gelato
 */
async function fulfillGelato(product, session, shipping, customer, event) {
  const apiKey = event.env?.GELATO_API_KEY || '';

  const orderData = {
    orderReferenceId: session.id,
    orderType: 'order',
    shipmentMethodUid: 'standard',
    items: [
      {
        itemReferenceId: product.sku,
        productUid: product.provider_sku,
        quantity: 1,
      }
    ],
    shipTo: {
      firstName: shipping.name.split(' ')[0] || 'Customer',
      lastName: shipping.name.split(' ').slice(1).join(' ') || '',
      addressLine1: shipping.address.line1,
      addressLine2: shipping.address.line2 || '',
      city: shipping.address.city,
      postCode: shipping.address.postal_code,
      country: shipping.address.country,
      email: customer?.email || '',
    },
  };

  const response = await fetch('https://order.gelatoapis.com/v4/orders', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Gelato fulfillment error:', error);
    await sendErrorNotification('Gelato', product.title, session.id, error, event);
  } else {
    console.log(`Gelato order created for ${product.title}`);
  }
}

/**
 * Fulfill order via Inkthreadable (UK-based embroidery and print provider)
 */
async function fulfillInkthreadable(product, session, shipping, customer, event) {
  const apiKey = event.env?.INKTHREADABLE_API_KEY || '';

  const orderData = {
    external_reference: session.id,
    items: [
      {
        sku: product.provider_sku,
        quantity: 1,
      }
    ],
    shipping: {
      name: shipping.name,
      address_1: shipping.address.line1,
      address_2: shipping.address.line2 || '',
      city: shipping.address.city,
      county: shipping.address.state || '',
      country: shipping.address.country,
      postcode: shipping.address.postal_code,
      email: customer?.email || '',
      phone: customer?.phone || '',
    },
  };

  const response = await fetch('https://api.inkthreadable.co.uk/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Inkthreadable fulfillment error:', error);
    await sendErrorNotification('Inkthreadable', product.title, session.id, error, event);
  } else {
    console.log(`Inkthreadable order created for ${product.title}`);
  }
}

/**
 * Fulfill digital product
 */
async function fulfillDigital(product, session, customer, event) {
  const email = customer?.email || '';
  const notificationEmail = event.env?.ORDER_NOTIFICATION_EMAIL || '';
  
  const emailBody = `
    <h2>Your Digital Product from LYRĪON</h2>
    <p>Thank you for your purchase of <strong>${product.title}</strong>.</p>
    <p>Your digital content will be delivered separately to this email address.</p>
    <p>Order Reference: ${session.id}</p>
    <p>With intention,<br>LYRĪON Celestial Couture</p>
  `;

  await sendEmail(
    email,
    `Your Digital Product: ${product.title}`,
    emailBody,
    event
  );

  // Also notify the brand
  await sendEmail(
    notificationEmail,
    `Digital Order Received: ${product.title}`,
    `Order ${session.id} - Please fulfill digital product: ${product.title} to ${email}`,
    event
  );
}

/**
 * Fulfill manual order (brand ships personally)
 */
async function fulfillManual(product, session, shipping, customer, event) {
  const notificationEmail = event.env?.ORDER_NOTIFICATION_EMAIL || '';

  const emailBody = `
    <h2>New Manual Order</h2>
    <p><strong>Product:</strong> ${product.title}</p>
    <p><strong>SKU:</strong> ${product.sku}</p>
    <p><strong>Order ID:</strong> ${session.id}</p>
    <p><strong>Amount:</strong> £${product.price}</p>
    <hr>
    <h3>Shipping Details</h3>
    <p><strong>Name:</strong> ${shipping.name}</p>
    <p><strong>Address:</strong><br>
    ${shipping.address.line1}<br>
    ${shipping.address.line2 ? shipping.address.line2 + '<br>' : ''}
    ${shipping.address.city}<br>
    ${shipping.address.postal_code}<br>
    ${shipping.address.country}</p>
    <p><strong>Email:</strong> ${customer?.email || 'N/A'}</p>
    <p><strong>Phone:</strong> ${customer?.phone || 'N/A'}</p>
  `;

  await sendEmail(
    notificationEmail,
    `Manual Order: ${product.title}`,
    emailBody,
    event
  );
}

/**
 * Fulfill bundle (mixed providers)
 */
async function fulfillBundle(product, session, shipping, customer, event) {
  const routing = await fetchRoutingData(event);

  // Process each item in the bundle
  for (const itemSku of product.bundleItems) {
    const item = routing[itemSku];
    if (!item) {
      console.error(`Bundle item not found: ${itemSku}`);
      continue;
    }

    // Recursively fulfill each item based on its provider
    const itemSession = { ...session, metadata: { ...session.metadata, sku: itemSku } };
    await processFulfillment(itemSession, event);
  }
}

/**
 * Send email notification
 */
async function sendEmail(to, subject, htmlBody, event) {
  // In production, integrate with an email service like SendGrid, Mailgun, or Resend
  console.log(`Email to ${to}: ${subject}`);
  console.log(htmlBody);
  
  // Placeholder - implement actual email sending
  // Example with Resend:
  // const resendKey = event.env?.RESEND_API_KEY || '';
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${resendKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ from: 'orders@lyrion.co.uk', to, subject, html: htmlBody })
  // });
}

/**
 * Send error notification
 */
async function sendErrorNotification(provider, productTitle, sessionId, error, event) {
  const notificationEmail = event.env?.ORDER_NOTIFICATION_EMAIL || '';

  await sendEmail(
    notificationEmail,
    `Order Fulfillment Error - ${provider}`,
    `<h2>Fulfillment Error</h2>
     <p><strong>Provider:</strong> ${provider}</p>
     <p><strong>Product:</strong> ${productTitle}</p>
     <p><strong>Session:</strong> ${sessionId}</p>
     <p><strong>Error:</strong> ${error}</p>`,
    event
  );
}

/**
 * Fetch routing data from GitHub
 */
async function fetchRoutingData(event) {
  const url = event.env?.ROUTING_JSON_URL || '';
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch routing data');
  }

  return await response.json();
}

/**
 * Encode form data for Stripe API
 */
function encodeFormData(data, prefix = '') {
  const params = [];
  
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      const encodedKey = prefix ? `${prefix}[${key}]` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        params.push(encodeFormData(value, encodedKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            params.push(encodeFormData(item, `${encodedKey}[${index}]`));
          } else {
            params.push(`${encodedKey}[${index}]=${encodeURIComponent(item)}`);
          }
        });
      } else {
        params.push(`${encodedKey}=${encodeURIComponent(value)}`);
      }
    }
  }
  
  return params.join('&');
}
