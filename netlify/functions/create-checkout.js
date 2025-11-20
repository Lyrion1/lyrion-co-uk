// Function to securely initiate a Stripe Checkout Session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { productData } = JSON.parse(event.body);

        // Map your simple product data to Stripe's line item format
        const lineItems = [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: productData.name,
                        // In a real legacy system, you would grab a specific image URL here
                        images: ['https://lyrion-celestiale.netlify.app/assets/img/logo-circle.jpg'], 
                    },
                    unit_amount: Math.round(productData.price * 100), // Convert GBP to pence
                },
                quantity: 1,
            },
        ];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // Redirect URLs after success or failure
            success_url: `${process.env.URL}/shop.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL}/shop.html?status=cancelled`,
            metadata: {
                gelato_sku: productData.id, // Pass SKU to fulfillment function later
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id }),
        };

    } catch (error) {
        console.error('Stripe Checkout Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
