/**
 * LYRION Zodiac Icons
 * SVG icons for all 12 zodiac signs
 */

const zodiacIcons = {
  aries: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,70 Q30,40 40,20 M40,20 L35,30 M40,20 L45,30 M70,70 Q70,40 60,20 M60,20 L55,30 M60,20 L65,30" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  taurus: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="60" r="20" stroke="currentColor" stroke-width="3" fill="none"/>
      <path d="M20,30 Q20,15 35,15 Q50,15 50,25 Q50,15 65,15 Q80,15 80,30" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `,
  
  gemini: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="20" x2="30" y2="80" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="70" y1="20" x2="70" y2="80" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="20" y1="20" x2="80" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="20" y1="80" x2="80" y2="80" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  
  cancer: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="40" r="12" stroke="currentColor" stroke-width="3" fill="none"/>
      <circle cx="70" cy="60" r="12" stroke="currentColor" stroke-width="3" fill="none"/>
      <path d="M42,40 Q50,45 50,55 Q50,65 58,60" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `,
  
  leo: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="35" r="15" stroke="currentColor" stroke-width="3" fill="none"/>
      <path d="M50,35 Q65,35 70,50 Q75,65 65,70 Q55,75 50,65" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `,
  
  virgo: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,80 L25,30 Q25,20 35,20 Q45,20 45,30 L45,80 M45,30 Q45,20 55,20 Q65,20 65,30 L65,60 Q65,70 75,70 Q80,70 80,65" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `,
  
  libra: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="60" x2="80" y2="60" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="25" y1="75" x2="75" y2="75" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M50,60 Q50,40 35,30 M50,60 Q50,40 65,30" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `,
  
  scorpio: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,80 L25,30 Q25,20 35,20 Q45,20 45,30 L45,80 M45,30 Q45,20 55,20 Q65,20 65,30 L65,65 Q65,75 75,80 M75,80 L85,70 M75,80 L70,85" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  
  sagittarius: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="25" y1="75" x2="75" y2="25" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="55" y1="20" x2="80" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="80" y1="20" x2="80" y2="45" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="40" y1="55" x2="30" y2="65" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="60" x2="35" y2="50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  
  capricorn: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,75 L30,30 Q30,20 40,25 L40,50 Q40,60 50,55 Q60,50 65,60 Q70,70 70,80" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="70" cy="72" r="8" stroke="currentColor" stroke-width="3" fill="none"/>
    </svg>
  `,
  
  aquarius: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,40 Q30,35 40,40 Q50,45 60,40 Q70,35 80,40" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M20,60 Q30,55 40,60 Q50,65 60,60 Q70,55 80,60" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `,
  
  pisces: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,20 Q30,50 35,80 M70,20 Q70,50 65,80" 
            stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
      <line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `
};

/**
 * Get zodiac icon SVG by sign name
 * @param {string} sign - Zodiac sign name (e.g., "Aries", "Taurus")
 * @returns {string} SVG string
 */
function getZodiacIcon(sign) {
  if (!sign) return '';
  const key = sign.toLowerCase();
  return zodiacIcons[key] || '';
}

/**
 * Get all zodiac signs data
 * @returns {Array} Array of zodiac sign objects
 */
function getAllZodiacSigns() {
  return [
    { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
    { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
    { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
    { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
    { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
    { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
    { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
    { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
    { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
    { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth' },
    { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air' },
    { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water' }
  ];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getZodiacIcon, getAllZodiacSigns, zodiacIcons };
}
