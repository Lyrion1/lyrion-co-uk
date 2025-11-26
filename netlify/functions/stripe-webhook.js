// Stripe Webhook Handler for payment events
// Processes successful payments and triggers fulfillment

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    const sig = event.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let stripeEvent;

    try {
        // Verify the webhook signature
        stripeEvent = stripe.webhooks.constructEvent(
            event.body,
            sig,
            endpointSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
        };
    }

    // Handle the event
    switch (stripeEvent.type) {
        case 'checkout.session.completed':
            const session = stripeEvent.data.object;
            await handleSuccessfulPayment(session);
            break;

        case 'payment_intent.succeeded':
            const paymentIntent = stripeEvent.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = stripeEvent.data.object;
            console.log('Payment failed:', failedPayment.id);
            break;

        default:
            console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ received: true })
    };
};

/**
 * Handle successful payment - trigger fulfillment
 * @param {Object} session - Stripe checkout session
 */
async function handleSuccessfulPayment(session) {
    console.log('Processing successful payment:', session.id);

    const customerEmail = session.customer_details?.email;
    const metadata = session.metadata || {};
    const gelatoSku = metadata.gelato_sku || metadata.product_id || null;

    // Log order details
    console.log('Customer email:', customerEmail);
    console.log('Product SKU:', gelatoSku || 'Not specified');
    console.log('Amount paid:', session.amount_total / 100, 'GBP');

    // Here you would typically:
    // 1. Save order to database
    // 2. Trigger Gelato POD fulfillment
    // 3. Send confirmation email to customer

    if (!gelatoSku) {
        console.log('No product SKU in metadata - standard cart checkout');
        return;
    }

    // For digital products like Oracle readings
    if (gelatoSku === 'PREMIUM-ORACLE-READING') {
        console.log('Digital product - Oracle reading purchased');
        // Trigger oracle reading delivery
    }

    // For physical products - trigger Gelato fulfillment
    if (gelatoSku !== 'DONATION' && gelatoSku !== 'PREMIUM-ORACLE-READING') {
        console.log('Physical product - trigger Gelato fulfillment for:', gelatoSku);
        // Call Gelato API or fulfillment function
    }
}
