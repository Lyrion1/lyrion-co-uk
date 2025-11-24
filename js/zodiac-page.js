/**
 * LYRION Dynamic Zodiac Page
 * Loads products filtered by zodiac sign
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Get sign from URL (e.g., zodiac/aries.html or zodiac?sign=aries)
  const pageUrl = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  
  let sign = urlParams.get('sign');
  
  // If no query param, extract from filename (e.g., aries.html)
  if (!sign) {
    const filename = pageUrl.split('/').pop().replace('.html', '');
    sign = filename.charAt(0).toUpperCase() + filename.slice(1);
  }
  
  if (!sign) {
    console.error('No zodiac sign specified');
    return;
  }
  
  try {
    // Load products
    const response = await fetch('../data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    
    const products = await response.json();
    
    // Filter by sign (case-insensitive)
    const signProducts = products.filter(p => 
      p.sign && p.sign.toLowerCase() === sign.toLowerCase()
    );
    
    // Update page content
    updatePageContent(sign, signProducts);
    
    // Initialize ProductGrid if available
    if (typeof ProductGrid !== 'undefined' && signProducts.length > 0) {
      const grid = new ProductGrid(signProducts, {
        containerSelector: '#zodiac-products-grid',
        showHeader: false
      });
      grid.render();
    } else if (signProducts.length === 0) {
      showError(`No products found for ${sign}.`);
    }
    
  } catch (error) {
    console.error('Error loading zodiac products:', error);
    showError('Unable to load products at this time.');
  }
});

/**
 * Update page title, subtitle, and icon
 */
function updatePageContent(sign, products) {
  // Update page title
  const titleElement = document.querySelector('.hero h1, h1');
  if (titleElement) {
    titleElement.textContent = `${sign} Constellation Collection`;
  }
  
  // Update subtitle
  const subtitleElement = document.querySelector('.hero h2, .hero p');
  if (subtitleElement) {
    subtitleElement.textContent = `Apparel and décor aligned with the ${sign} spirit.`;
  }
  
  // Update document title
  document.title = `${sign} Collection | LYRĪON Celestial Couture`;
  
  // Add zodiac icon if function is available
  if (typeof getZodiacIcon === 'function') {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'zodiac-page-icon';
      iconDiv.innerHTML = getZodiacIcon(sign);
      heroSection.insertBefore(iconDiv, heroSection.firstChild);
    }
  }
  
  // Update product count
  const countElement = document.querySelector('.product-count');
  if (countElement) {
    countElement.textContent = `${products.length} ${products.length === 1 ? 'item' : 'items'}`;
  }
}

/**
 * Show error message
 */
function showError(message) {
  const container = document.getElementById('zodiac-products-grid');
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--color-ink);">
        <p>${message}</p>
        <a href="../shop.html" class="button-primary button-gold" style="margin-top: 1.5rem; display: inline-block;">
          Return to Shop
        </a>
      </div>
    `;
  }
}
