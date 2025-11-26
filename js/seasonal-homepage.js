/**
 * LYRĪON Seasonal Homepage Functionality
 * 
 * Dynamically loads and displays seasonal products on the homepage
 * Shows current season badge and populates "The Season's Celestial Flow" section
 */

// Configuration
const PRODUCTS_JSON_PATH = './data/products.json';

// Global products cache to prevent duplicate fetches
let cachedProducts = null;

// Import season functions (inline for browser compatibility)
function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth(); // 0-11 (0 = January)
  
  // Month-based mapping to seasons
  if (month >= 2 && month <= 4) return "Ascendant"; // Spring: March, April, May
  if (month >= 5 && month <= 7) return "Apex";      // Summer: June, July, August
  if (month >= 8 && month <= 10) return "Veil";     // Autumn: September, October, November
  return "Return";                                   // Winter: December, January, February
}

function getSeasonDescription(season) {
  const descriptions = {
    "Ascendant": "New Moon period — The time of awakening and renewal",
    "Apex": "Full Moon period — Peak illumination and manifestation",
    "Veil": "Waning Moon period — A time of introspection and release",
    "Return": "Dark Moon period — The sacred void of rest and regeneration"
  };
  return descriptions[season] || "";
}

/**
 * Update the seasonal badge in the header
 */
function updateSeasonalBadge() {
  const season = getCurrentSeason();
  const badge = document.getElementById('seasonal-badge');
  
  if (badge) {
    badge.innerHTML = `<span style="color: #C4A449; font-size: 0.9rem; font-style: italic;">Current Cycle: The ${season}</span>`;
  }
}

/**
 * Fetch products with caching to prevent duplicate fetches
 */
async function fetchProductsWithCache() {
  if (cachedProducts !== null) {
    return cachedProducts;
  }
  
  try {
    const response = await fetch(PRODUCTS_JSON_PATH);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products = await response.json();
    cachedProducts = Array.isArray(products) ? products : [];
    return cachedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    cachedProducts = []; // Set to empty array to prevent retries
    return cachedProducts;
  }
}

/**
 * Load and display seasonal products
 */
async function loadSeasonalProducts() {
  try {
    const season = getCurrentSeason();
    const allProducts = await fetchProductsWithCache();
    
    // Filter products for current season
    const seasonalProducts = allProducts.filter(product => {
      // Include products marked for all seasons
      if (product.season === "all" || product.season === "All") {
        return true;
      }
      // Include products that match current season
      if (product.season === season) {
        return true;
      }
      // If no season specified, include it (available all seasons)
      if (!product.season) {
        return true;
      }
      return false;
    });
    
    // Get first 6 products for display
    const displayProducts = seasonalProducts.slice(0, 6);
    
    // Update the seasonal flow section
    updateSeasonalFlowSection(season, displayProducts);
    
  } catch (error) {
    console.error('Error loading seasonal products:', error);
  }
}

/**
 * Update the seasonal flow section with products
 */
function updateSeasonalFlowSection(season, products) {
  const container = document.querySelector('.seasonal-carousel');
  const subtitle = document.querySelector('.seasonal-flow-section .section-subtitle');
  
  // Update subtitle to show current season
  if (subtitle) {
    subtitle.textContent = `${getSeasonDescription(season)} — Curated for your cosmic journey.`;
  }
  
  if (!container || products.length === 0) {
    console.log('No container or products found for seasonal flow');
    return;
  }
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add each product
  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

/**
 * Create a product card element
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'lyrion-card product-card';
  
  const productUrl = `product.html?id=${product.id}`;
  const imageUrl = product.image || 'assets/products/placeholder.webp';
  const productName = product.name || product.title || 'Celestial Offering';
  const productCategory = product.category || product.subCategory || 'Apparel';
  const productPrice = product.price ? `£${parseFloat(product.price).toFixed(2)}` : 'View Details';
  
  card.innerHTML = `
    <figure class="product-image-container">
      <a href="${productUrl}">
        <img src="${imageUrl}" 
             alt="${productName}" 
             class="product-img"
             onerror="this.src='assets/products/placeholder.webp'">
      </a>
    </figure>
    <div class="product-details">
      <h4 class="product-name">
        <a href="${productUrl}" style="text-decoration: none; color: inherit;">
          ${productName}
        </a>
      </h4>
      <p class="product-type">${productCategory}</p>
      <p class="product-price">${productPrice}</p>
      <a href="${productUrl}" class="button-secondary" style="margin-top: 1rem; display: inline-block;">View Details</a>
    </div>
  `;
  
  return card;
}

/**
 * Initialize seasonal functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  updateSeasonalBadge();
  loadSeasonalProducts();
});

// Export for use in other scripts (browser global)
if (typeof window !== 'undefined') {
  window.fetchProductsWithCache = fetchProductsWithCache;
  window.getCachedProducts = () => cachedProducts;
}
