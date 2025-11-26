const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

    try {
        const { items } = JSON.parse(event.body);

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
            if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                throw new Error('Invalid item: quantity must be a positive integer');
            }
        }

        // Create line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                    metadata: {
                        printful_variant_id: item.variantId || '',
                        printful_product_id: item.productId || ''
                    }
                },
                unit_amount: Math.round(parseFloat(item.price) * 100), // Convert to pence
            },
            quantity: item.quantity
        }));

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.URL}/products/shop.html`,
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'IE', 'AT', 'SE', 'DK', 'NO', 'FI']
            },
            metadata: {
                items: JSON.stringify(items.map(item => ({
                    printful_variant_id: item.variantId || '',
                    quantity: item.quantity
                })))
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                sessionId: session.id,
                url: session.url
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
