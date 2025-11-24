/**
 * LYRĪON Product Helper Functions
 * 
 * Utilities for filtering and managing products by season, category, and attributes
 */

// Configuration
const PRODUCTS_JSON_PATH = '/products.json';

/**
 * Get products for a specific season
 * Filters products where product.season matches the given season OR "all"
 * Also supports legacy season values (cold, warm) for backward compatibility
 * @param {Array} products - Array of product objects
 * @param {string} season - Season name ("Ascendant", "Apex", "Veil", "Return")
 * @returns {Array} Filtered products
 */
function getProductsForSeason(products, season) {
  if (!products || !Array.isArray(products)) {
    return [];
  }
  
  // Map celestial seasons to legacy season values for backward compatibility
  const seasonMapping = {
    'Ascendant': 'warm',  // Spring
    'Apex': 'warm',       // Summer
    'Veil': 'cold',       // Autumn
    'Return': 'cold'      // Winter
  };
  
  const legacySeason = seasonMapping[season];
  
  return products.filter(product => {
    // Include products that are marked for all seasons
    if (product.season === "all" || product.season === "All") {
      return true;
    }
    
    // Include products that match the current celestial season
    if (product.season === season) {
      return true;
    }
    
    // Include products that match the legacy season value
    if (legacySeason && product.season === legacySeason) {
      return true;
    }
    
    // If no season is specified on product, it's available all seasons
    if (!product.season) {
      return true;
    }
    
    return false;
  });
}

/**
 * Get a limited number of products for seasonal display
 * @param {Array} products - Array of product objects
 * @param {string} season - Season name
 * @param {number} limit - Maximum number of products to return (default: 6)
 * @returns {Array} Limited array of filtered products
 */
function getSeasonalProductsForDisplay(products, season, limit = 6) {
  const seasonalProducts = getProductsForSeason(products, season);
  return seasonalProducts.slice(0, limit);
}

/**
 * Fetch products from products.json
 * @returns {Promise<Array>} Array of products
 */
async function fetchProducts() {
  try {
    const response = await fetch(PRODUCTS_JSON_PATH);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Export for use in Node.js environments (Netlify Functions)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getProductsForSeason,
    getSeasonalProductsForDisplay,
    fetchProducts
  };
}
