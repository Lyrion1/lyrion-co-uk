/**
 * LYRION Oracle Product Cross-Sell
 * Displays sign-based product recommendations after oracle reading
 */

/**
 * Show product cross-sell after oracle reading
 * @param {string} userSign - User's zodiac sign from reading
 */
function showOracleProductCrossSell(userSign = null) {
  const resultContainer = document.getElementById('reading-result');
  
  if (!resultContainer) return;
  
  // Determine which sign to feature
  let featuredSign = userSign;
  
  // If no user sign provided, use the current weekly sign from marketing.js
  if (!featuredSign && typeof getWeeklySign === 'function') {
    featuredSign = getWeeklySign();
  }
  
  // Fallback to first sign if nothing else available
  if (!featuredSign) {
    featuredSign = 'Aries';
  }
  
  // Create cross-sell section
  const crossSellSection = document.createElement('div');
  crossSellSection.id = 'oracle-cross-sell';
  crossSellSection.style.cssText = `
    margin-top: 3rem;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, rgba(244, 239, 232, 0.4) 0%, rgba(252, 250, 250, 0.8) 100%);
    border: 2px solid var(--color-gold);
    border-radius: 12px;
    text-align: center;
  `;
  
  crossSellSection.innerHTML = `
    <h3 style="font-family: var(--font-serif); font-size: 2rem; color: var(--color-ink); margin-bottom: 0.5rem; font-weight: 600;">
      Items Aligned With Your Current Cosmic Rhythm
    </h3>
    <p style="font-size: 1rem; color: var(--color-gold); font-style: italic; margin-bottom: 2.5rem;">
      Pieces that resonate with ${featuredSign} energy
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
      ${generateProductCards(featuredSign)}
    </div>
    
    <a href="zodiac/${featuredSign.toLowerCase()}.html" 
       style="display: inline-block; padding: 1rem 2.5rem; background: var(--color-gold); color: white; text-decoration: none; border-radius: 6px; font-size: 1.1rem; transition: background 0.3s ease; font-weight: 600;">
      Explore ${featuredSign} Collection
    </a>
  `;
  
  // Only add if not already present
  if (!document.getElementById('oracle-cross-sell')) {
    resultContainer.appendChild(crossSellSection);
  }
}

/**
 * Generate product cards HTML for a zodiac sign
 * @param {string} sign - Zodiac sign name
 * @returns {string} HTML for product cards
 */
function generateProductCards(sign) {
  const products = [
    {
      name: `${sign} Zodiac Hoodie`,
      description: `Luxury hoodie featuring ${sign} constellation`,
      price: '£65.00',
      url: `product.html?sku=${sign.toLowerCase()}-hoodie`,
      image: 'signature-hoodie.jpg'
    },
    {
      name: `${sign} Celestial Candle`,
      description: `Hand-poured candle aligned with ${sign} energy`,
      price: '£28.00',
      url: `product.html?sku=${sign.toLowerCase()}-candle`,
      image: 'aether-incense.jpg'
    },
    {
      name: `${sign} Home Collection`,
      description: `Curated home items for ${sign} souls`,
      price: 'From £35.00',
      url: `shop.html?collection=cosmic-home&sign=${sign.toLowerCase()}`,
      image: 'star-tapestry.jpg'
    }
  ];
  
  return products.map(product => `
    <div style="background: white; border: 2px solid #e0ddd9; border-radius: 8px; padding: 1.5rem; transition: all 0.3s ease;" 
         class="oracle-product-card">
      <div style="width: 100%; height: 180px; background: #e8e6e3; border-radius: 6px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        <img src="assets/products/${product.image}" 
             alt="${product.name.replace(/"/g, '&quot;')}"
             style="width: 100%; height: 100%; object-fit: cover;"
             onerror="this.style.display='none'; this.parentElement.textContent='${getSignSymbol(sign)}';">
      </div>
      <h4 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--color-ink); margin-bottom: 0.5rem; font-weight: 600;">
        ${product.name}
      </h4>
      <p style="font-size: 0.9rem; color: #5a5856; margin-bottom: 0.75rem; line-height: 1.5;">
        ${product.description}
      </p>
      <p style="font-size: 1.1rem; color: var(--color-gold); font-weight: 600; margin-bottom: 1rem;">
        ${product.price}
      </p>
      <a href="${product.url}" 
         style="display: inline-block; padding: 0.7rem 1.5rem; background: var(--color-ink); color: white; text-decoration: none; border-radius: 4px; font-size: 0.95rem; transition: background 0.3s ease;">
        View Details
      </a>
    </div>
  `).join('');
}

/**
 * Get zodiac symbol for a sign
 * @param {string} sign - Zodiac sign name
 * @returns {string} Unicode zodiac symbol
 */
function getSignSymbol(sign) {
  const symbols = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
    Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
  };
  return symbols[sign] || '✧';
}

/**
 * Add hover effects to product cards
 */
function addProductCardHoverEffects() {
  document.querySelectorAll('.oracle-product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.borderColor = 'var(--color-gold)';
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 8px 20px rgba(196, 164, 73, 0.2)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.borderColor = '#e0ddd9';
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
}

// Auto-initialize when result is shown
// This should be called after oracle reading is displayed
function initOracleCrossSell() {
  // Check if we're on the oracle page
  if (!document.getElementById('reading-result')) return;
  
  // Observer to watch for when reading result is displayed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        // Check if reading content was added
        const resultContainer = document.getElementById('reading-result');
        if (resultContainer && resultContainer.innerHTML.trim() !== '' && !document.getElementById('oracle-cross-sell')) {
          // Wait a moment then show cross-sell
          setTimeout(() => {
            showOracleProductCrossSell();
            addProductCardHoverEffects();
          }, 1000);
        }
      }
    });
  });
  
  const resultContainer = document.getElementById('reading-result');
  if (resultContainer) {
    observer.observe(resultContainer, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initOracleCrossSell);
