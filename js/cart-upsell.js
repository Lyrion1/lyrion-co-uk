/**
 * LYRION Cart Upsell Logic
 * "Complete the Ritual" upsell recommendations
 */

/**
 * Get upsell products based on cart contents
 * @param {Array} cartItems - Current cart items
 * @returns {Array} Recommended upsell products
 */
function getCompleteTheRitualUpsells(cartItems) {
  if (!cartItems || cartItems.length === 0) return [];
  
  // Detect which zodiac sign(s) are in the cart
  const cartSigns = new Set();
  cartItems.forEach(item => {
    const sign = extractZodiacSign(item);
    if (sign) cartSigns.add(sign);
  });
  
  // If we have a sign, recommend complementary items
  if (cartSigns.size > 0) {
    const primarySign = Array.from(cartSigns)[0]; // Use first sign found
    return getSignUpsells(primarySign, cartItems);
  }
  
  // Generic upsells if no sign detected
  return getGenericUpsells(cartItems);
}

/**
 * Extract zodiac sign from product SKU or title
 * @param {Object} item - Cart item
 * @returns {string|null} Zodiac sign name or null
 */
function extractZodiacSign(item) {
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const searchText = `${item.sku || ''} ${item.title || ''}`.toLowerCase();
  
  for (const sign of zodiacSigns) {
    if (searchText.includes(sign.toLowerCase())) {
      return sign;
    }
  }
  
  return null;
}

/**
 * Get sign-specific upsell recommendations
 * @param {string} sign - Zodiac sign
 * @param {Array} cartItems - Current cart items
 * @returns {Array} Upsell products
 */
function getSignUpsells(sign, cartItems) {
  // Check what categories are already in cart
  const hasHat = cartItems.some(item => item.category === 'Hats' || /hat/i.test(item.title));
  const hasSocks = cartItems.some(item => item.category === 'Socks' || /sock/i.test(item.title));
  const hasCandle = cartItems.some(item => item.category === 'Homeware' || /candle/i.test(item.title));
  
  const upsells = [];
  
  // Recommend hat if not in cart
  if (!hasHat) {
    upsells.push({
      id: `${sign.toLowerCase()}-hat`,
      sku: `${sign.toLowerCase()}-hat`,
      title: `${sign} Celestial Hat`,
      subtitle: 'Complete your cosmic look',
      price: 35.00,
      category: 'Hats',
      image: 'celestial-hat.jpg',
      url: `product.html?sku=${sign.toLowerCase()}-hat`
    });
  }
  
  // Recommend socks if not in cart
  if (!hasSocks) {
    upsells.push({
      id: `${sign.toLowerCase()}-socks`,
      sku: `${sign.toLowerCase()}-socks`,
      title: `${sign} Constellation Socks`,
      subtitle: 'From head to toe alignment',
      price: 18.00,
      category: 'Socks',
      image: 'constellation-socks.jpg',
      url: `product.html?sku=${sign.toLowerCase()}-socks`
    });
  }
  
  // Recommend candle if not in cart
  if (!hasCandle) {
    upsells.push({
      id: `${sign.toLowerCase()}-candle`,
      sku: `${sign.toLowerCase()}-candle`,
      title: `${sign} Celestial Candle`,
      subtitle: 'Bring the ritual home',
      price: 28.00,
      category: 'Homeware',
      image: 'aether-incense.jpg',
      url: `product.html?sku=${sign.toLowerCase()}-candle`
    });
  }
  
  return upsells.slice(0, 3); // Return max 3 upsells
}

/**
 * Get generic upsells if no sign detected
 * @param {Array} cartItems - Current cart items
 * @returns {Array} Generic upsell products
 */
function getGenericUpsells(cartItems) {
  return [
    {
      id: 'oracle-reading',
      sku: 'oracle-premium',
      title: 'Premium Oracle Reading',
      subtitle: 'Deep cosmic insight',
      price: 25.00,
      category: 'Digital',
      url: 'oracle.html#premium'
    },
    {
      id: 'lunar-guide',
      sku: 'lunar-guide',
      title: 'Digital Lunar Guide',
      subtitle: 'Track your cosmic cycles',
      price: 20.00,
      category: 'Digital',
      url: 'product.html?sku=lunar-guide'
    }
  ];
}

/**
 * Display "Complete the Ritual" upsell section
 * @param {HTMLElement} container - Container element to insert upsells
 * @param {Array} cartItems - Current cart items
 */
function displayCompleteTheRitualUpsell(container, cartItems) {
  if (!container) return;
  
  const upsells = getCompleteTheRitualUpsells(cartItems);
  
  if (upsells.length === 0) return;
  
  // Create upsell section
  const upsellSection = document.createElement('div');
  upsellSection.id = 'complete-ritual-upsell';
  upsellSection.style.cssText = `
    margin: 2rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(244, 239, 232, 0.3) 0%, rgba(252, 250, 250, 0.6) 100%);
    border: 1px solid rgba(196, 164, 73, 0.3);
    border-radius: 8px;
  `;
  
  upsellSection.innerHTML = `
    <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #151311; margin-bottom: 0.5rem; font-weight: 600;">
      Complete the Ritual
    </h3>
    <p style="font-size: 0.95rem; color: #5a5856; margin-bottom: 1.5rem; font-style: italic;">
      Enhance your alignment with these complementary pieces
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
      ${upsells.map(product => generateUpsellCard(product)).join('')}
    </div>
  `;
  
  container.appendChild(upsellSection);
  
  // Add hover effects
  addUpsellCardHoverEffects();
}

/**
 * Generate HTML for a single upsell card
 * @param {Object} product - Product object
 * @returns {string} HTML string
 */
function generateUpsellCard(product) {
  return `
    <div class="upsell-card" style="background: white; border: 1px solid #e0ddd9; border-radius: 6px; padding: 1.5rem; text-align: center; transition: all 0.3s ease;">
      <div style="width: 100%; height: 120px; background: #e8e6e3; border-radius: 4px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
        ${product.image ? `<img src="assets/products/${product.image}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'">` : '<span style="color: #C4A449; font-size: 2rem;">✧</span>'}
      </div>
      <h4 style="font-size: 1.1rem; color: #151311; margin-bottom: 0.3rem; font-weight: 600;">${product.title}</h4>
      <p style="font-size: 0.85rem; color: #5a5856; margin-bottom: 0.5rem;">${product.subtitle}</p>
      <p style="font-size: 1rem; color: #C4A449; font-weight: 600; margin-bottom: 1rem;">£${product.price.toFixed(2)}</p>
      <a href="${product.url}" style="display: inline-block; padding: 0.6rem 1.2rem; background: #151311; color: white; text-decoration: none; border-radius: 4px; font-size: 0.9rem; transition: background 0.3s ease;">
        Add to Cart
      </a>
    </div>
  `;
}

/**
 * Add hover effects to upsell cards
 */
function addUpsellCardHoverEffects() {
  document.querySelectorAll('.upsell-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.borderColor = '#C4A449';
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 4px 12px rgba(196, 164, 73, 0.2)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.borderColor = '#e0ddd9';
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCompleteTheRitualUpsells,
    displayCompleteTheRitualUpsell
  };
}
