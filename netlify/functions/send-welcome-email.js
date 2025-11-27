/**
 * Netlify Function: Send Welcome Email
 * 
 * Triggered when a new visitor subscribes to the email list.
 * Sends the first email of the welcome series.
 */

const { sendEmail, createEmailTemplate } = require('../../lib/email');
const { welcomeEmailSeries } = require('../../lib/email-automation-templates');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
    
    try {
        const { email, name, emailNumber = 1 } = JSON.parse(event.body);
        
        // Validate required fields
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }
        
        // Get the correct email from the series
        const emailTemplate = welcomeEmailSeries.find(e => e.emailNumber === emailNumber);
        
        if (!emailTemplate) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email number' })
            };
        }
        
        // Generate email content
        const content = emailTemplate.generateContent(name);
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
                message: `Welcome email ${emailNumber} sent successfully`,
                result
            })
        };
        
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send welcome email',
                details: error.message
            })
        };
    }
};
