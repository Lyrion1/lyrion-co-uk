/**
 * ProductGrid Component
 * A reusable component for displaying products in an elegant, responsive grid
 * 
 * Features:
 * - Displays product image, title, price, and "View" button
 * - Elegant minimal styling consistent with LYRION design
 * - Responsive layout: 2 columns on mobile → 4 columns on desktop
 */

class ProductGrid {
  /**
   * Creates a new ProductGrid instance
   * @param {Array} products - Array of product objects
   * @param {Object} options - Optional configuration
   * @param {string} options.containerSelector - CSS selector for the container (default: 'main')
   * @param {string} options.gridClass - Additional CSS class for the grid
   */
  constructor(products = [], options = {}) {
    this.products = products;
    this.options = {
      containerSelector: options.containerSelector || 'main',
      gridClass: options.gridClass || '',
      showHeader: options.showHeader !== false,
      headerTitle: options.headerTitle || 'Products',
      headerSubtitle: options.headerSubtitle || 'Celestial apparel and ritual items crafted with intention'
    };
  }

  /**
   * Renders the complete product grid
   */
  render() {
    const container = document.querySelector(this.options.containerSelector);
    if (!container) {
      console.error('Container not found:', this.options.containerSelector);
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Add header if enabled
    if (this.options.showHeader) {
      container.appendChild(this.createHeader());
    }

    // Add products grid
    container.appendChild(this.createGrid());
  }

  /**
   * Creates the header section
   * @returns {HTMLElement}
   */
  createHeader() {
    const header = document.createElement('section');
    header.className = 'product-grid-header';
    header.style.cssText = `
      max-width: 1200px;
      margin: 4rem auto 3rem auto;
      text-align: center;
      padding: 0 2rem;
    `;

    header.innerHTML = `
      <h1 style="
        font-size: 3.8rem;
        color: var(--color-ink);
        margin-bottom: 1.5rem;
        letter-spacing: 1px;
        font-family: var(--font-serif);
      ">
        ${this.options.headerTitle}
      </h1>
      <p style="
        font-family: var(--font-serif);
        font-size: 1.3rem;
        color: var(--color-gold);
        font-style: italic;
      ">
        ${this.options.headerSubtitle}
      </p>
    `;

    return header;
  }

  /**
   * Creates the products grid
   * @returns {HTMLElement}
   */
  createGrid() {
    const grid = document.createElement('section');
    grid.className = `product-grid ${this.options.gridClass}`.trim();
    grid.style.cssText = `
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 4rem 6rem 4rem;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    `;

    // Add media query styles only once
    if (!document.getElementById('product-grid-styles')) {
      const style = document.createElement('style');
      style.id = 'product-grid-styles';
      style.textContent = `
        @media (max-width: 1200px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            padding: 2rem 3rem 5rem 3rem !important;
          }
        }
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 2rem 1.5rem 4rem 1.5rem !important;
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 480px) {
          .product-grid {
            gap: 1rem !important;
          }
          .product-grid-header h1 {
            font-size: 2.5rem !important;
          }
          .product-grid-header p {
            font-size: 1.1rem !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    if (this.products.length === 0) {
      grid.innerHTML = `
        <p style="
          text-align: center;
          grid-column: 1 / -1;
          font-family: var(--font-serif);
          margin-top: 2rem;
          color: #5a5856;
          font-size: 1.2rem;
        ">
          No products found in this collection.
        </p>
      `;
    } else {
      this.products.forEach(product => {
        grid.appendChild(this.createProductCard(product));
      });
    }

    return grid;
  }

  /**
   * Creates a single product card
   * @param {Object} product - Product data
   * @returns {HTMLElement}
   */
  createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.style.cssText = `
      background: linear-gradient(135deg, rgba(244, 239, 232, 0.4) 0%, rgba(252, 250, 250, 0.8) 100%);
      border: 2px solid var(--color-gold);
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    `;

    // Sale badge if applicable
    const saleBadge = product.isSale ? `
      <div style="
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--color-gold);
        color: var(--color-ink);
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 1px;
        z-index: 1;
      ">SALE</div>
    ` : '';

    // Product image
    const imageUrl = product.image ? `/assets/products/${product.image}` : '/assets/img/placeholder.png';
    
    card.innerHTML = `
      ${saleBadge}
      <div style="
        margin-bottom: 1rem;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f8f8;
        border-radius: 8px;
        overflow: hidden;
      ">
        <img 
          src="${imageUrl}" 
          alt="${product.title}" 
          style="
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          "
          onerror="this.src='/assets/img/placeholder.png'; this.style.opacity='0.3';"
        >
      </div>
      <h3 style="
        font-size: 1.2rem;
        color: var(--color-ink);
        margin-bottom: 0.5rem;
        font-family: var(--font-serif);
        flex-grow: 1;
      ">
        ${product.title}
      </h3>
      <div style="margin: 1rem 0;">
        ${product.compareAtPrice > product.price ? `
          <span style="
            text-decoration: line-through;
            color: #999;
            font-size: 0.9rem;
            margin-right: 0.5rem;
          ">£${product.compareAtPrice.toFixed(2)}</span>
        ` : ''}
        <span style="
          font-size: 1.5rem;
          color: var(--color-ink);
          font-weight: 600;
        ">£${product.price.toFixed(2)}</span>
      </div>
      <button 
        class="product-view-btn"
        data-sku="${product.sku}"
        style="
          background: var(--color-gold);
          color: var(--color-ink);
          border: none;
          padding: 0.8rem 2rem;
          font-size: 1rem;
          font-family: inherit;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
          letter-spacing: 1px;
          font-weight: 500;
        "
      >
        View
      </button>
    `;

    // Add hover effects
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 12px 35px rgba(196, 164, 73, 0.25)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    });

    // Button hover effect
    const button = card.querySelector('.product-view-btn');
    button.addEventListener('mouseenter', () => {
      button.style.background = 'var(--color-gold-dark, #A38435)';
      button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = 'var(--color-gold)';
      button.style.transform = 'translateY(0)';
    });

    // Click handler for the View button
    button.addEventListener('click', () => {
      this.handleViewClick(product);
    });

    return card;
  }

  /**
   * Handles the view button click
   * @param {Object} product - Product data
   */
  handleViewClick(product) {
    // If a global buy() function exists (from checkout.js), use it
    if (typeof buy === 'function') {
      buy(product.sku);
    } else {
      // Fallback: emit a custom event that can be handled by the parent page
      const event = new CustomEvent('product-view', {
        detail: { product },
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Updates the products and re-renders
   * @param {Array} products - New array of products
   */
  updateProducts(products) {
    this.products = products;
    this.render();
  }

  /**
   * Static method to create and render a grid in one call
   * @param {Array} products - Array of product objects
   * @param {Object} options - Optional configuration
   * @returns {ProductGrid} - The created ProductGrid instance
   */
  static create(products, options = {}) {
    const grid = new ProductGrid(products, options);
    grid.render();
    return grid;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductGrid;
}
