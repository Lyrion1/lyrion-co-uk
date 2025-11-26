/**
 * LYRION Product Schema - Usage Examples
 * 
 * This file demonstrates how to use the product schema and utilities
 */

// Import the product utilities
import {
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
  validateProduct,
  ZODIAC_SIGNS,
  CATEGORIES,
  PROVIDERS
} from './product-schema.js';

/**
 * Browser usage without a build step:
 * 
 * In your HTML file:
 * <script type="module">
 *   import { filterBySign, ZODIAC_SIGNS } from './js/product-schema.js';
 *   
 *   // Use the imports
 *   const ariesProducts = filterBySign(products, 'Aries');
 * </script>
 */

/*
Example 1: Creating a product
*/
const exampleProduct = {
  id: 'A-HOOD-ARIES',
  title: 'Aries Zodiac Hoodie',
  sign: 'Aries',
  category: 'zodiac-wardrobe',
  price: 110.00,
  images: ['A-HOOD-ARIES-image.webp', 'A-HOOD-ARIES-back.webp'],
  description: 'Premium celestial hoodie featuring the Aries constellation',
  attributes: {
    color: 'Midnight Black',
    size: 'S, M, L, XL',
    material: 'Organic Cotton Blend',
    embroidery: true
  },
  madeIn: 'England',
  provider: 'inkthreadable'
};

/*
Example 2: Loading and filtering products
*/
async function loadAndFilterProducts() {
  try {
    // Load products from JSON
    const response = await fetch('/data/products.json');
    const rawProducts = await response.json();
    
    // Transform to schema (if needed)
    const products = rawProducts.map(p => createProduct(p));
    
    // Filter by zodiac sign
    const ariesProducts = filterBySign(products, 'Aries');
    // console.log('Aries products:', ariesProducts);
    
    // Filter by category
    const wardrobeProducts = filterByCategory(products, 'zodiac-wardrobe');
    // console.log('Zodiac wardrobe products:', wardrobeProducts);
    
    // Filter by both sign and category
    const ariesWardrobe = filterBySignAndCategory(products, 'Aries', 'zodiac-wardrobe');
    // console.log('Aries wardrobe products:', ariesWardrobe);
    
    // Filter by price range
    const affordableProducts = filterByPriceRange(products, 0, 75);
    // console.log('Products under £75:', affordableProducts);
    
    // Search products
    const searchResults = searchProducts(products, 'hoodie');
    // console.log('Hoodie products:', searchResults);
    
    // Sort by price
    const sortedByPrice = sortByPrice(products, 'asc');
    // console.log('Products sorted by price:', sortedByPrice);
    
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

/*
Example 3: Getting unique values
*/
async function getProductMetadata() {
  const response = await fetch('/data/products.json');
  const products = await response.json();
  
  // Get all available zodiac signs
  const signs = getUniqueSigns(products);
  // Available signs are now ready for use
  
  // Get all categories
  const categories = getUniqueCategories(products);
  // Available categories are now ready for use
}

/*
Example 4: Category mapping for navigation
*/
const CATEGORY_INFO = {
  'zodiac-wardrobe': {
    name: 'Zodiac Wardrobe',
    description: 'Celestial apparel aligned with your astrological identity',
    route: '/collections/zodiac-wardrobe.html'
  },
  'cosmic-home': {
    name: 'Cosmic Home',
    description: 'Transform your sacred space with celestial homeware',
    route: '/collections/cosmic-home.html'
  },
  'natal-atelier': {
    name: 'Natal Atelier',
    description: 'Bespoke celestial designs crafted exclusively for you',
    route: '/collections/natal-atelier.html'
  },
  'youth': {
    name: 'Celestial Youth',
    description: 'Enchanting apparel for young spirits',
    route: '/collections/celestial-youth.html'
  },
  'digital': {
    name: 'Digital Rituals',
    description: 'Personalized readings, guides, and meditations',
    route: '/collections/digital-rituals.html'
  },
  'scarves': {
    name: 'Scarves',
    description: 'Elegant scarves and celestial wraps',
    route: '/collections/scarves.html'
  },
  'gloves': {
    name: 'Gloves',
    description: 'Refined gloves and hand accessories',
    route: '/collections/gloves.html'
  }
};

/*
Example 5: Rendering products with the schema
*/
function renderProductCard(product) {
  // Validate product first
  if (!validateProduct(product)) {
    console.error('Invalid product:', product);
    return '';
  }
  
  const imageUrl = product.images[0] 
    ? `/assets/products/${product.images[0]}` 
    : '/assets/img/placeholder.png';
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${imageUrl}" alt="${product.title}">
        ${product.sign ? `<span class="product-sign">${product.sign}</span>` : ''}
      </div>
      <div class="product-details">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          ${product.attributes.material ? `<span class="material">${product.attributes.material}</span>` : ''}
          ${product.attributes.embroidery ? `<span class="embroidery">✨ Embroidered</span>` : ''}
          <span class="made-in">Made in ${product.madeIn}</span>
        </div>
        <div class="product-price">£${product.price.toFixed(2)}</div>
        <button class="add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

/*
Example 6: Advanced filtering with multiple criteria
*/
async function advancedProductFiltering() {
  const response = await fetch('/data/products.json');
  let products = await response.json();
  
  // Chain multiple filters
  products = filterByCategory(products, 'zodiac-wardrobe'); // Only wardrobe items
  products = filterByPriceRange(products, 50, 100);         // £50-£100
  products = sortByPrice(products, 'asc');                  // Lowest price first
  
  // console.log('Filtered and sorted products:', products);
  
  return products;
}

// Export examples for use in other modules
export {
  exampleProduct,
  loadAndFilterProducts,
  getProductMetadata,
  CATEGORY_INFO,
  renderProductCard,
  advancedProductFiltering
};
