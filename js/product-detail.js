/**
 * LYRION Product Detail Page
 * Dynamically loads and displays product details by ID from URL parameter
 */

// Asset path constants for maintainability
const ASSET_PATHS = {
  PRODUCTS: 'assets/products/',
  PRODUCT_IMAGES: 'assets/img/products/',
  PLACEHOLDER: 'assets/img/placeholder.png'
};

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Build and sanitize product image URL
 * @param {string} image - Product image filename or path
 * @returns {string} - Sanitized image URL
 */
function buildProductImageUrl(image) {
  if (!image) return ASSET_PATHS.PLACEHOLDER;
  
  // Check if it's already an absolute path (starts with /)
  if (image.startsWith('/')) {
    // Validate the path structure for product images and return without leading slash for relative URL
    // Using a static pattern since we know the expected path structure
    if (/^\/assets\/img\/products\/[a-zA-Z0-9._-]+\.(webp|jpg|jpeg|png|gif)$/i.test(image)) {
      return image.substring(1); // Remove leading slash for relative URL
    }
    return ASSET_PATHS.PLACEHOLDER;
  }
  
  // Only allow alphanumeric, dash, underscore and dot for simple filenames
  if (/^[a-zA-Z0-9._-]+\.(webp|jpg|jpeg|png|gif)$/i.test(image)) {
    return `${ASSET_PATHS.PRODUCTS}${image}`;
  }
  return ASSET_PATHS.PLACEHOLDER;
}

/**
 * Buy a product directly and redirect to embedded checkout
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {string} image - Product image URL
 * @param {string} variantId - Optional variant ID
 * @param {string} productId - Optional product ID/SKU
 */
function buyProduct(name, price, image, variantId, productId) {
  const item = {
    name: name,
    price: parseFloat(price),
    quantity: 1,
    product_type: 'pod',
    image: image || '',
    variantId: variantId || '',
    productId: productId || ''
  };
  
  const checkoutCart = {
    items: [item],
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem('lyrion_checkout_cart', JSON.stringify(checkoutCart));
    window.location.href = '/checkout.html';
  } catch (error) {
    console.error('Error saving cart:', error);
    alert('Unable to process purchase. Please try again.');
  }
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
  
  // Add sale badge if applicable (using same logic as price display)
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    badges.push({ text: 'Sale', className: '' });
  }
  
  // Add category badge
  if (product.category) {
    badges.push({ text: product.category, className: '' });
  }

  // Build image URL using helper function
  const imageUrl = buildProductImageUrl(product.image);
  
  // Build image gallery HTML if multiple images exist
  const hasMultipleImages = product.images && product.images.length > 1;
  const imagesGalleryHtml = hasMultipleImages ? `
    <div class="product-thumbnails" style="display: flex; gap: 0.75rem; margin-top: 1rem; justify-content: center;">
      ${product.images.map((img, index) => `
        <button 
          class="thumbnail-btn ${index === 0 ? 'active' : ''}" 
          data-image="${escapeHtml(buildProductImageUrl(img))}"
          style="
            width: 70px;
            height: 70px;
            border: 2px solid ${index === 0 ? 'var(--color-gold)' : '#ddd'};
            border-radius: 8px;
            background: #f8f8f8;
            cursor: pointer;
            padding: 4px;
            transition: border-color 0.3s ease;
          "
        >
          <img 
            src="${escapeHtml(buildProductImageUrl(img))}" 
            alt="${escapeHtml(product.title)} view ${index + 1}"
            style="width: 100%; height: 100%; object-fit: contain;"
            onerror="this.src='assets/img/placeholder.png'; this.style.opacity='0.3';"
          >
        </button>
      `).join('')}
    </div>
  ` : '';
  
  // Build size selector HTML if variants exist
  const hasVariants = product.variants && product.variants.length > 0;
  const sizesSelectorHtml = hasVariants ? `
    <div class="product-sizes" style="margin: 1.5rem 0;">
      <span class="product-meta-label" style="display: block; margin-bottom: 0.75rem;">Size</span>
      <div class="size-buttons" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        ${product.variants.map((size, index) => `
          <button 
            class="size-btn ${index === 0 ? 'active' : ''}" 
            data-size="${escapeHtml(size)}"
            style="
              min-width: 50px;
              padding: 0.6rem 1rem;
              border: 2px solid ${index === 0 ? 'var(--color-gold)' : '#ddd'};
              background: ${index === 0 ? 'var(--color-gold)' : 'transparent'};
              color: var(--color-ink);
              font-size: 0.95rem;
              font-weight: 500;
              cursor: pointer;
              border-radius: 6px;
              transition: all 0.3s ease;
            "
          >${escapeHtml(size)}</button>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Create product detail HTML
  container.innerHTML = `
    <div class="product-detail-container">
      <div class="product-images">
        <div class="product-main-image">
          <img 
            id="product-image"
            src="${escapeHtml(imageUrl)}" 
            alt="${escapeHtml(product.title)}"
          >
        </div>
        ${imagesGalleryHtml}
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
              <span class="badge ${badge.className}">${escapeHtml(badge.text)}</span>
            `).join('')}
          </div>
        ` : ''}

        ${getProductDescription(product) ? `
          <div class="product-description">
            ${escapeHtml(getProductDescription(product))}
          </div>
        ` : ''}

        ${sizesSelectorHtml}

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
  
  // Add event listener to the product image for error handling
  const productImage = container.querySelector('#product-image');
  if (productImage) {
    productImage.addEventListener('error', function() {
      this.src = 'assets/img/placeholder.png';
      this.style.opacity = '0.3';
    });
  }
  
  // Add event listeners for image thumbnails
  if (hasMultipleImages) {
    const thumbnails = container.querySelectorAll('.thumbnail-btn');
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
        const newImageUrl = this.dataset.image;
        if (productImage) {
          productImage.src = newImageUrl;
          productImage.style.opacity = '1';
        }
        // Update active state
        thumbnails.forEach(t => {
          t.classList.remove('active');
          t.style.borderColor = '#ddd';
        });
        this.classList.add('active');
        this.style.borderColor = 'var(--color-gold)';
      });
    });
  }
  
  // Add event listeners for size selection
  let selectedSize = hasVariants ? product.variants[0] : null;
  if (hasVariants) {
    const sizeButtons = container.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        selectedSize = this.dataset.size;
        // Update active state
        sizeButtons.forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = '#ddd';
          b.style.background = 'transparent';
        });
        this.classList.add('active');
        this.style.borderColor = 'var(--color-gold)';
        this.style.background = 'var(--color-gold)';
      });
    });
  }
  
  // Add event listener to the Add to Cart button
  const addToCartBtn = container.querySelector('#add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      // Pass size information through variantId, keeping original product title
      const variantId = selectedSize ? selectedSize : '';
      buyProduct(product.title, product.price, buildProductImageUrl(product.image), variantId, product.sku);
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
    <a href="${escapeHtml(categoryUrl)}">${escapeHtml(categoryName)}</a>
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
  // document.title handles text safely, no need for escapeHtml
  document.title = `${product.title} | LYRĪON`;
  
  // Update meta description if it exists
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    const description = getProductDescription(product);
    if (description) {
      // setAttribute handles text safely, no need for escapeHtml
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
