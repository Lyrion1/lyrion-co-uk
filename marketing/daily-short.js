/**
 * LYRION Daily Micro Posts
 * 30 cosmic, elegant, intention-focused daily posts
 * Minimal emoji usage, premium tone
 */

export const dailyCosmicPosts = [
  {
    day: 1,
    post: "Morning arrives with cosmic intention. What you wear becomes who you are.",
    cta: "Explore the constellation"
  },
  {
    day: 2,
    post: "The stars don't rush. Neither should your choices. Choose with intention.",
    cta: "Find your sign"
  },
  {
    day: 3,
    post: "Luxury is not in logos. It's in the quiet confidence of knowing your alignment.",
    cta: "Discover your essence"
  },
  {
    day: 4,
    post: "Your wardrobe speaks before you do. Let it tell a celestial story.",
    cta: "Shop Your Sign"
  },
  {
    day: 5,
    post: "Between earth and ether, you exist. Dress for both realms.",
    cta: "Explore your cycle"
  },
  {
    day: 6,
    post: "Quality whispers. Craftsmanship endures. Cosmic intention transforms.",
    cta: "See the collection"
  },
  {
    day: 7,
    post: "The moon changes, yet remains. Find pieces that evolve with you.",
    cta: "Begin your ritual"
  },
  {
    day: 8,
    post: "Elegance is not loud. It's the subtle alignment of self and stars.",
    cta: "Find your alignment"
  },
  {
    day: 9,
    post: "You're not dressing for others. You're honoring your cosmic blueprint.",
    cta: "Honor your sign"
  },
  {
    day: 10,
    post: "Twelve constellations. Twelve signatures. One you.",
    cta: "Explore your sign"
  },
  {
    day: 11,
    post: "What you invest in reflects what you value. Choose celestial intention.",
    cta: "Shop with purpose"
  },
  {
    day: 12,
    post: "Made in England. Aligned with the cosmos. Worn by you.",
    cta: "Discover the craft"
  },
  {
    day: 13,
    post: "The universe doesn't do fast fashion. Neither do we.",
    cta: "Choose timeless"
  },
  {
    day: 14,
    post: "Your sign is more than a symbol. It's an essence to embody.",
    cta: "Wear your essence"
  },
  {
    day: 15,
    post: "Cosmic luxury is quiet confidence meeting intentional design.",
    cta: "Experience LYRION"
  },
  {
    day: 16,
    post: "Between celestial and terrestrial, you find balance. Dress accordingly.",
    cta: "Find your balance"
  },
  {
    day: 17,
    post: "Every constellation tells a story. Yours deserves refined expression.",
    cta: "Tell your story"
  },
  {
    day: 18,
    post: "The stars guide. The fabric follows. You complete the ritual.",
    cta: "Complete your ritual"
  },
  {
    day: 19,
    post: "Minimal design. Maximum intention. Pure cosmic alignment.",
    cta: "Align with your sign"
  },
  {
    day: 20,
    post: "Quality over quantity. Intention over trend. Cosmos over chaos.",
    cta: "Choose quality"
  },
  {
    day: 21,
    post: "Your wardrobe is a ritual. Each piece, a ceremony of self.",
    cta: "Begin the ceremony"
  },
  {
    day: 22,
    post: "Refined elegance for those who honor both earth and ether.",
    cta: "Honor both realms"
  },
  {
    day: 23,
    post: "The cosmos doesn't compete. It simply is. Be the same.",
    cta: "Simply be"
  },
  {
    day: 24,
    post: "Twelve signs. One collection. Your cosmic wardrobe begins here.",
    cta: "Begin your wardrobe"
  },
  {
    day: 25,
    post: "Luxury is knowing exactly who you are and dressing for that truth.",
    cta: "Dress your truth"
  },
  {
    day: 26,
    post: "The stars align when intention meets craftsmanship.",
    cta: "See the alignment"
  },
  {
    day: 27,
    post: "Your constellation whispers. Will you listen?",
    cta: "Listen to the stars"
  },
  {
    day: 28,
    post: "Made with intention. Worn with purpose. Aligned with cosmos.",
    cta: "Wear with purpose"
  },
  {
    day: 29,
    post: "Between fabric and form, magic happens. Experience it.",
    cta: "Experience the magic"
  },
  {
    day: 30,
    post: "The celestial wardrobe knows no season. Only cycles of intention.",
    cta: "Explore your cycle"
  }
];

/**
 * Get post for specific day
 * @param {number} dayNumber - Day of month (1-30)
 * @returns {object} Daily post object
 */
export function getDailyPost(dayNumber) {
  const day = ((dayNumber - 1) % 30) + 1; // Cycle through 30 posts
  return dailyCosmicPosts[day - 1];
}

/**
 * Get today's post based on current date
 * @returns {object} Today's post object
 */
export function getTodaysPost() {
  const today = new Date().getDate();
  return getDailyPost(today);
}

/**
 * Format post with CTA
 * @param {object} post - Post object
 * @param {boolean} includeEmoji - Whether to include minimal emoji
 * @returns {string} Formatted post
 */
export function formatDailyPost(post, includeEmoji = true) {
  const emoji = includeEmoji ? ' ✧' : '';
  return `${post.post}\n\n${post.cta}${emoji}`;
}

/**
 * Get all posts as formatted text
 * @param {boolean} includeEmoji - Whether to include emoji
 * @returns {Array} Array of formatted posts
 */
export function getAllFormattedPosts(includeEmoji = true) {
  return dailyCosmicPosts.map(post => formatDailyPost(post, includeEmoji));
}
