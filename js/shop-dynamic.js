/**
 * LYRION Shop - Dynamic Product Display
 * Uses static product data (no network calls)
 */

// Import static product data
import { PRODUCTS_DATA } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  // Use static product data directly
  const allProducts = PRODUCTS_DATA;
  
  try {
    initializeShop(allProducts);
  } catch (error) {
    showError('Unable to load products. Please refresh the page.');
  }
});

/**
 * Initialize shop with products
 */
function initializeShop(products) {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  // If a category is specified, filter and display
  if (categoryParam) {
    const filteredProducts = filterByCategory(products, categoryParam);
    renderProducts(filteredProducts, categoryParam);
  } else {
    renderCategoryGrid();
  }
}

/**
 * Filter products by category
 */
function filterByCategory(products, category) {
  const categoryMap = {
    'Woman': 'Women',
    'Man': 'Men',
    'MoonGirls': 'Moon Girls',
    'StarBoys': 'Star Boys',
    'HomeArt': 'Home & Altar',
    'Bundles': 'Bundles',
    'Digital': 'Digital'
  };

  const targetCategory = categoryMap[category] || category;
  return products.filter(p => p.category === targetCategory);
}

/**
 * Filter products by zodiac sign
 */
function filterBySign(products, sign) {
  return products.filter(p => p.sign && p.sign.toLowerCase() === sign.toLowerCase());
}

/**
 * Render products grid using the ProductGrid component
 */
function renderProducts(products, categoryTitle) {
  ProductGrid.create(products, {
    containerSelector: 'main',
    showHeader: true,
    headerTitle: categoryTitle || 'All Products',
    headerSubtitle: 'Celestial apparel and ritual items crafted with intention'
  });
}

/**
 * Render category selection grid (default view)
 */
function renderCategoryGrid() {
  // This view is handled by the existing static HTML in shop.html
  // We keep the existing "Celestial Quarters" design intact
}

/**
 * Show error message
 */
function showError(message) {
  const container = document.querySelector('main') || document.body;
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    max-width: 800px;
    margin: 4rem auto;
    padding: 2rem;
    background: rgba(204, 0, 0, 0.1);
    border: 2px solid #CC0000;
    border-radius: 12px;
    text-align: center;
    color: #CC0000;
    font-size: 1.2rem;
  `;
  errorDiv.textContent = message;
  container.appendChild(errorDiv);
}

/**
 * Handle collections page with sign filtering
 */
function initializeCollections(products) {
  const urlParams = new URLSearchParams(window.location.search);
  const signParam = urlParams.get('sign');

  if (signParam) {
    const filteredProducts = filterBySign(products, signParam);
    renderProducts(filteredProducts, `${signParam} Collection`);
  }
}

// Note: buy() function is defined in checkout.js which is loaded on the same pages
// It's available globally when both scripts are included
