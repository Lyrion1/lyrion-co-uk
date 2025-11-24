/**
 * LYRION Product Detail Page
 * Dynamically loads and displays product details by ID from URL parameter
 */

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
  // Get product ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    showError('No product ID specified. Please return to the shop.');
    return;
  }

  try {
    // Load products from JSON
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error('Failed to load products');
    
    const products = await response.json();
    const product = products.find(p => p.sku === productId);

    if (!product) {
      showError('Product not found. This item may no longer be available.');
      return;
    }

    // Render product details
    renderProductDetail(product);
    renderBreadcrumb(product);
    updatePageTitle(product);

  } catch (error) {
    console.error('Error loading product:', error);
    showError('Unable to load product details. Please try again later.');
  }
});

/**
 * Render the product detail page
 */
function renderProductDetail(product) {
  const container = document.getElementById('product-container');
  
  // Build badges array
  const badges = [];
  
  // Add "Made in England" badge for apparel items
  if (product.type === 'apparel') {
    badges.push({ text: 'Made in England', className: 'badge-england' });
  }
  
  // Add sale badge if applicable
  if (product.isSale) {
    badges.push({ text: 'Sale', className: '' });
  }
  
  // Add category badge
  if (product.category) {
    badges.push({ text: product.category, className: '' });
  }

  // Build image URL
  const imageUrl = product.image 
    ? `assets/products/${product.image}` 
    : 'assets/img/placeholder.png';

  // Create product detail HTML
  container.innerHTML = `
    <div class="product-detail-container">
      <div class="product-images">
        <div class="product-main-image">
          <img 
            src="${imageUrl}" 
            alt="${escapeHtml(product.title)}"
            onerror="this.src='assets/img/placeholder.png'; this.style.opacity='0.3';"
          >
        </div>
      </div>

      <div class="product-info">
        <div>
          <h1 class="product-title">${escapeHtml(product.title)}</h1>
          ${product.subtitle ? `<p class="product-subtitle">${escapeHtml(product.subtitle)}</p>` : ''}
        </div>

        <div class="product-price-section">
          ${product.compareAtPrice && product.compareAtPrice > product.price ? `
            <span class="product-compare-price">£${product.compareAtPrice.toFixed(2)}</span>
          ` : ''}
          <span class="product-price">£${product.price.toFixed(2)}</span>
        </div>

        ${badges.length > 0 ? `
          <div class="product-badges">
            ${badges.map(badge => `
              <span class="badge ${badge.className}">${badge.text}</span>
            `).join('')}
          </div>
        ` : ''}

        ${getProductDescription(product) ? `
          <div class="product-description">
            ${escapeHtml(getProductDescription(product))}
          </div>
        ` : ''}

        <div class="product-meta">
          ${product.category ? `
            <div class="product-meta-item">
              <span class="product-meta-label">Category</span>
              <span class="product-meta-value">${escapeHtml(product.category)}</span>
            </div>
          ` : ''}
          ${product.sign ? `
            <div class="product-meta-item">
              <span class="product-meta-label">Zodiac Sign</span>
              <span class="product-meta-value">${escapeHtml(product.sign)}</span>
            </div>
          ` : ''}
          ${product.type ? `
            <div class="product-meta-item">
              <span class="product-meta-label">Type</span>
              <span class="product-meta-value">${escapeHtml(capitalizeFirst(product.type))}</span>
            </div>
          ` : ''}
          ${product.tags && product.tags.length > 0 ? `
            <div class="product-meta-item">
              <span class="product-meta-label">Tags</span>
              <span class="product-meta-value">${product.tags.map(tag => escapeHtml(tag)).join(', ')}</span>
            </div>
          ` : ''}
        </div>

        <div class="product-actions">
          <button 
            class="button-add-to-cart" 
            id="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add event listener to the Add to Cart button
  const addToCartBtn = container.querySelector('#add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (typeof buy === 'function') {
        buy(product.sku);
      } else {
        console.error('Checkout function not available');
        alert('Checkout is not available. Please try again later.');
      }
    });
  }
}

/**
 * Get product description from various possible sources
 */
function getProductDescription(product) {
  // Try to get description from different possible fields
  if (product.description) return product.description;
  if (product.subtitle) return product.subtitle;
  return null;
}

/**
 * Render breadcrumb navigation
 */
function renderBreadcrumb(product) {
  const breadcrumb = document.getElementById('breadcrumb');
  
  // Build category URL
  const categoryUrl = product.category 
    ? getCategoryUrl(product.category)
    : 'shop.html';
  
  const categoryName = product.category || 'Shop';
  
  breadcrumb.innerHTML = `
    <a href="index.html">Home</a>
    <span>→</span>
    <a href="${categoryUrl}">${escapeHtml(categoryName)}</a>
    <span>→</span>
    <span>${escapeHtml(product.title)}</span>
  `;
}

/**
 * Get category URL based on category name
 */
function getCategoryUrl(category) {
  const categoryMap = {
    'Men': 'shop.html?category=Man',
    'Women': 'shop.html?category=Woman',
    'Moon Girls': 'shop.html?category=MoonGirls',
    'Star Boys': 'shop.html?category=StarBoys',
    'Home & Altar': 'shop.html?category=HomeArt',
    'Digital': 'shop.html?category=Digital',
    'Bundles': 'shop.html?category=Bundles'
  };
  
  return categoryMap[category] || 'shop.html';
}

/**
 * Update page title
 */
function updatePageTitle(product) {
  document.title = `${product.title} | LYRĪON`;
  
  // Update meta description if it exists
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    const description = getProductDescription(product);
    if (description) {
      metaDescription.setAttribute('content', description);
    }
  }
}

/**
 * Show error message
 */
function showError(message) {
  const container = document.getElementById('product-container');
  container.innerHTML = `
    <div class="error-message">
      <div style="font-size: 2rem; margin-bottom: 1rem;">✦</div>
      <p>${escapeHtml(message)}</p>
      <a href="shop.html" class="button-primary button-gold" style="display: inline-block; margin-top: 1.5rem; text-decoration: none;">
        Return to Shop
      </a>
    </div>
  `;
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
