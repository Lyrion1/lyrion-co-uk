const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
 const sig = event.headers['stripe-signature'];
 const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

 let stripeEvent;

 try {
 stripeEvent = stripe.webhooks.constructEvent(
 event.body,
 sig,
 webhookSecret
 );
 } catch (err) {
 console.error('Webhook signature verification failed:', err.message);
 return {
 statusCode: 400,
 body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
 };
 }

 // Handle successful payment
 if (stripeEvent.type === 'checkout.session.completed') {
 const session = stripeEvent.data.object;

 try {
 // Get full session details including customer info
 const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
 expand: ['line_items', 'customer']
 });

 const shipping = fullSession.shipping_details || session.shipping_details;
 const customer = fullSession.customer_details || session.customer_details;
 
 // Parse items from metadata
 const items = JSON.parse(session.metadata.items);

 // Create Printful order
 const printfulOrder = {
 recipient: {
 name: shipping.name,
 address1: shipping.address.line1,
 address2: shipping.address.line2 || '',
 city: shipping.address.city,
 state_code: shipping.address.state || '',
 country_code: shipping.address.country,
 zip: shipping.address.postal_code,
 email: customer.email,
 phone: customer.phone || ''
 },
 items: items.map(item => ({
 sync_variant_id: parseInt(item.printful_variant_id),
 quantity: item.quantity
 })),
 retail_costs: {
 currency: session.currency.toUpperCase(),
 total: (session.amount_total / 100).toFixed(2),
 shipping: '0.00' // Printful calculates shipping
 }
 };

 console.log('Creating Printful order:', JSON.stringify(printfulOrder, null, 2));

 // Send order to Printful
 const printfulResponse = await fetch('https://api.printful.com/orders', {
 method: 'POST',
 headers: {
 'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
 'Content-Type': 'application/json'
 },
 body: JSON.stringify(printfulOrder)
 });

 const printfulResult = await printfulResponse.json();

 if (printfulResult.code === 200) {
 console.log(' Order successfully sent to Printful:', printfulResult.result.id);
 } else {
 console.error(' Printful order failed:', printfulResult);
 // You might want to send yourself an email alert here
 }

 } catch (error) {
 console.error('Error processing order:', error);
 // Log error but don't fail the webhook
 }
 }

 return {
 statusCode: 200,
 body: JSON.stringify({ received: true })
 };
}
