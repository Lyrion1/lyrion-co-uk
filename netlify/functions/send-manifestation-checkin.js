/**
 * Netlify Function: Send Manifestation Check-in Email
 * 
 * Sends check-in emails to users who submitted intentions to the Sanctuary.
 */

const { sendEmail, createEmailTemplate } = require('../../lib/email');
const { manifestationCheckIns } = require('../../lib/email-automation-templates');

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
            name,
            intention,
            emailNumber = 1 
        } = JSON.parse(event.body);
        
        // Validate required fields
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }
        
        // Get the correct email from the series
        const emailTemplate = manifestationCheckIns.find(e => e.emailNumber === emailNumber);
        
        if (!emailTemplate) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email number (valid: 1, 2, 3)' })
            };
        }
        
        // Generate email content
        const content = emailTemplate.generateContent(name, intention);
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
                message: `Manifestation check-in email ${emailNumber} sent successfully`,
                result
            })
        };
        
    } catch (error) {
        console.error('Error sending manifestation check-in email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send manifestation check-in email',
                details: error.message
            })
        };
    }
};
