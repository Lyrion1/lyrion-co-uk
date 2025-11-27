/**
 * Netlify Function: Send Abandoned Cart Email
 * 
 * Triggered for users who have items in their cart but haven't completed checkout.
 * Sends reminders at strategic intervals.
 */

const { sendEmail, createEmailTemplate } = require('../../lib/email');
const { abandonedCartEmails } = require('../../lib/email-automation-templates');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        const { 
            email, 
            customerName, 
            cartItems, 
            cartTotal, 
            emailNumber = 1 
        } = JSON.parse(event.body);
        
        // Validate required fields
        if (!email || !cartItems || cartItems.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email and cart items are required' })
            };
        }
        
        // Calculate cart total if not provided, with validation for numeric prices
        const total = cartTotal || cartItems.reduce((sum, item) => {
            const price = Number(item.price);
            const quantity = Number(item.quantity) || 1;
            // Only add to sum if price is a valid number
            if (!isNaN(price) && isFinite(price)) {
                return sum + (price * quantity);
            }
            return sum;
        }, 0);
        
        // Get the correct email from the series
        const emailTemplate = abandonedCartEmails.find(e => e.emailNumber === emailNumber);
        
        if (!emailTemplate) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email number' })
            };
        }
        
        // Generate email content
        const content = emailTemplate.generateContent(customerName, cartItems, total);
        const html = createEmailTemplate(content, emailTemplate.preheader);
        
        // Send the email
        const result = await sendEmail({
            to: email,
            subject: emailTemplate.subject,
            html
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Abandoned cart email ${emailNumber} sent successfully`,
                result
            })
        };
        
    } catch (error) {
        console.error('Error sending abandoned cart email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send abandoned cart email',
                details: error.message
            })
        };
    }
};
