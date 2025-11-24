/**
 * LYRĪON Seasonal Engine
 * 
 * Maps calendar dates to celestial seasons aligned with LYRĪON's cosmic philosophy
 * - Ascendant (Spring / New Moon period): March, April, May
 * - Apex (Summer / Full Moon period): June, July, August
 * - Veil (Autumn / Waning Moon period): September, October, November
 * - Return (Winter / Dark Moon period): December, January, February
 */

/**
 * Get the current celestial season based on the current date
 * @returns {string} One of: "Ascendant", "Apex", "Veil", "Return"
 */
function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth(); // 0-11 (0 = January)
  
  // Month-based mapping to seasons
  // Spring: March (2), April (3), May (4)
  if (month >= 2 && month <= 4) {
    return "Ascendant";
  }
  
  // Summer: June (5), July (6), August (7)
  if (month >= 5 && month <= 7) {
    return "Apex";
  }
  
  // Autumn: September (8), October (9), November (10)
  if (month >= 8 && month <= 10) {
    return "Veil";
  }
  
  // Winter: December (11), January (0), February (1)
  return "Return";
}

/**
 * Get a poetic description for a given season
 * @param {string} season - The season name
 * @returns {string} Poetic description
 */
function getSeasonDescription(season) {
  const descriptions = {
    "Ascendant": "New Moon period — The time of awakening and renewal, where cosmic energy rises and intentions bloom.",
    "Apex": "Full Moon period — Peak illumination and manifestation, when the celestial forces reach their zenith.",
    "Veil": "Waning Moon period — A time of introspection and release, where wisdom is gathered beneath twilight's embrace.",
    "Return": "Dark Moon period — The sacred void of rest and regeneration, preparing for the cycle's rebirth."
  };
  
  return descriptions[season] || "";
}

/**
 * Get the moon phase cycle for advanced calculations (placeholder)
 * This is a simplified formula - for production use, integrate a proper lunar calendar API
 * @returns {number} Moon phase (0-29.53 day cycle)
 */
function getMoonPhase() {
  // Simplified placeholder: returns day of lunar month (0-29)
  // Known New Moon reference: January 6, 2000
  const knownNewMoon = new Date(2000, 0, 6).getTime();
  const now = new Date().getTime();
  const daysSinceKnownNewMoon = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarCycle = 29.53; // Average lunar month in days
  
  return daysSinceKnownNewMoon % lunarCycle;
}

// Export for use in Node.js environments (Netlify Functions)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentSeason,
    getSeasonDescription,
    getMoonPhase
  };
}
