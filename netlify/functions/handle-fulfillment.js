// Function to receive Stripe Webhook and submit the order to multiple POD providers
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

// POD Provider API URLs
const GELATO_API_URL = 'https://api.gelato.com/v1/order';

// Utility function to safely split customer name
function splitCustomerName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return { firstName: 'Customer', lastName: '' };
    }
    const nameParts = fullName.trim().split(' ');
    return {
        firstName: nameParts[0] || 'Customer',
        lastName: nameParts.slice(1).join(' ') || ''
    };
}

exports.handler = async ({ body, headers }) => {
    // 1. Verify the Webhook Signature
    const signature = headers['stripe-signature'];
    let event;

    try {
        // Use the raw body to verify the signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    // 2. Handle the 'checkout.session.completed' Event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // Validate required data
        if (!session.shipping_details || !session.shipping_details.address) {
            console.error('Missing shipping details in session');
            return { statusCode: 400, body: 'Missing shipping details' };
        }
        if (!session.customer_details) {
            console.error('Missing customer details in session');
            return { statusCode: 400, body: 'Missing customer details' };
        }

        // Extract metadata and shipping details
        const shipping = session.shipping_details.address;
        const customerName = session.customer_details.name || 'Customer';
        const customerEmail = session.customer_details.email || '';

        // Identify POD service from metadata (default to Gelato)
        const podService = session.metadata?.pod_service || 'gelato';

        // 3. Route order to the correct POD provider based on metadata
        switch (podService.toLowerCase()) {
            case 'gelato':
                return await submitToGelato(session, lineItems, shipping, customerName, customerEmail);
            
            case 'printify':
                return await submitToPrintify(session, lineItems, shipping, customerName, customerEmail);
            
            case 'inkthreadable':
                return await submitToInkthreadable(session, lineItems, shipping, customerName, customerEmail);
            
            default:
                console.warn(`Unknown POD service: ${podService}, defaulting to Gelato`);
                return await submitToGelato(session, lineItems, shipping, customerName, customerEmail);
        }
    }

    // Return 200 OK for unhandled events
    return { statusCode: 200, body: 'Event received but not handled.' };
};

// Gelato Order Submission
async function submitToGelato(session, lineItems, shipping, customerName, customerEmail) {
    const { firstName, lastName } = splitCustomerName(customerName);
    
    const orderData = {
        orderReferenceId: session.id,
        shipment: {
            shippingMethod: 'STANDARD', 
            customerNotification: true,
            address: {
                firstName: firstName,
                lastName: lastName,
                addressLine1: shipping.line1 || '',
                addressLine2: shipping.line2 || '',
                city: shipping.city || '',
                postCode: shipping.postal_code || '',
                country: shipping.country || '',
            }
        },
        items: lineItems.data.map(item => ({
            productUid: 'YOUR_GELATO_PRODUCT_UID',
            quantity: item.quantity,
            fileUrl: 'YOUR_SECURE_PRINT_FILE_URL',
            designId: 'YOUR_GELATO_DESIGN_ID'
        }))
    };
    
    try {
        const response = await fetch(GELATO_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.GELATO_API_KEY,
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gelato submission failed: ${response.status} - ${errorBody}`);
        }

        console.log(`Gelato Order Submitted: ${orderData.orderReferenceId}`);
        return { statusCode: 200, body: JSON.stringify({ received: true, provider: 'gelato' }) };

    } catch (error) {
        console.error('GELATO INTEGRATION FAILED:', error.message);
        return { statusCode: 500, body: 'Gelato fulfillment error.' };
    }
}

// Printify Order Submission
async function submitToPrintify(session, lineItems, shipping, customerName, customerEmail) {
    const { firstName, lastName } = splitCustomerName(customerName);
    
    const orderData = {
        external_id: session.id,
        label: `Order ${session.id}`,
        line_items: lineItems.data.map(item => ({
            product_id: 'YOUR_PRINTIFY_PRODUCT_ID',
            variant_id: 'YOUR_PRINTIFY_VARIANT_ID',
            quantity: item.quantity
        })),
        shipping_method: 1, // Standard shipping
        send_shipping_notification: true,
        address_to: {
            first_name: firstName,
            last_name: lastName,
            email: customerEmail,
            address1: shipping.line1 || '',
            address2: shipping.line2 || '',
            city: shipping.city || '',
            zip: shipping.postal_code || '',
            country: shipping.country || ''
        }
    };
    
    try {
        const response = await fetch('https://api.printify.com/v1/shops/YOUR_SHOP_ID/orders.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PRINTIFY_API_KEY}`,
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Printify submission failed: ${response.status} - ${errorBody}`);
        }

        console.log(`Printify Order Submitted: ${orderData.external_id}`);
        return { statusCode: 200, body: JSON.stringify({ received: true, provider: 'printify' }) };

    } catch (error) {
        console.error('PRINTIFY INTEGRATION FAILED:', error.message);
        return { statusCode: 500, body: 'Printify fulfillment error.' };
    }
}

// Inkthreadable Order Submission
async function submitToInkthreadable(session, lineItems, shipping, customerName, customerEmail) {
    const orderData = {
        order_reference: session.id,
        customer: {
            name: customerName,
            email: customerEmail,
            address: {
                line1: shipping.line1,
                line2: shipping.line2 || '',
                city: shipping.city,
                postcode: shipping.postal_code,
                country: shipping.country
            }
        },
        items: lineItems.data.map(item => ({
            sku: 'YOUR_INKTHREADABLE_SKU',
            quantity: item.quantity,
            print_file_url: 'YOUR_SECURE_PRINT_FILE_URL'
        })),
        shipping_method: 'standard'
    };
    
    try {
        const response = await fetch('https://api.inkthreadable.co.uk/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.INKTHREADABLE_SECRET_KEY}`,
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Inkthreadable submission failed: ${response.status} - ${errorBody}`);
        }

        console.log(`Inkthreadable Order Submitted: ${orderData.order_reference}`);
        return { statusCode: 200, body: JSON.stringify({ received: true, provider: 'inkthreadable' }) };

    } catch (error) {
        console.error('INKTHREADABLE INTEGRATION FAILED:', error.message);
        return { statusCode: 500, body: 'Inkthreadable fulfillment error.' };
    }
}
