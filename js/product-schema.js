/**
 * LYRION Product Schema & Utilities
 * 
 * Defines the product data structure and provides helper functions
 * for filtering products by sign, category, and other attributes.
 */

/**
 * Product Schema Definition
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier (SKU)
 * @property {string} title - Product title
 * @property {string} [sign] - Zodiac sign (Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces)
 * @property {string} category - Product category (zodiac-wardrobe, cosmic-home, natal-atelier, youth, digital)
 * @property {number} price - Product price
 * @property {string[]} images - Array of image URLs/paths
 * @property {string} description - Product description
 * @property {Object} attributes - Product attributes
 * @property {string} [attributes.color] - Product color
 * @property {string} [attributes.size] - Available sizes
 * @property {string} [attributes.material] - Material composition
 * @property {boolean} [attributes.embroidery] - Whether product has embroidery
 * @property {string} madeIn - Country of origin (default: "England")
 * @property {string} provider - Print provider (inkthreadable, printify, gelato)
 */

/**
 * Valid zodiac signs
 */
export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
];

/**
 * Valid product categories
 */
export const CATEGORIES = {
  ZODIAC_WARDROBE: 'zodiac-wardrobe',
  COSMIC_HOME: 'cosmic-home',
  NATAL_ATELIER: 'natal-atelier',
  YOUTH: 'youth',
  DIGITAL: 'digital'
};

/**
 * Valid providers
 */
export const PROVIDERS = {
  INKTHREADABLE: 'inkthreadable',
  PRINTIFY: 'printify',
  GELATO: 'gelato',
  PRINTFUL: 'printful',
  DIGITAL: 'digital'
};

/**
 * Create a product object with schema validation
 * @param {Object} data - Raw product data
 * @returns {Product} Validated product object
 */
export function createProduct(data) {
  return {
    id: data.id || data.sku || '',
    title: data.title || '',
    sign: data.sign || null,
    category: data.category || '',
    price: parseFloat(data.price) || 0,
    images: Array.isArray(data.images) 
      ? data.images 
      : (data.image ? [data.image] : []),
    description: data.description || data.subtitle || '',
    attributes: {
      color: data.attributes?.color || data.color || null,
      size: data.attributes?.size || data.size || null,
      material: data.attributes?.material || data.material || null,
      embroidery: data.attributes?.embroidery || false
    },
    madeIn: data.madeIn || 'England',
    provider: data.provider || 'inkthreadable'
  };
}

/**
 * Filter products by zodiac sign
 * @param {Product[]} products - Array of products
 * @param {string} sign - Zodiac sign to filter by
 * @returns {Product[]} Filtered products
 */
export function filterBySign(products, sign) {
  if (!sign) return products;
  
  // Case-insensitive validation
  const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
  if (!ZODIAC_SIGNS.includes(normalizedSign)) {
    console.warn(`Invalid zodiac sign: ${sign}`);
    return products;
  }
  
  return products.filter(product => 
    product.sign && product.sign.toLowerCase() === sign.toLowerCase()
  );
}

/**
 * Filter products by category
 * @param {Product[]} products - Array of products
 * @param {string} category - Category to filter by
 * @returns {Product[]} Filtered products
 */
export function filterByCategory(products, category) {
  if (!category) {
    return products;
  }
  
  const normalizedCategory = category.toLowerCase();
  
  return products.filter(product => {
    if (!product.category) return false;
    
    const productCategory = product.category.toLowerCase();
    
    // Direct match
    if (productCategory === normalizedCategory) return true;
    
    // Handle legacy category mappings
    const categoryMappings = {
      'zodiac-wardrobe': ['apparel', 'men', 'women', 'zodiac'],
      'cosmic-home': ['home', 'homeware', 'home & altar', 'altar'],
      'natal-atelier': ['custom', 'bespoke', 'natal'],
      'youth': ['kids', 'moon girls', 'star boys', 'children'],
      'digital': ['digital', 'readings', 'guides']
    };
    
    for (const [key, aliases] of Object.entries(categoryMappings)) {
      if (normalizedCategory === key && aliases.includes(productCategory)) {
        return true;
      }
    }
    
    return false;
  });
}

/**
 * Filter products by both sign and category
 * @param {Product[]} products - Array of products
 * @param {string} sign - Zodiac sign to filter by
 * @param {string} category - Category to filter by
 * @returns {Product[]} Filtered products
 */
export function filterBySignAndCategory(products, sign, category) {
  let filtered = products;
  
  if (sign) {
    filtered = filterBySign(filtered, sign);
  }
  
  if (category) {
    filtered = filterByCategory(filtered, category);
  }
  
  return filtered;
}

/**
 * Filter products by provider
 * @param {Product[]} products - Array of products
 * @param {string} provider - Provider to filter by
 * @returns {Product[]} Filtered products
 */
export function filterByProvider(products, provider) {
  if (!provider) {
    return products;
  }
  
  const normalizedProvider = provider.toLowerCase();
  
  return products.filter(product => 
    product.provider && product.provider.toLowerCase() === normalizedProvider
  );
}

/**
 * Filter products by price range
 * @param {Product[]} products - Array of products
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Product[]} Filtered products
 */
export function filterByPriceRange(products, minPrice, maxPrice) {
  // Validate parameters
  if (typeof minPrice !== 'number' || typeof maxPrice !== 'number') {
    console.error('minPrice and maxPrice must be numbers');
    return products;
  }
  
  if (minPrice > maxPrice) {
    console.warn('minPrice is greater than maxPrice, swapping values');
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  
  return products.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
}

/**
 * Get all unique signs from products
 * @param {Product[]} products - Array of products
 * @returns {string[]} Array of unique zodiac signs
 */
export function getUniqueSigns(products) {
  const signs = new Set();
  
  products.forEach(product => {
    if (product.sign && ZODIAC_SIGNS.includes(product.sign)) {
      signs.add(product.sign);
    }
  });
  
  return Array.from(signs).sort((a, b) => {
    return ZODIAC_SIGNS.indexOf(a) - ZODIAC_SIGNS.indexOf(b);
  });
}

/**
 * Get all unique categories from products
 * @param {Product[]} products - Array of products
 * @returns {string[]} Array of unique categories
 */
export function getUniqueCategories(products) {
  const categories = new Set();
  
  products.forEach(product => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  
  return Array.from(categories).sort();
}

/**
 * Sort products by price
 * @param {Product[]} products - Array of products
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Product[]} Sorted products
 */
export function sortByPrice(products, order = 'asc') {
  return [...products].sort((a, b) => {
    return order === 'asc' 
      ? a.price - b.price 
      : b.price - a.price;
  });
}

/**
 * Sort products by title
 * @param {Product[]} products - Array of products
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Product[]} Sorted products
 */
export function sortByTitle(products, order = 'asc') {
  return [...products].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Search products by keyword
 * @param {Product[]} products - Array of products
 * @param {string} keyword - Search keyword
 * @returns {Product[]} Matching products
 */
export function searchProducts(products, keyword) {
  if (!keyword) return products;
  
  const lowerKeyword = keyword.toLowerCase();
  
  return products.filter(product => {
    return (
      product.title.toLowerCase().includes(lowerKeyword) ||
      product.description.toLowerCase().includes(lowerKeyword) ||
      (product.sign && product.sign.toLowerCase().includes(lowerKeyword)) ||
      product.category.toLowerCase().includes(lowerKeyword)
    );
  });
}

/**
 * Validate product against schema
 * @param {Object} product - Product to validate
 * @returns {boolean} Whether product is valid
 */
export function validateProduct(product) {
  if (!product.id || typeof product.id !== 'string') {
    console.error('Product must have a valid id');
    return false;
  }
  
  if (!product.title || typeof product.title !== 'string') {
    console.error('Product must have a valid title');
    return false;
  }
  
  if (typeof product.price !== 'number' || product.price < 0) {
    console.error('Product must have a valid price');
    return false;
  }
  
  if (!Array.isArray(product.images)) {
    console.error('Product images must be an array');
    return false;
  }
  
  if (product.sign && !ZODIAC_SIGNS.includes(product.sign)) {
    console.warn(`Invalid zodiac sign: ${product.sign}`);
  }
  
  return true;
}

// Export default object with all utilities
export default {
  ZODIAC_SIGNS,
  CATEGORIES,
  PROVIDERS,
  createProduct,
  filterBySign,
  filterByCategory,
  filterBySignAndCategory,
  filterByProvider,
  filterByPriceRange,
  getUniqueSigns,
  getUniqueCategories,
  sortByPrice,
  sortByTitle,
  searchProducts,
  validateProduct
};
