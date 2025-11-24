/**
 * LYRION Launch Email Sequence
 * 4-email sequence for Zodiac Collection launch
 * Premium, subtle, celestial tone
 */

export const launchEmailSequence = [
  {
    emailNumber: 1,
    subject: "The Celestial Wardrobe Has Arrived",
    preheader: "Twelve constellations. One cosmic collection. Made in England.",
    
    body: `Dear [Name],

The stars have aligned, and we're honored to introduce the LYRĪON Zodiac Collection.

Twelve luxury hoodies. Twelve cosmic signatures. Each one crafted in England with intention, designed to honor the essence of your celestial blueprint.

This is not fast fashion. This is cosmic couture — where astrology wears the body with refined elegance.

From Aries' bold pioneering spirit to Pisces' ethereal grace, each piece embodies the unique energy of its constellation. Premium fabric. Minimal design. Maximum intention.

Your sign awaits.

[Shop Your Sign Button]

Discover the collection that moves with the cosmos and honors your earthly form.

With celestial intention,  
The LYRĪON Conclave

P.S. Each piece is made to order in England. Allow 7-10 days for your cosmic alignment to arrive.`,

    cta: "Shop Your Sign",
    ctaUrl: "/shop.html?collection=zodiac-wardrobe"
  },

  {
    emailNumber: 2,
    subject: "Made in England. Aligned with the Cosmos.",
    preheader: "The story behind your celestial wardrobe",
    
    body: `Dear [Name],

There's a reason every LYRĪON piece begins on English soil.

We believe luxury isn't about where you buy from — it's about where what you buy comes from.

Each Zodiac Hoodie is crafted by English artisans who understand that clothing is more than fabric. It's intention made material. It's cosmic alignment meeting human hands.

From constellation to creation, every piece carries:
• Premium organic cotton
• Refined embroidered zodiac details
• Intentional design that honors both comfort and elegance
• Local craftsmanship with global cosmic vision

We chose England not just as a location, but as a philosophy. Quality over quantity. Intention over impulse. Timeless over trend.

Your celestial signature deserves nothing less.

[Explore the Collection Button]

This is cosmic luxury, locally made.

With intention,  
The LYRĪON Conclave

P.S. Curious about your sign's unique design? Each hoodie tells a different celestial story.`,

    cta: "Explore the Collection",
    ctaUrl: "/shop.html?collection=zodiac-wardrobe"
  },

  {
    emailNumber: 3,
    subject: "The Oracle, Gatherings & Rituals: Your Complete Cosmic Experience",
    preheader: "LYRĪON is more than a wardrobe. It's a way of being.",
    
    body: `Dear [Name],

The Zodiac Collection is just the beginning.

LYRĪON exists at the intersection of fashion, astrology, and ritual. We're building a celestial ecosystem where every element serves your cosmic alignment.

**The Oracle**  
Seek guidance. Submit your deepest questions. Receive personalized cosmic insight written specifically for your soul's journey.

**Gatherings**  
Join our intimate celestial events. Connect with like-minded souls. Experience astrology as a lived practice, not just a concept.

**Digital Rituals**  
From lunar tracking to intention-setting guides, our digital offerings help you live in alignment with cosmic cycles.

**The Wardrobe**  
And of course, the clothing — pieces designed to honor your constellation and move with your energy.

This isn't just shopping. It's joining a conclave of souls who believe the cosmos and the everyday are meant to intersect.

[Explore LYRĪON Button]

Your celestial journey extends far beyond what you wear.

With cosmic intention,  
The LYRĪON Conclave

P.S. Already a part of our community? We're grateful for your presence.`,

    cta: "Explore LYRĪON",
    ctaUrl: "/offerings.html"
  },

  {
    emailNumber: 4,
    subject: "Final Hours: Lunar Guide Bonus for Early Aligners",
    preheader: "First 3 buyers receive a complimentary Digital Lunar Guide",
    
    body: `Dear [Name],

Celestial Launch Week draws to a close, but your cosmic alignment is just beginning.

For the first three souls who choose to align their wardrobes with the stars today, we're offering a complimentary Digital Lunar Guide — a £20 value, yours as a gift.

This guide includes:
• Monthly lunar cycle tracking
• Intention-setting rituals for each moon phase
• Personalized cosmic timing for major decisions
• Premium astrology insights delivered to your inbox

The Zodiac Collection launched seven days ago. The response has been profound. Each sign finding its people. Each piece honoring its constellation.

If you've been waiting for a sign (pun intended), this is it.

[Shop Your Sign - Final Call Button]

The stars don't rush. But they do move forward.

Will you move with them?

With final celestial intention,  
The LYRĪON Conclave

P.S. After today, the Lunar Guide bonus returns to standard pricing. This is your moment.`,

    cta: "Shop Your Sign - Final Call",
    ctaUrl: "/shop.html?collection=zodiac-wardrobe",
    
    note: "Send this 7 days after Email 1. Create urgency without pressure."
  }
];

/**
 * Get specific email from launch sequence
 * @param {number} emailNumber - Email number (1-4)
 * @returns {object} Email template object
 */
export function getLaunchEmail(emailNumber) {
  return launchEmailSequence.find(email => email.emailNumber === emailNumber);
}

/**
 * Get all launch emails
 * @returns {Array} Array of all email templates
 */
export function getAllLaunchEmails() {
  return launchEmailSequence;
}

/**
 * Format email body with personalization
 * @param {object} email - Email template object
 * @param {string} recipientName - Recipient's name
 * @returns {string} Formatted email body
 */
export function formatEmailBody(email, recipientName = "Celestial Soul") {
  return email.body.replace(/\[Name\]/g, recipientName);
}

/**
 * Get launch sequence timing guide
 * @returns {object} Timing recommendations
 */
export function getLaunchSequenceTiming() {
  return {
    email1: "Day 1 - 6pm GMT (Launch announcement)",
    email2: "Day 3 - 10am GMT (Story and craftsmanship)",
    email3: "Day 5 - 6pm GMT (Ecosystem overview)",
    email4: "Day 7 - 4pm GMT (Final call with urgency)",
    note: "Allow 2 days between each email to avoid fatigue"
  };
}
