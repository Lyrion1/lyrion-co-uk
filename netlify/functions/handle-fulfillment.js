// Function to receive Stripe Webhook and submit the order to Gelato
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

// The GelatoConnect API base URL (RESTful)
const GELATO_API_URL = 'https://api.gelato.com/v1/order';

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

        // Extract metadata and shipping details
        const gelatoSku = session.metadata.gelato_sku; 
        const shipping = session.shipping_details.address;
        const customerName = session.customer_details.name;
        const customerEmail = session.customer_details.email;

        // --- 3. Format Order for GELATO API ---
        const orderData = {
            // NOTE: In a production app, you need logic here to grab the correct Gelato Product UID
            orderReferenceId: session.id,
            shipment: {
                shippingMethod: 'STANDARD', 
                customerNotification: true,
                address: {
                    firstName: customerName.split(' ')[0],
                    lastName: customerName.split(' ').slice(1).join(' '),
                    addressLine1: shipping.line1,
                    addressLine2: shipping.line2,
                    city: shipping.city,
                    postCode: shipping.postal_code,
                    country: shipping.country,
                }
            },
            items: lineItems.data.map(item => ({
                productUid: 'YOUR_GELATO_PRODUCT_UID', // PLACEHOLDER: Must be replaced with the actual Gelato UID for the purchased item
                quantity: item.quantity,
                // The fulfillment process needs a secure image link to the print file
                fileUrl: 'YOUR_SECURE_PRINT_FILE_URL', 
                // You would pass the design ID from your Gelato catalogue here
                designId: 'YOUR_GELATO_DESIGN_ID'
            }))
        };
        
        // --- 4. Submit Order to Gelato ---
        try {
            const gelatoResponse = await fetch(GELATO_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': process.env.GELATO_API_KEY, 
                },
                body: JSON.stringify(orderData)
            });

            if (!gelatoResponse.ok) {
                const errorBody = await gelatoResponse.text();
                throw new Error(`Gelato submission failed: ${gelatoResponse.status} - ${errorBody}`);
            }

            console.log(`Gelato Order Submitted: ${orderData.orderReferenceId}`);
            // Return 200 OK to Stripe to confirm receipt
            return { statusCode: 200, body: JSON.stringify({ received: true }) };

        } catch (gelatoError) {
            console.error('GELATO INTEGRATION FAILED:', gelatoError.message);
            // In a real app, this should trigger an alert for manual fulfillment review
            return { statusCode: 500, body: 'Gelato fulfillment error.' };
        }
    }

    // Return 200 OK for unhandled events
    return { statusCode: 200, body: 'Event received but not handled.' };
};
