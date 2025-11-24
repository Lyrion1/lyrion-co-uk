/**
 * LYRION Social Media Templates
 * 12 Micro Social Captions for Zodiac Hoodie Promotion
 * Premium, poetic, and concise format
 */

export const zodiacSocialCaptions = [
  {
    sign: "Aries",
    caption: "The pioneer spirit wears courage like a second skin. Your celestial signature awaits in refined form. Explore your sign ✧",
    emojiFreeCaption: "The pioneer spirit wears courage like a second skin. Your celestial signature awaits in refined form. Explore your sign."
  },
  {
    sign: "Taurus",
    caption: "Luxury meets earth's ancient wisdom in every thread. Material grace for those who know true value. Explore your sign ✧",
    emojiFreeCaption: "Luxury meets earth's ancient wisdom in every thread. Material grace for those who know true value. Explore your sign."
  },
  {
    sign: "Gemini",
    caption: "Duality woven into cosmic fabric, where both souls find their voice. The storyteller's wardrobe begins here. Explore your sign ✧",
    emojiFreeCaption: "Duality woven into cosmic fabric, where both souls find their voice. The storyteller's wardrobe begins here. Explore your sign."
  },
  {
    sign: "Cancer",
    caption: "Emotion distilled into elegance, where home and stars become one. The nurturer's celestial embrace. Explore your sign ✧",
    emojiFreeCaption: "Emotion distilled into elegance, where home and stars become one. The nurturer's celestial embrace. Explore your sign."
  },
  {
    sign: "Leo",
    caption: "Radiance demands refined expression. Command your throne in cosmic luxury crafted for sovereignty. Explore your sign ✧",
    emojiFreeCaption: "Radiance demands refined expression. Command your throne in cosmic luxury crafted for sovereignty. Explore your sign."
  },
  {
    sign: "Virgo",
    caption: "Precision meets poetry in every deliberate stitch. The perfectionist's dream woven into celestial form. Explore your sign ✧",
    emojiFreeCaption: "Precision meets poetry in every deliberate stitch. The perfectionist's dream woven into celestial form. Explore your sign."
  },
  {
    sign: "Libra",
    caption: "Balance embodied between earth and ether. Beauty finds its perfect form in harmonious design. Explore your sign ✧",
    emojiFreeCaption: "Balance embodied between earth and ether. Beauty finds its perfect form in harmonious design. Explore your sign."
  },
  {
    sign: "Scorpio",
    caption: "Intensity distilled into cosmic couture. Transformation begins where mystery meets material grace. Explore your sign ✧",
    emojiFreeCaption: "Intensity distilled into cosmic couture. Transformation begins where mystery meets material grace. Explore your sign."
  },
  {
    sign: "Sagittarius",
    caption: "Wanderlust woven into celestial elegance. The seeker's journey begins within refined fabric. Explore your sign ✧",
    emojiFreeCaption: "Wanderlust woven into celestial elegance. The seeker's journey begins within refined fabric. Explore your sign."
  },
  {
    sign: "Capricorn",
    caption: "Ambition dressed in cosmic refinement. Build your legacy one celestial piece at a time. Explore your sign ✧",
    emojiFreeCaption: "Ambition dressed in cosmic refinement. Build your legacy one celestial piece at a time. Explore your sign."
  },
  {
    sign: "Aquarius",
    caption: "Visionary elegance for the cosmic rebel. Forward-thinking design where revolution meets refinement. Explore your sign ✧",
    emojiFreeCaption: "Visionary elegance for the cosmic rebel. Forward-thinking design where revolution meets refinement. Explore your sign."
  },
  {
    sign: "Pisces",
    caption: "Where celestial meets ethereal in dreamlike form. Swim through stardust in cosmic grace. Explore your sign ✧",
    emojiFreeCaption: "Where celestial meets ethereal in dreamlike form. Swim through stardust in cosmic grace. Explore your sign."
  }
];

/**
 * Get social caption for a specific zodiac sign
 * @param {string} sign - Zodiac sign name
 * @param {boolean} includeEmoji - Whether to include emoji in caption
 * @returns {string} Social media caption
 */
export function getSocialCaption(sign, includeEmoji = true) {
  const template = zodiacSocialCaptions.find(
    t => t.sign.toLowerCase() === sign.toLowerCase()
  );
  
  if (!template) {
    return null;
  }
  
  return includeEmoji ? template.caption : template.emojiFreeCaption;
}

/**
 * Get all captions (useful for batch export)
 * @param {boolean} includeEmoji - Whether to include emoji versions
 * @returns {Array} Array of captions
 */
export function getAllCaptions(includeEmoji = true) {
  return zodiacSocialCaptions.map(template => ({
    sign: template.sign,
    caption: includeEmoji ? template.caption : template.emojiFreeCaption
  }));
}
