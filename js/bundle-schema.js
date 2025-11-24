/**
 * LYRION Bundle Schema & Utilities
 * 
 * Defines the bundle data structure and provides helper functions
 * for managing product bundles.
 */

/**
 * Bundle Schema Definition
 * @typedef {Object} Bundle
 * @property {string} id - Unique bundle identifier
 * @property {string} title - Bundle title
 * @property {string[]} products - Array of product IDs/SKUs included in bundle
 * @property {number} price - Bundle price
 * @property {string} description - Bundle description
 * @property {string} [image] - Optional bundle image URL/path
 * @property {string} category - Bundle category (signature, lunar-home, cosmic-self)
 */

/**
 * Valid bundle categories
 */
export const BUNDLE_CATEGORIES = {
  SIGNATURE: 'signature',
  LUNAR_HOME: 'lunar-home',
  COSMIC_SELF: 'cosmic-self'
};

/**
 * Create a bundle object with schema validation
 * @param {Object} data - Raw bundle data
 * @returns {Bundle} Validated bundle object
 */
export function createBundle(data) {
  return {
    id: data.id || '',
    title: data.title || '',
    products: Array.isArray(data.products) ? data.products : [],
    price: parseFloat(data.price) || 0,
    description: data.description || '',
    image: data.image || null,
    category: data.category || ''
  };
}

/**
 * Validate bundle against schema
 * @param {Object} bundle - Bundle to validate
 * @returns {boolean} Whether bundle is valid
 */
export function validateBundle(bundle) {
  if (!bundle.id || typeof bundle.id !== 'string') {
    console.error('Bundle must have a valid id');
    return false;
  }
  
  if (!bundle.title || typeof bundle.title !== 'string') {
    console.error('Bundle must have a valid title');
    return false;
  }
  
  if (!Array.isArray(bundle.products) || bundle.products.length === 0) {
    console.error('Bundle must have at least one product');
    return false;
  }
  
  if (typeof bundle.price !== 'number' || bundle.price < 0) {
    console.error('Bundle must have a valid price');
    return false;
  }
  
  if (bundle.category && !Object.values(BUNDLE_CATEGORIES).includes(bundle.category)) {
    console.warn(`Invalid bundle category: ${bundle.category}`);
  }
  
  return true;
}

/**
 * Get bundle by ID
 * @param {Bundle[]} bundles - Array of bundles
 * @param {string} id - Bundle ID to find
 * @returns {Bundle|null} Found bundle or null
 */
export function getBundleById(bundles, id) {
  if (!id || !Array.isArray(bundles)) {
    return null;
  }
  
  return bundles.find(bundle => bundle.id === id) || null;
}

/**
 * Filter bundles by category
 * @param {Bundle[]} bundles - Array of bundles
 * @param {string} category - Category to filter by
 * @returns {Bundle[]} Filtered bundles
 */
export function filterByCategory(bundles, category) {
  if (!category) {
    return bundles;
  }
  
  const normalizedCategory = category.toLowerCase();
  
  return bundles.filter(bundle => 
    bundle.category && bundle.category.toLowerCase() === normalizedCategory
  );
}

/**
 * Calculate total savings for a bundle
 * @param {Bundle} bundle - Bundle object
 * @param {Object[]} products - Array of all products
 * @returns {number} Total savings amount
 */
export function calculateBundleSavings(bundle, products) {
  if (!bundle || !bundle.products || !Array.isArray(products)) {
    return 0;
  }
  
  let totalIndividualPrice = 0;
  
  bundle.products.forEach(productId => {
    const product = products.find(p => p.sku === productId || p.id === productId);
    if (product) {
      totalIndividualPrice += product.price;
    }
  });
  
  return Math.max(0, totalIndividualPrice - bundle.price);
}

/**
 * Get products included in a bundle
 * @param {Bundle} bundle - Bundle object
 * @param {Object[]} products - Array of all products
 * @returns {Object[]} Array of product objects in the bundle
 */
export function getBundleProducts(bundle, products) {
  if (!bundle || !bundle.products || !Array.isArray(products)) {
    return [];
  }
  
  return bundle.products
    .map(productId => products.find(p => p.sku === productId || p.id === productId))
    .filter(product => product !== undefined);
}

// Export default object with all utilities
export default {
  BUNDLE_CATEGORIES,
  createBundle,
  validateBundle,
  getBundleById,
  filterByCategory,
  calculateBundleSavings,
  getBundleProducts
};
