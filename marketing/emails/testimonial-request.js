/**
 * LYRION Testimonial Request Email
 * Elegant request for customer photos and feedback
 * Offers £5 celestial credit incentive
 */

export const testimonialRequestEmail = {
  subject: "Share Your Celestial Story (£5 Credit Inside)",
  preheader: "We'd love to feature you in our Celestial Conclave Showcase",
  
  body: `Dear [Name],

Your [Sign] hoodie has found its home with you, and we couldn't be more grateful.

At LYRĪON, we believe every piece tells a story — not ours, but yours. The way you wear your constellation, the moments you choose to align with your sign, the intention you bring to each day.

We'd be honored if you'd share a photo of yourself wearing your LYRĪON piece for our **Celestial Conclave Showcase** — a curated gallery celebrating our community.

**What We're Hoping For:**
• A photo of you wearing your zodiac hoodie (selfie, mirror shot, or candid — your choice)
• Optional: A sentence or two about what your sign means to you
• Your constellation's energy in visual form

**What You'll Receive:**
• £5 Celestial Credit toward your next LYRĪON purchase
• Feature in our Showcase (with your permission)
• A small thank you from the cosmos (and us)

No professional photography needed. No perfect lighting required. Just you, your piece, and your authentic energy.

[Share Your Photo Button]

Reply to this email with your image, or send via Instagram DM @lyrion.co.uk

Your story matters. Your alignment inspires others.

With gratitude and cosmic intention,  
The LYRĪON Conclave

P.S. Your £5 credit will be emailed within 48 hours of receiving your photo. Use it on anything — hoodies, candles, oracle readings, or gatherings.`,

  cta: "Share Your Photo",
  ctaEmail: "hello@lyrion.co.uk",
  
  timing: "Send 10-14 days after delivery confirmation",
  
  followUpEmail: {
    subject: "Quick reminder: Your £5 Celestial Credit awaits",
    preheader: "We'd still love to feature you in our showcase",
    
    body: `Dear [Name],

Just a gentle cosmic nudge — we'd still love to see how your [Sign] hoodie has integrated into your life.

The Celestial Conclave Showcase is growing beautifully, and your energy would add something special.

**The Offer Still Stands:**
• Share a photo of you in your LYRĪON piece
• Receive £5 Celestial Credit
• Optional feature in our community showcase

No pressure, no rush. Only if it resonates.

[Share Your Photo Button]

Either way, we're grateful you're part of the LYRĪON constellation.

With intention,  
The LYRĪON Conclave`,

    timing: "Send 7 days after first request (optional)"
  }
};

/**
 * Format testimonial request email with personalization
 * @param {string} recipientName - Customer's name
 * @param {string} zodiacSign - Customer's zodiac sign
 * @returns {object} Formatted email
 */
export function formatTestimonialRequest(recipientName, zodiacSign) {
  const formatted = {
    subject: testimonialRequestEmail.subject,
    preheader: testimonialRequestEmail.preheader,
    body: testimonialRequestEmail.body
      .replace(/\[Name\]/g, recipientName)
      .replace(/\[Sign\]/g, zodiacSign),
    cta: testimonialRequestEmail.cta,
    ctaEmail: testimonialRequestEmail.ctaEmail
  };
  
  return formatted;
}

/**
 * Format follow-up email with personalization
 * @param {string} recipientName - Customer's name
 * @param {string} zodiacSign - Customer's zodiac sign
 * @returns {object} Formatted follow-up email
 */
export function formatTestimonialFollowUp(recipientName, zodiacSign) {
  const followUp = testimonialRequestEmail.followUpEmail;
  
  return {
    subject: followUp.subject,
    preheader: followUp.preheader,
    body: followUp.body
      .replace(/\[Name\]/g, recipientName)
      .replace(/\[Sign\]/g, zodiacSign),
    cta: testimonialRequestEmail.cta,
    ctaEmail: testimonialRequestEmail.ctaEmail
  };
}

/**
 * Get testimonial request guidelines for team
 * @returns {object} Guidelines and best practices
 */
export function getTestimonialGuidelines() {
  return {
    timing: {
      initial: "Send 10-14 days after delivery confirmation",
      followUp: "Send 7 days after initial request (optional)",
      note: "Don't send more than one follow-up"
    },
    
    photoRequirements: {
      format: "JPG, PNG, or HEIC",
      minSize: "800x800px recommended",
      style: "Authentic, not overly staged",
      consent: "Always ask permission before featuring publicly"
    },
    
    creditFulfillment: {
      amount: "£5 per photo submission",
      timing: "Within 48 hours of receipt",
      method: "Email unique code or account credit",
      expiry: "No expiration on celestial credits"
    },
    
    showcaseGuidelines: {
      platform: "Website gallery + Instagram highlights",
      attribution: "First name + zodiac sign only (unless more requested)",
      editing: "Minimal editing - maintain authenticity",
      approval: "Always get explicit consent before posting"
    },
    
    responseTemplate: {
      subject: "Your Celestial Credit + Thank You",
      body: `Dear [Name],

Thank you for sharing your celestial story with us. Your [Sign] energy shines through beautifully.

Here's your £5 Celestial Credit: [CODE]

Use it on your next LYRĪON purchase — no minimum, no expiration.

With gratitude,  
The LYRĪON Conclave`
    }
  };
}

/**
 * Track testimonial requests (for internal use)
 * @param {object} customer - Customer object
 * @returns {object} Tracking data
 */
export function createTestimonialTracking(customer) {
  return {
    customerId: customer.id,
    customerEmail: customer.email,
    zodiacSign: customer.zodiacSign,
    purchaseDate: customer.purchaseDate,
    deliveryDate: customer.deliveryDate,
    requestSentDate: null,
    photoReceivedDate: null,
    creditIssuedDate: null,
    creditCode: null,
    featuredInShowcase: false,
    consentGiven: false
  };
}
