// Safely initialize Stripe - only if secret key is available
let stripe = null;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (STRIPE_SECRET_KEY) {
    try {
        stripe = require('stripe')(STRIPE_SECRET_KEY);
    } catch (e) {
        console.error('Failed to initialize Stripe:', e.message);
    }
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Check if Stripe is properly configured
    if (!stripe) {
        console.error('Stripe not configured - STRIPE_SECRET_KEY missing');
        return {
            statusCode: 503,
            headers,
            body: JSON.stringify({ 
                error: 'Checkout service not configured. Please contact support.',
                code: 'STRIPE_NOT_CONFIGURED'
            })
        };
    }

    try {
        const { items } = JSON.parse(event.body || '{}');

        if (!items || items.length === 0) {
            throw new Error('No items in cart');
        }

        // Validate item properties
        for (const item of items) {
            if (!item.name || !item.price || !item.quantity) {
                throw new Error('Invalid item: missing required fields (name, price, quantity)');
            }
            const price = parseFloat(item.price);
            if (isNaN(price) || price <= 0) {
                throw new Error('Invalid item: price must be a positive number');
            }
            const quantity = parseInt(item.quantity, 10);
            if (isNaN(quantity) || quantity <= 0) {
                throw new Error('Invalid item: quantity must be a positive integer');
            }
        }

        // Determine if any item requires shipping (POD products)
        const requiresShipping = items.some(item => item.product_type === 'pod');

        // Create line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                    metadata: {
                        printful_variant_id: item.variantId || '',
                        printful_product_id: item.productId || '',
                        product_type: item.product_type || 'digital'
                    }
                },
                unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to pence
            },
            quantity: parseInt(item.quantity, 10)
        }));

        // Build session options for embedded checkout
        const sessionOptions = {
            ui_mode: 'embedded',
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            return_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                items: JSON.stringify(items.map(item => ({
                    printful_variant_id: item.variantId || '',
                    printful_product_id: item.productId || '',
                    quantity: parseInt(item.quantity, 10),
                    product_type: item.product_type || 'digital'
                })))
            }
        };

        // Only require shipping for POD products
        if (requiresShipping) {
            sessionOptions.shipping_address_collection = {
                allowed_countries: ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'IE', 'AT', 'SE', 'DK', 'NO', 'FI']
            };
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create(sessionOptions);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                clientSecret: session.client_secret
            })
        };

    } catch (error) {
        console.error('Checkout error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};
