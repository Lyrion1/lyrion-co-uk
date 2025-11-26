/**
 * LYRION Marketing Automation Functions
 * Weekly sign rotator and marketing utilities
 */

// Default fallback sign when calculation fails
const DEFAULT_FALLBACK_SIGN = 'Sagittarius';

// Zodiac signs in order for weekly rotation
const zodiacSigns = [
  'Aries',
  'Taurus', 
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
];

// Sign details for marketing purposes
const signDetails = {
  Aries: {
    element: 'Fire',
    traits: 'The pioneer spirit. Bold, courageous, and driven by pure intention. Aries energy moves first, asks questions later, and leads with passionate confidence.',
    dates: 'March 21 - April 19',
    color: '#E74C3C',
    icon: '♈'
  },
  Taurus: {
    element: 'Earth',
    traits: 'The keeper of earthly wisdom. Grounded, sensual, and deeply connected to material beauty. Taurus honors luxury not as excess, but as appreciation for quality.',
    dates: 'April 20 - May 20',
    color: '#27AE60',
    icon: '♉'
  },
  Gemini: {
    element: 'Air',
    traits: 'The cosmic storyteller. Curious, adaptable, and endlessly communicative. Gemini holds space for duality, where multiple truths coexist in elegant harmony.',
    dates: 'May 21 - June 20',
    color: '#F39C12',
    icon: '♊'
  },
  Cancer: {
    element: 'Water',
    traits: 'The celestial nurturer. Emotional depth meets protective grace. Cancer creates home wherever they go, turning space into sanctuary through pure intention.',
    dates: 'June 21 - July 22',
    color: '#95A5A6',
    icon: '♋'
  },
  Leo: {
    element: 'Fire',
    traits: 'The radiant sovereign. Confident, generous, and born to shine. Leo energy demands attention not through force, but through the natural magnetism of authentic self-expression.',
    dates: 'July 23 - August 22',
    color: '#E67E22',
    icon: '♌'
  },
  Virgo: {
    element: 'Earth',
    traits: 'The cosmic perfectionist. Precise, analytical, and devoted to refinement. Virgo sees beauty in details others miss and finds poetry in practical excellence.',
    dates: 'August 23 - September 22',
    color: '#16A085',
    icon: '♍'
  },
  Libra: {
    element: 'Air',
    traits: 'The harmonist of the zodiac. Balanced, diplomatic, and aesthetically driven. Libra seeks beauty not just in art, but in relationships, justice, and everyday grace.',
    dates: 'September 23 - October 22',
    color: '#3498DB',
    icon: '♎'
  },
  Scorpio: {
    element: 'Water',
    traits: 'The cosmic alchemist. Intense, transformative, and mysteriously magnetic. Scorpio energy turns darkness into depth, secrets into wisdom, pain into power.',
    dates: 'October 23 - November 21',
    color: '#8E44AD',
    icon: '♏'
  },
  Sagittarius: {
    element: 'Fire',
    traits: 'The eternal seeker. Adventurous, philosophical, and optimistically free. Sagittarius finds meaning in movement and wisdom in wandering the cosmic landscape.',
    dates: 'November 22 - December 21',
    color: '#C0392B',
    icon: '♐'
  },
  Capricorn: {
    element: 'Earth',
    traits: 'The celestial architect. Ambitious, disciplined, and timelessly patient. Capricorn builds legacy one deliberate step at a time, honoring both effort and outcome.',
    dates: 'December 22 - January 19',
    color: '#34495E',
    icon: '♑'
  },
  Aquarius: {
    element: 'Air',
    traits: 'The cosmic visionary. Innovative, independent, and humanitarianly focused. Aquarius sees the future before it arrives and brings revolution through refined intention.',
    dates: 'January 20 - February 18',
    color: '#1ABC9C',
    icon: '♒'
  },
  Pisces: {
    element: 'Water',
    traits: 'The celestial dreamer. Intuitive, empathetic, and ethereally creative. Pisces dissolves boundaries between reality and imagination, finding magic in everyday existence.',
    dates: 'February 19 - March 20',
    color: '#9B59B6',
    icon: '♓'
  }
};

/**
 * Get the current week's featured zodiac sign
 * Automatically rotates through all 12 signs based on week of year
 * @returns {string} Current week's zodiac sign
 */
function getWeeklySign() {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysSinceStart / 7);
    
    // Rotate through 12 signs
    const signIndex = weekNumber % 12;
    return zodiacSigns[signIndex];
  } catch (error) {
    console.error('Error calculating weekly sign:', error);
    return DEFAULT_FALLBACK_SIGN; // Default fallback
  }
}

/**
 * Get details for a specific zodiac sign
 * @param {string} sign - Zodiac sign name
 * @returns {object} Sign details including traits, dates, colors, etc.
 */
function getSignDetails(sign) {
  return signDetails[sign] || null;
}

/**
 * Get details for the current weekly featured sign
 * @returns {object} Current week's sign with full details
 */
function getWeeklySignDetails() {
  try {
    const sign = getWeeklySign();
    const details = getSignDetails(sign);
    if (!details) {
      // Fallback to default sign if details not found
      const fallbackDetails = getSignDetails(DEFAULT_FALLBACK_SIGN);
      if (!fallbackDetails) {
        // Ultimate fallback with hardcoded values
        return {
          sign: DEFAULT_FALLBACK_SIGN,
          element: 'Fire',
          traits: 'The cosmic archer. Adventurous, optimistic, and truth-seeking.',
          dates: 'November 22 - December 21',
          color: '#9B59B6',
          icon: '♐'
        };
      }
      return {
        sign: DEFAULT_FALLBACK_SIGN,
        ...fallbackDetails
      };
    }
    return {
      sign: sign,
      ...details
    };
  } catch (error) {
    console.error('Error getting weekly sign details:', error);
    // Return default sign as fallback with hardcoded values
    const fallbackDetails = getSignDetails(DEFAULT_FALLBACK_SIGN);
    if (!fallbackDetails) {
      return {
        sign: DEFAULT_FALLBACK_SIGN,
        element: 'Fire',
        traits: 'The cosmic archer. Adventurous, optimistic, and truth-seeking.',
        dates: 'November 22 - December 21',
        color: '#9B59B6',
        icon: '♐'
      };
    }
    return {
      sign: DEFAULT_FALLBACK_SIGN,
      ...fallbackDetails
    };
  }
}

/**
 * Get all zodiac signs in order
 * @returns {Array} Array of all zodiac sign names
 */
function getAllSigns() {
  return [...zodiacSigns];
}

/**
 * Get next week's featured sign (for preview/planning)
 * @returns {string} Next week's zodiac sign
 */
function getNextWeekSign() {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const startOfYear = new Date(nextWeek.getFullYear(), 0, 1);
  const daysSinceStart = Math.floor((nextWeek - startOfYear) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysSinceStart / 7);
  
  const signIndex = weekNumber % 12;
  return zodiacSigns[signIndex];
}

/**
 * Get sign rotation schedule for current year
 * @returns {Array} Array of objects with week number and corresponding sign
 */
function getYearlyRotationSchedule() {
  const schedule = [];
  const now = new Date();
  const year = now.getFullYear();
  
  for (let week = 0; week < 52; week++) {
    const signIndex = week % 12;
    const sign = zodiacSigns[signIndex];
    
    // Calculate the start date of this week
    const startOfYear = new Date(year, 0, 1);
    const weekStartDate = new Date(startOfYear.getTime() + week * 7 * 24 * 60 * 60 * 1000);
    
    schedule.push({
      week: week + 1,
      sign: sign,
      startDate: weekStartDate.toISOString().split('T')[0]
    });
  }
  
  return schedule;
}

/**
 * Check if a specific sign is currently featured this week
 * @param {string} sign - Zodiac sign to check
 * @returns {boolean} True if this sign is featured this week
 */
function isSignFeaturedThisWeek(sign) {
  return getWeeklySign().toLowerCase() === sign.toLowerCase();
}

/**
 * Get marketing copy for weekly sign feature
 * @param {string} sign - Optional sign parameter, defaults to current weekly sign
 * @returns {object} Marketing copy object
 */
function getWeeklySignMarketingCopy(sign = null) {
  const featuredSign = sign || getWeeklySign();
  const details = getSignDetails(featuredSign);
  
  return {
    sign: featuredSign,
    headline: `This Week's Sign: ${featuredSign}`,
    subheadline: `${details.dates} • ${details.element} Sign`,
    description: details.traits,
    cta: 'Explore Your Cycle',
    ctaUrl: `/zodiac/${featuredSign.toLowerCase()}.html`
  };
}

// Export for use in other modules (Node.js/CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getWeeklySign,
    getSignDetails,
    getWeeklySignDetails,
    getAllSigns,
    getNextWeekSign,
    getYearlyRotationSchedule,
    isSignFeaturedThisWeek,
    getWeeklySignMarketingCopy
  };
}

// Export for use in browser (global window object)
if (typeof window !== 'undefined') {
  window.getWeeklySign = getWeeklySign;
  window.getSignDetails = getSignDetails;
  window.getWeeklySignDetails = getWeeklySignDetails;
  window.getAllSigns = getAllSigns;
  window.getNextWeekSign = getNextWeekSign;
  window.getYearlyRotationSchedule = getYearlyRotationSchedule;
  window.isSignFeaturedThisWeek = isSignFeaturedThisWeek;
  window.getWeeklySignMarketingCopy = getWeeklySignMarketingCopy;
}
