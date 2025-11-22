/**
 * LYRION Shop - Dynamic Product Display
 * Loads products from data/products.json and enables filtering by category
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Load products from the generated JSON file
  let allProducts = [];

  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    allProducts = await response.json();
    
    initializeShop(allProducts);
  } catch (error) {
    console.error('Error loading products:', error);
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
 * Render products grid
 */
function renderProducts(products, categoryTitle) {
  const container = document.querySelector('main') || document.body;
  
  // Clear existing content
  container.innerHTML = '';

  // Add header
  const header = document.createElement('section');
  header.className = 'shop-header';
  header.style.cssText = 'max-width: 1200px; margin: 4rem auto 3rem auto; text-align: center; padding: 0 2rem;';
  header.innerHTML = `
    <h1 style="font-size: 3.8rem; color: #151311; margin-bottom: 1.5rem; letter-spacing: 1px;">
      ${categoryTitle || 'All Products'}
    </h1>
    <p style="font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #C4A449; font-style: italic;">
      Celestial apparel and ritual items crafted with intention
    </p>
  `;
  container.appendChild(header);

  // Add products grid
  const grid = document.createElement('section');
  grid.className = 'products-grid';
  grid.style.cssText = `
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 4rem 6rem 4rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 3rem;
  `;

  if (products.length === 0) {
    grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-family: var(--font-serif); margin-top: 2rem; color: #5a5856;">No products found in this collection.</p>';
  } else {
    products.forEach(product => {
      const card = createProductCard(product);
      grid.appendChild(card);
    });
  }

  container.appendChild(grid);
}

/**
 * Create a product card element
 */
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.style.cssText = `
    background: linear-gradient(135deg, rgba(244, 239, 232, 0.4) 0%, rgba(252, 250, 250, 0.8) 100%);
    border: 2px solid #C4A449;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
  `;

  // Show sale badge if applicable
  const saleBadge = product.isSale ? `
    <div style="
      position: absolute;
      top: 15px;
      right: 15px;
      background: #C4A449;
      color: #151311;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 1px;
    ">SALE</div>
  ` : '';

  // Bundle items display
  let bundleDisplay = '';
  if (product.type === 'bundle' && product.bundleItems.length > 0) {
    bundleDisplay = `
      <div style="
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(196, 164, 73, 0.1);
        border-radius: 8px;
        font-size: 0.9rem;
      ">
        <strong style="color: #C4A449;">Includes:</strong>
        <div style="color: #5a5856; margin-top: 0.5rem;">
          ${product.bundleItems.length} celestial items
        </div>
      </div>
    `;
  }

  card.innerHTML = `
    ${saleBadge}
    <div style="margin-bottom: 1.5rem; height: 250px; display: flex; align-items: center; justify-content: center; background: #f8f8f8; border-radius: 8px; overflow: hidden;">
      <img src="/assets/products/${product.image}" alt="${product.title}" 
           style="max-width: 100%; max-height: 100%; object-fit: contain;"
           onerror="this.src='/assets/img/placeholder.png'; this.style.opacity='0.3';">
    </div>
    <h3 style="font-size: 1.5rem; color: #151311; margin-bottom: 0.5rem;">${product.title}</h3>
    ${product.subtitle ? `<p style="font-family: 'Playfair Display', serif; font-size: 1rem; color: #5a5856; font-style: italic; margin-bottom: 1rem;">${product.subtitle}</p>` : ''}
    ${product.sign ? `<p style="font-size: 0.9rem; color: #C4A449; margin-bottom: 0.5rem;">♈ ${product.sign}</p>` : ''}
    <div style="margin: 1rem 0;">
      ${product.compareAtPrice > product.price ? `
        <span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-right: 0.5rem;">£${product.compareAtPrice.toFixed(2)}</span>
      ` : ''}
      <span style="font-size: 1.8rem; color: #151311; font-weight: 600;">£${product.price.toFixed(2)}</span>
    </div>
    ${bundleDisplay}
    <button 
      onclick="buy('${product.sku}')" 
      style="
        background: #C4A449;
        color: #151311;
        border: none;
        padding: 1rem 2.5rem;
        font-size: 1.1rem;
        font-family: inherit;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        margin-top: 1.5rem;
        width: 100%;
        letter-spacing: 1px;
      "
      onmouseover="this.style.background='#A38435'; this.style.transform='translateY(-2px)'"
      onmouseout="this.style.background='#C4A449'; this.style.transform='translateY(0)'"
    >
      ${product.type === 'digital' ? 'Purchase Digital' : 'Add to Cart'}
    </button>
  `;

  // Add hover effect
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
    card.style.boxShadow = '0 12px 35px rgba(196, 164, 73, 0.25)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
  });

  return card;
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
