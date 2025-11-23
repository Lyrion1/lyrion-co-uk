/**
 * LYRION Mock Data - Usage Examples
 * 
 * This file demonstrates how to use the mock product data
 * for testing, development, and seeding purposes.
 */

import { 
  MOCK_PRODUCTS,
  getMockProductsByCategory,
  getMockProductsBySign,
  getMockZodiacProducts,
  getMockGenericProducts,
  MOCK_PRODUCT_SUMMARY
} from './mock-products.js';

import {
  filterBySign,
  filterByCategory,
  filterByPriceRange,
  sortByPrice,
  searchProducts
} from '../js/product-schema.js';

/**
 * Example 1: Load all mock products
 */
function loadAllMockProducts() {
  console.log('Total mock products:', MOCK_PRODUCTS.length);
  console.log('Product summary:', MOCK_PRODUCT_SUMMARY);
  
  return MOCK_PRODUCTS;
}

/**
 * Example 2: Get products for a specific zodiac sign
 */
function getProductsForSign(sign) {
  const products = getMockProductsBySign(sign);
  
  console.log(`Products for ${sign}:`, products.length);
  // Should return 3 items: hoodie, candle, and pillow
  
  return products;
}

/**
 * Example 3: Get products by category
 */
function getProductsByCategory(category) {
  const products = getMockProductsByCategory(category);
  
  console.log(`Products in ${category}:`, products.length);
  // zodiac-wardrobe: 12 hoodies
  // cosmic-home: 25 items (candles, pillows, prints, blanket)
  // natal-atelier: 2 custom items
  
  return products;
}

/**
 * Example 4: Get only zodiac products
 */
function getAllZodiacProducts() {
  const products = getMockZodiacProducts();
  
  console.log('Zodiac products (with sign):', products.length);
  // Should return 36 items (12 hoodies + 12 candles + 12 pillows)
  
  return products;
}

/**
 * Example 5: Get generic products (no zodiac sign)
 */
function getGenericProducts() {
  const products = getMockGenericProducts();
  
  console.log('Generic products (no sign):', products.length);
  // Should return 4 items (birth chart print, moon blanket, 2 custom items)
  
  return products;
}

/**
 * Example 6: Use with product schema filters
 */
function advancedFiltering() {
  // Get all Leo products
  const leoProducts = filterBySign(MOCK_PRODUCTS, 'Leo');
  console.log('Leo products:', leoProducts);
  
  // Get all home products
  const homeProducts = filterByCategory(MOCK_PRODUCTS, 'cosmic-home');
  console.log('Home products:', homeProducts.length);
  
  // Get affordable products (under £50)
  const affordableProducts = filterByPriceRange(MOCK_PRODUCTS, 0, 50);
  console.log('Affordable products:', affordableProducts.length);
  
  // Search for embroidered products
  const embroideredProducts = MOCK_PRODUCTS.filter(p => p.attributes.embroidery);
  console.log('Embroidered products:', embroideredProducts.length);
  // Should return 36 items (12 hoodies + 12 pillows + custom hoodie)
  
  return {
    leoProducts,
    homeProducts,
    affordableProducts,
    embroideredProducts
  };
}

/**
 * Example 7: Sort and search
 */
function sortAndSearch() {
  // Sort by price (ascending)
  const sortedByPrice = sortByPrice(MOCK_PRODUCTS, 'asc');
  console.log('Cheapest product:', sortedByPrice[0].title, '-', sortedByPrice[0].price);
  console.log('Most expensive:', sortedByPrice[sortedByPrice.length - 1].title);
  
  // Search for "candle"
  const candleProducts = searchProducts(MOCK_PRODUCTS, 'candle');
  console.log('Candle products found:', candleProducts.length);
  
  // Search for "custom"
  const customProducts = searchProducts(MOCK_PRODUCTS, 'custom');
  console.log('Custom products found:', customProducts.length);
  
  return { sortedByPrice, candleProducts, customProducts };
}

/**
 * Example 8: Get products by element
 */
function getProductsByElement() {
  const fireSignProducts = MOCK_PRODUCTS.filter(p => 
    ['Aries', 'Leo', 'Sagittarius'].includes(p.sign)
  );
  
  const earthSignProducts = MOCK_PRODUCTS.filter(p => 
    ['Taurus', 'Virgo', 'Capricorn'].includes(p.sign)
  );
  
  const airSignProducts = MOCK_PRODUCTS.filter(p => 
    ['Gemini', 'Libra', 'Aquarius'].includes(p.sign)
  );
  
  const waterSignProducts = MOCK_PRODUCTS.filter(p => 
    ['Cancer', 'Scorpio', 'Pisces'].includes(p.sign)
  );
  
  return {
    fire: fireSignProducts,
    earth: earthSignProducts,
    air: airSignProducts,
    water: waterSignProducts
  };
}

/**
 * Example 9: Seed a database or state
 */
async function seedProductData() {
  console.log('Seeding database with mock products...');
  
  // Example: Load into application state
  const productStore = {
    products: MOCK_PRODUCTS,
    totalCount: MOCK_PRODUCTS.length,
    categories: ['zodiac-wardrobe', 'cosmic-home', 'natal-atelier'],
    signs: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  };
  
  console.log('Product store initialized:', productStore.totalCount, 'products');
  
  return productStore;
}

/**
 * Example 10: Generate product display
 */
function renderMockProducts(category = null, sign = null) {
  let products = MOCK_PRODUCTS;
  
  if (category) {
    products = filterByCategory(products, category);
  }
  
  if (sign) {
    products = filterBySign(products, sign);
  }
  
  const productCards = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="/assets/products/${product.images[0]}" alt="${product.title}">
      <h3>${product.title}</h3>
      ${product.sign ? `<span class="badge">${product.sign}</span>` : ''}
      <p>${product.description}</p>
      <div class="price">£${product.price.toFixed(2)}</div>
      ${product.attributes.embroidery ? '<span class="embroidery">✨ Embroidered</span>' : ''}
      <button class="add-to-cart">Add to Cart</button>
    </div>
  `).join('\n');
  
  return productCards;
}

// Export all examples
export {
  loadAllMockProducts,
  getProductsForSign,
  getProductsByCategory,
  getAllZodiacProducts,
  getGenericProducts,
  advancedFiltering,
  sortAndSearch,
  getProductsByElement,
  seedProductData,
  renderMockProducts
};

// Run examples if this file is executed directly (browser environment)
if (typeof globalThis !== 'undefined' && typeof globalThis.window !== 'undefined') {
  console.log('=== LYRION Mock Data Examples ===');
  console.log('');
  console.log('Example 1: All products');
  loadAllMockProducts();
  console.log('');
  
  console.log('Example 2: Aries products');
  getProductsForSign('Aries');
  console.log('');
  
  console.log('Example 3: Cosmic Home category');
  getProductsByCategory('cosmic-home');
  console.log('');
  
  console.log('Example 6: Advanced filtering');
  advancedFiltering();
}
