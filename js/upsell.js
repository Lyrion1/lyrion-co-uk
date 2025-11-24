/**
 * LYRION Upsell Logic
 * Provides product recommendations based on cart contents
 */

// Upsell rules configuration
const UPSELL_RULES = {
  // If user adds a hoodie, suggest hats
  hoodie: {
    triggers: ['hoodie', 'hood'],
    suggests: ['hats'],
    message: 'Complete your cosmic look with a celestial hat'
  },
  // If user adds a blanket or hoodie, suggest socks
  comfort: {
    triggers: ['blanket', 'hoodie', 'hood'],
    suggests: ['socks'],
    message: 'Elevate your comfort with cosmic socks'
  }
};

/**
 * Get upsell recommendations based on product SKU or category
 * @param {string} productSku - Product SKU that was added to cart
 * @param {object} productData - Optional product data including category/type
 * @returns {Array} Array of recommended product categories
 */
function getUpsellRecommendations(productSku, productData = {}) {
  const recommendations = new Set();
  const productLower = (productSku + ' ' + (productData.title || '') + ' ' + (productData.category || '')).toLowerCase();

  // Check each rule
  Object.entries(UPSELL_RULES).forEach(([ruleName, rule]) => {
    // Check if any trigger matches
    const hasMatch = rule.triggers.some(trigger => productLower.includes(trigger));
    
    if (hasMatch) {
      rule.suggests.forEach(category => recommendations.add({
        category,
        message: rule.message
      }));
    }
  });

  return Array.from(recommendations);
}

/**
 * Load and display upsell products
 * @param {string} productSku - Product SKU that was added
 * @param {string} containerId - ID of container to display upsells
 */
async function displayUpsells(productSku, containerId = 'upsell-container') {
  try {
    // Fetch product data
    const response = await fetch('./data/products.json');
    const products = await response.json();
    
    // Find the product that was added
    const addedProduct = products.find(p => p.sku === productSku);
    if (!addedProduct) return;

    // Get upsell recommendations
    const recommendations = getUpsellRecommendations(productSku, addedProduct);
    
    if (recommendations.length === 0) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Get products for each recommended category
    const upsellProducts = [];
    recommendations.forEach(rec => {
      const categoryProducts = products.filter(p => 
        p.category && p.category.toLowerCase() === rec.category.toLowerCase()
      );
      if (categoryProducts.length > 0) {
        upsellProducts.push({
          message: rec.message,
          products: categoryProducts.slice(0, 3) // Limit to 3 per category
        });
      }
    });

    if (upsellProducts.length === 0) return;

    // Build upsell HTML
    let html = '<div class="upsell-section" style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(244, 239, 232, 0.3) 0%, rgba(252, 250, 250, 0.7) 100%); border-radius: 8px; border: 1px solid #e0ddd9;">';
    
    upsellProducts.forEach(upsellGroup => {
      html += `
        <h4 style="font-size: 1.2rem; color: #C4A449; margin-bottom: 1rem; font-style: italic; text-align: center;">
          ${upsellGroup.message}
        </h4>
        <div class="upsell-products" style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
      `;
      
      upsellGroup.products.forEach(product => {
        html += `
          <div class="upsell-card" style="min-width: 200px; background: white; border: 1px solid #e0ddd9; border-radius: 6px; padding: 1rem; text-align: center; flex-shrink: 0;">
            <img src="./assets/products/${product.image}" alt="${product.title}" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem; background: #e8e6e3;"
                 onerror="this.src='./assets/products/placeholder.webp'">
            <h5 style="font-size: 1rem; margin: 0.5rem 0; color: #151311;">${product.title}</h5>
            <p style="font-size: 0.95rem; color: #C4A449; font-weight: 600; margin: 0.3rem 0;">£${product.price.toFixed(2)}</p>
            <a href="product.html?sku=${product.sku}" 
               style="display: inline-block; padding: 0.5rem 1rem; background: #C4A449; color: white; text-decoration: none; border-radius: 4px; font-size: 0.85rem; margin-top: 0.5rem; transition: background 0.3s ease;"
               onmouseover="this.style.background='#A38435'" onmouseout="this.style.background='#C4A449'">
              Add to Order
            </a>
          </div>
        `;
      });
      
      html += '</div>';
    });
    
    html += '</div>';
    
    container.innerHTML = html;

  } catch (error) {
    console.error('Error displaying upsells:', error);
  }
}

/**
 * Initialize upsell display for product page
 * Call this function when a product is viewed or added to cart
 */
function initializeUpsells() {
  // Get product SKU from URL
  const urlParams = new URLSearchParams(window.location.search);
  const sku = urlParams.get('sku');
  
  if (sku) {
    displayUpsells(sku);
  }
}

// Auto-initialize on product pages
document.addEventListener('DOMContentLoaded', () => {
  // Only run on product.html or pages with upsell container
  if (document.getElementById('upsell-container') || window.location.pathname.includes('product.html')) {
    initializeUpsells();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getUpsellRecommendations, displayUpsells, initializeUpsells };
}
