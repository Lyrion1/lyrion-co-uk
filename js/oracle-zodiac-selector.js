/**
 * LYRION Oracle Zodiac Selector
 * Creates a grid of clickable zodiac cards
 */

document.addEventListener('DOMContentLoaded', () => {
  initializeZodiacGrid();
});

/**
 * Initialize the zodiac grid with all 12 signs
 */
function initializeZodiacGrid() {
  const gridContainer = document.getElementById('zodiac-grid');
  if (!gridContainer) return;
  
  // Get all zodiac signs from zodiac-icons.js
  const signs = typeof getAllZodiacSigns === 'function' ? getAllZodiacSigns() : getDefaultSigns();
  
  // Create a card for each zodiac sign
  signs.forEach(sign => {
    const card = createZodiacCard(sign);
    gridContainer.appendChild(card);
  });
}

/**
 * Create a zodiac card element
 * @param {Object} sign - Zodiac sign object {name, symbol, dates, element}
 * @returns {HTMLElement} Card element
 */
function createZodiacCard(sign) {
  const card = document.createElement('a');
  card.href = `zodiac/${sign.name.toLowerCase()}.html`;
  card.className = 'zodiac-card';
  card.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem;
    background: white;
    border: 2px solid rgba(196, 164, 73, 0.2);
    border-radius: 12px;
    text-decoration: none;
    color: var(--color-ink);
    transition: all 0.3s ease;
    cursor: pointer;
  `;
  
  // Add icon
  const iconDiv = document.createElement('div');
  iconDiv.className = 'zodiac-card-icon';
  iconDiv.style.cssText = `
    width: 60px;
    height: 60px;
    color: var(--color-gold);
    margin-bottom: 0.75rem;
  `;
  iconDiv.innerHTML = typeof getZodiacIcon === 'function' ? getZodiacIcon(sign.name) : '';
  
  // Add name
  const nameDiv = document.createElement('div');
  nameDiv.className = 'zodiac-card-name';
  nameDiv.style.cssText = `
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    color: var(--color-ink);
  `;
  nameDiv.textContent = sign.name;
  
  // Add hover effects
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'var(--color-gold)';
    card.style.transform = 'translateY(-5px)';
    card.style.boxShadow = '0 8px 20px rgba(196, 164, 73, 0.2)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = 'rgba(196, 164, 73, 0.2)';
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
  });
  
  card.appendChild(iconDiv);
  card.appendChild(nameDiv);
  
  return card;
}

/**
 * Fallback function if getAllZodiacSigns is not available
 * @returns {Array} Array of zodiac sign objects
 */
function getDefaultSigns() {
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
