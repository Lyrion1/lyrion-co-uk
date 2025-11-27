/**
 * Netlify Function: Send Post-Purchase Emails
 * 
 * Handles order confirmation, shipping notification, and delivery confirmation emails.
 */

const { sendEmail, createEmailTemplate } = require('../../lib/email');
const { postPurchaseEmails } = require('../../lib/email-automation-templates');

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
            emailType,
            orderDetails,
            recommendations = []
        } = JSON.parse(event.body);
        
        // Validate required fields
        if (!email || !emailType || !orderDetails) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    error: 'Email, emailType, and orderDetails are required' 
                })
            };
        }
        
        // Get the appropriate email template
        let emailTemplate;
        let content;
        
        switch (emailType) {
            case 'orderConfirmation':
                emailTemplate = postPurchaseEmails.orderConfirmation;
                content = emailTemplate.generateContent(orderDetails);
                break;
                
            case 'shippingNotification':
                emailTemplate = postPurchaseEmails.shippingNotification;
                content = emailTemplate.generateContent(orderDetails);
                break;
                
            case 'deliveryConfirmation':
                emailTemplate = postPurchaseEmails.deliveryConfirmation;
                content = emailTemplate.generateContent(orderDetails, recommendations);
                break;
                
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Invalid emailType. Must be: orderConfirmation, shippingNotification, or deliveryConfirmation' 
                    })
                };
        }
        
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
                message: `${emailType} email sent successfully`,
                result
            })
        };
        
    } catch (error) {
        console.error('Error sending post-purchase email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send post-purchase email',
                details: error.message
            })
        };
    }
};
