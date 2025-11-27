/**
 * Netlify Function: Send Monthly Cosmic Forecast
 * 
 * Sends the monthly cosmic forecast newsletter to members.
 */

const { sendEmail, createEmailTemplate } = require('../../lib/email');
const { generateMonthlyForecast } = require('../../lib/email-automation-templates');

// Default cosmic forecast data (can be overridden by request body)
const defaultSignForecasts = {
    'Aries': 'Bold initiatives find cosmic support this month. Trust your pioneering instincts.',
    'Taurus': 'Grounding energy flows through your financial sector. Patience yields abundance.',
    'Gemini': 'Communication channels open wide. Share your truth with eloquence.',
    'Cancer': 'Home and heart harmonize. Nurturing connections deepen.',
    'Leo': 'Creative fire burns bright. Step into your spotlight with confidence.',
    'Virgo': 'Details align in your favour. Your meticulous nature serves you well.',
    'Libra': 'Balance returns to partnerships. Harmony flows through connections.',
    'Scorpio': 'Transformation accelerates. Release what no longer serves.',
    'Sagittarius': 'Adventure calls from distant horizons. Expand your perspective.',
    'Capricorn': 'Career momentum builds. Your dedication attracts recognition.',
    'Aquarius': 'Innovation sparks breakthrough ideas. Your vision inspires others.',
    'Pisces': 'Intuition deepens. Trust the whispers of your soul.'
};

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
            month,
            year,
            generalForecast,
            signForecasts = defaultSignForecasts
        } = JSON.parse(event.body);
        
        // Validate required fields
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }
        
        // Get current month and year if not provided
        const now = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const currentMonth = month || months[now.getMonth()];
        const currentYear = year || now.getFullYear();
        
        // Default general forecast if not provided
        const forecast = generalForecast || 
            `As we enter ${currentMonth}, the celestial bodies align in ways that encourage growth, reflection, and alignment with your highest self. This month invites you to trust the cosmic timing and embrace the changes that arise.`;
        
        // Generate the forecast email
        const emailData = generateMonthlyForecast(
            currentMonth, 
            currentYear, 
            forecast, 
            signForecasts
        );
        
        const html = createEmailTemplate(emailData.content, emailData.preheader);
        
        // Send the email
        const result = await sendEmail({
            to: email,
            subject: emailData.subject,
            html
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Monthly cosmic forecast for ${currentMonth} ${currentYear} sent successfully`,
                result
            })
        };
        
    } catch (error) {
        console.error('Error sending monthly forecast:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send monthly cosmic forecast',
                details: error.message
            })
        };
    }
};
