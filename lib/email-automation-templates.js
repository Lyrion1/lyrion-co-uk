/**
 * Email Automation Templates for LYRĪON
 * 
 * This module provides email templates for various automation flows:
 * - Welcome email series
 * - Abandoned cart emails
 * - Post-purchase emails
 * - Manifestation check-ins (Sanctuary)
 * - Monthly cosmic forecasts
 */

const { escapeHtml } = require('./email');

/**
 * Welcome Email Series - 3 emails over 7 days
 */
const welcomeEmailSeries = [
  {
    emailNumber: 1,
    subject: 'Welcome to Your Celestial Journey ✧',
    preheader: 'Begin your alignment with the cosmos',
    delay: 0, // Sent immediately
    generateContent: (name = '') => {
      const greeting = name ? `Dear ${escapeHtml(name)},` : 'Celestial Seeker,';
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Welcome to LYRĪON</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Thank you for joining our celestial community. You've taken the first step toward 
          aligning with the cosmic energies that guide your path.
        </p>
        <p style="color: #5a5856; line-height: 1.8;">
          At LYRĪON, we believe that the stars hold wisdom for those who seek it. Our curated 
          offerings are designed to help you connect with your celestial essence.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lyrion.co.uk/shop.html" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Explore Our Offerings ✧
          </a>
        </div>
      `;
    }
  },
  {
    emailNumber: 2,
    subject: 'Discover Your Zodiac Alignment ✧',
    preheader: 'Offerings aligned with your celestial sign',
    delay: 3, // Days after signup
    generateContent: (name = '') => {
      const greeting = name ? `Dear ${escapeHtml(name)},` : 'Celestial Seeker,';
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Your Zodiac Awaits</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Each zodiac sign carries unique celestial energy. Discover offerings specifically 
          aligned with your cosmic blueprint.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lyrion.co.uk/shop.html?collection=zodiac-wardrobe" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
            View Zodiac Collection ✧
          </a>
        </div>
      `;
    }
  },
  {
    emailNumber: 3,
    subject: 'Seek Wisdom from the Oracle ✧',
    preheader: 'Your complimentary oracle reading awaits',
    delay: 7, // Days after signup
    generateContent: (name = '') => {
      const greeting = name ? `Dear ${escapeHtml(name)},` : 'Celestial Seeker,';
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">The Oracle Speaks</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          The celestial bodies have aligned to offer you guidance. Visit our Oracle 
          for a complimentary reading that may illuminate your path.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lyrion.co.uk/oracle/" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Consult the Oracle ✧
          </a>
        </div>
      `;
    }
  }
];

/**
 * Abandoned Cart Emails - 3 emails over 72 hours
 */
const abandonedCartEmails = [
  {
    emailNumber: 1,
    subject: 'Your Celestial Items Await ✧',
    preheader: 'Complete your cosmic alignment',
    delay: 1, // Hours after cart abandonment
    generateContent: (customerName = '', cartItems = [], cartTotal = 0) => {
      const greeting = customerName ? `Dear ${escapeHtml(customerName)},` : 'Celestial Seeker,';
      const itemsHtml = cartItems.map(item => 
        `<li style="margin-bottom: 10px;">${escapeHtml(item.name || '')} - £${Number(item.price).toFixed(2)}</li>`
      ).join('');
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">You Left Something Behind</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          The cosmos noticed you were drawn to these celestial offerings but haven't 
          completed your journey yet.
        </p>
        <div style="background-color: #f4efe8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul style="color: #5a5856; list-style: none; padding: 0;">${itemsHtml}</ul>
          <p style="color: #C4A449; font-weight: 600; margin-top: 15px;">Total: £${Number(cartTotal).toFixed(2)}</p>
        </div>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lyrion.co.uk/shop.html" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Complete Your Order ✧
          </a>
        </div>
      `;
    }
  },
  {
    emailNumber: 2,
    subject: 'The Stars Are Aligned For You ✧',
    preheader: 'Your items are still waiting',
    delay: 24, // Hours after cart abandonment
    generateContent: (customerName = '', cartItems = [], cartTotal = 0) => {
      const greeting = customerName ? `Dear ${escapeHtml(customerName)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">A Gentle Cosmic Reminder</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Your celestial items are still reserved and waiting for you. The alignment 
          that drew you to them remains strong.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lyrion.co.uk/shop.html" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Return to Your Cart ✧
          </a>
        </div>
      `;
    }
  },
  {
    emailNumber: 3,
    subject: 'Final Cosmic Call ✧',
    preheader: 'Last chance to claim your celestial items',
    delay: 72, // Hours after cart abandonment
    generateContent: (customerName = '', cartItems = [], cartTotal = 0) => {
      const greeting = customerName ? `Dear ${escapeHtml(customerName)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">The Stars Shift Soon</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          This is a gentle final reminder that your celestial items await. The cosmic 
          window for this alignment is closing.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lyrion.co.uk/shop.html" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Complete Your Journey ✧
          </a>
        </div>
      `;
    }
  }
];

/**
 * Post-Purchase Emails
 */
const postPurchaseEmails = {
  orderConfirmation: {
    subject: 'Your Order is Confirmed ✧',
    preheader: 'Thank you for your celestial purchase',
    generateContent: (orderDetails = {}) => {
      const { orderNumber = '', customerName = '', items = [], total = 0 } = orderDetails;
      const greeting = customerName ? `Dear ${escapeHtml(customerName)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Order Confirmed</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Thank you for your order. Your celestial items are being prepared with care.
        </p>
        ${orderNumber ? `<p style="color: #C4A449;">Order #${escapeHtml(orderNumber)}</p>` : ''}
        <p style="color: #5a5856;">We'll send you a notification when your order ships.</p>
      `;
    }
  },
  shippingNotification: {
    subject: 'Your Order is On Its Way ✧',
    preheader: 'Your celestial items have shipped',
    generateContent: (orderDetails = {}) => {
      const { orderNumber = '', customerName = '', trackingNumber = '' } = orderDetails;
      const greeting = customerName ? `Dear ${escapeHtml(customerName)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Your Order Has Shipped</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Your celestial items are now journeying to you across the cosmos.
        </p>
        ${orderNumber ? `<p style="color: #C4A449;">Order #${escapeHtml(orderNumber)}</p>` : ''}
        ${trackingNumber ? `<p style="color: #5a5856;">Tracking: ${escapeHtml(trackingNumber)}</p>` : ''}
      `;
    }
  },
  deliveryConfirmation: {
    subject: 'Your Celestial Items Have Arrived ✧',
    preheader: 'Your order has been delivered',
    generateContent: (orderDetails = {}, recommendations = []) => {
      const { customerName = '' } = orderDetails;
      const greeting = customerName ? `Dear ${escapeHtml(customerName)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Delivery Complete</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Your celestial items have arrived. May they bring you alignment and cosmic wisdom.
        </p>
        <p style="color: #5a5856; line-height: 1.8;">
          We'd love to hear about your experience with our offerings.
        </p>
      `;
    }
  }
};

/**
 * Manifestation Check-in Emails (Sanctuary)
 */
const manifestationCheckIns = [
  {
    emailNumber: 1,
    subject: 'Your Intention Has Been Set ✧',
    preheader: 'The universe has received your manifestation',
    delay: 0, // Sent immediately
    generateContent: (name = '', intention = '') => {
      const greeting = name ? `Dear ${escapeHtml(name)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Intention Received</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Your intention has been sent into the cosmos. The Sanctuary holds your 
          manifestation with sacred care.
        </p>
        ${intention ? `
          <div style="background: linear-gradient(135deg, rgba(196, 164, 73, 0.1) 0%, rgba(244, 239, 232, 0.3) 100%); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C4A449;">
            <p style="color: #151311; font-style: italic;">"${escapeHtml(intention)}"</p>
          </div>
        ` : ''}
        <p style="color: #5a5856; line-height: 1.8;">
          Return to the Sanctuary regularly to nurture your intention.
        </p>
      `;
    }
  },
  {
    emailNumber: 2,
    subject: 'How Is Your Manifestation Growing? ✧',
    preheader: 'A gentle check-in from the Sanctuary',
    delay: 7, // Days after initial intention
    generateContent: (name = '', intention = '') => {
      const greeting = name ? `Dear ${escapeHtml(name)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Cosmic Check-In</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Seven days have passed since you set your intention. The cosmos moves in 
          mysterious ways—have you noticed any shifts in your alignment?
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://lyrion.co.uk/sanctuary/" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Visit the Sanctuary ✧
          </a>
        </div>
      `;
    }
  },
  {
    emailNumber: 3,
    subject: 'Your Manifestation Journey Continues ✧',
    preheader: 'Reflect on your cosmic progress',
    delay: 21, // Days after initial intention
    generateContent: (name = '', intention = '') => {
      const greeting = name ? `Dear ${escapeHtml(name)},` : 'Celestial Seeker,';
      
      return `
        <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">Manifestation Progress</h2>
        <p style="color: #151311;">${greeting}</p>
        <p style="color: #5a5856; line-height: 1.8;">
          Three weeks have passed since you planted the seed of your intention. 
          Take a moment to reflect on your journey and celebrate any progress.
        </p>
        <p style="color: #5a5856; line-height: 1.8;">
          Remember: manifestation is a practice, not a destination. Continue to 
          align with your intention each day.
        </p>
      `;
    }
  }
];

/**
 * Generate Monthly Cosmic Forecast Email
 * @param {string} month - Month name
 * @param {number} year - Year
 * @param {string} generalForecast - General cosmic overview
 * @param {Object} signForecasts - Forecasts by zodiac sign
 * @returns {Object} - Email data
 */
function generateMonthlyForecast(month, year, generalForecast, signForecasts = {}) {
  const signsHtml = Object.entries(signForecasts).map(([sign, forecast]) => `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f4efe8; border-radius: 8px;">
      <h4 style="color: #C4A449; margin: 0 0 10px 0;">✧ ${sign}</h4>
      <p style="color: #5a5856; margin: 0; font-size: 14px;">${forecast}</p>
    </div>
  `).join('');

  const content = `
    <h2 style="color: #C4A449; text-align: center; margin-bottom: 30px;">
      Cosmic Forecast: ${month} ${year}
    </h2>
    <p style="color: #5a5856; line-height: 1.8; margin-bottom: 30px;">
      ${generalForecast}
    </p>
    <h3 style="color: #C4A449; margin: 30px 0 20px;">Your Sign's Guidance</h3>
    ${signsHtml}
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://lyrion.co.uk/shop.html" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Explore Cosmic Offerings ✧
      </a>
    </div>
  `;

  return {
    subject: `Your Cosmic Forecast for ${month} ${year} ✧`,
    preheader: `Celestial guidance for ${month} ${year}`,
    content
  };
}

module.exports = {
  welcomeEmailSeries,
  abandonedCartEmails,
  postPurchaseEmails,
  manifestationCheckIns,
  generateMonthlyForecast
};
