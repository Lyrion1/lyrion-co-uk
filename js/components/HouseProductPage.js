/**
 * HouseProductPage Component
 * A component for displaying products on individual house pages
 * with filtering by category and zodiac sign
 * 
 * Features:
 * - Product grid filtered by house
 * - Category filter chips (All / Hoodies / Hats / Socks / Home)
 * - Shop by Sign zodiac panel
 * - Oracle CTA block
 */

class HouseProductPage {
  /**
   * Creates a new HouseProductPage instance
   * @param {Object} options - Configuration options
   * @param {string} options.house - House identifier: 'woman', 'man', 'girls', 'boys'
   * @param {string} options.containerSelector - CSS selector for the container
   * @param {string} options.dataPath - Path to products.js data file (defaults to '/data/products.js')
   * @param {string} options.assetsPath - Base path for product assets (defaults to '../assets/products/')
   */
  constructor(options = {}) {
    this.options = {
      house: options.house || 'woman',
      containerSelector: options.containerSelector || '#house-products-container',
      dataPath: options.dataPath || '/data/products.js',
      assetsPath: options.assetsPath || '../assets/products/'
    };

    this.products = [];
    this.activeCategory = 'all';
    this.activeSign = null;
    
    // Zodiac signs data
    this.zodiacSigns = [
      { symbol: '♈', name: 'Aries', slug: 'aries' },
      { symbol: '♉', name: 'Taurus', slug: 'taurus' },
      { symbol: '♊', name: 'Gemini', slug: 'gemini' },
      { symbol: '♋', name: 'Cancer', slug: 'cancer' },
      { symbol: '♌', name: 'Leo', slug: 'leo' },
      { symbol: '♍', name: 'Virgo', slug: 'virgo' },
      { symbol: '♎', name: 'Libra', slug: 'libra' },
      { symbol: '♏', name: 'Scorpio', slug: 'scorpio' },
      { symbol: '♐', name: 'Sagittarius', slug: 'sagittarius' },
      { symbol: '♑', name: 'Capricorn', slug: 'capricorn' },
      { symbol: '♒', name: 'Aquarius', slug: 'aquarius' },
      { symbol: '♓', name: 'Pisces', slug: 'pisces' }
    ];

    // Category mappings - standardized to check both tags and category fields
    this.categoryFilters = [
      { id: 'all', label: 'All' },
      { id: 'hoodie', label: 'Hoodies', match: (p) => p.tags?.includes('hoodie') || p.category?.toLowerCase().includes('hoodie') },
      { id: 'tee', label: 'Tees', match: (p) => p.tags?.includes('tee') || p.category?.toLowerCase().includes('tee') },
      { id: 'hats', label: 'Hats', match: (p) => p.tags?.includes('hat') || p.category === 'Hats' || p.type === 'hats' },
      { id: 'socks', label: 'Socks', match: (p) => p.tags?.includes('sock') || p.category === 'Socks' || p.type === 'socks' },
      { id: 'home', label: 'Home', match: (p) => p.tags?.includes('home') || p.type === 'home' || p.category === 'Home & Altar' }
    ];
  }

  /**
   * Initialize and render the house page
   */
  async init() {
    try {
      // Use configurable path for the products data
      // This ensures flexibility when the site is served from different paths
      const { PRODUCTS_DATA } = await import(this.options.dataPath);
      this.products = PRODUCTS_DATA.filter(p => p.house === this.options.house);
      
      this.injectStyles();
      this.render();
    } catch (error) {
      console.error('Failed to load products:', error);
      this.showError();
    }
  }

  /**
   * Filter products by current filters
   */
  getFilteredProducts() {
    let filtered = [...this.products];

    // Apply category filter
    if (this.activeCategory !== 'all') {
      const categoryFilter = this.categoryFilters.find(f => f.id === this.activeCategory);
      if (categoryFilter && categoryFilter.match) {
        filtered = filtered.filter(p => categoryFilter.match(p));
      }
    }

    // Apply sign filter
    if (this.activeSign) {
      filtered = filtered.filter(p => 
        p.sign && p.sign.toLowerCase() === this.activeSign.toLowerCase()
      );
    }

    return filtered;
  }

  /**
   * Inject CSS styles
   */
  injectStyles() {
    if (document.getElementById('house-product-page-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'house-product-page-styles';
    style.textContent = `
      .house-filter-section {
        max-width: 1200px;
        margin: 0 auto 2rem auto;
        padding: 0 2rem;
      }
      
      .filter-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
        margin-bottom: 1.5rem;
      }
      
      .filter-chip {
        padding: 0.6rem 1.5rem;
        border: 2px solid var(--color-gold);
        background: transparent;
        color: var(--color-ink);
        font-family: var(--font-sans);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        border-radius: 25px;
        transition: all 0.3s ease;
      }
      
      .filter-chip:hover {
        background: rgba(196, 164, 73, 0.1);
      }
      
      .filter-chip.active {
        background: var(--color-gold);
        color: var(--color-ink);
      }
      
      .zodiac-shop-panel {
        max-width: 1200px;
        margin: 0 auto 3rem auto;
        padding: 2rem;
        background: linear-gradient(135deg, rgba(244, 239, 232, 0.5) 0%, rgba(252, 250, 250, 0.8) 100%);
        border: 1px solid var(--color-gold);
        border-radius: 12px;
      }
      
      .zodiac-shop-panel h3 {
        text-align: center;
        font-size: 1.5rem;
        color: var(--color-ink);
        margin-bottom: 1rem;
        font-family: var(--font-serif);
      }
      
      .zodiac-shop-panel p {
        text-align: center;
        color: #5a5856;
        font-style: italic;
        margin-bottom: 1.5rem;
      }
      
      .zodiac-sign-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
      }
      
      .zodiac-sign-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.6rem 0.8rem;
        border: 1px solid var(--color-gold);
        background: white;
        color: var(--color-ink);
        font-size: 0.75rem;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        min-width: 70px;
      }
      
      .zodiac-sign-btn:hover {
        background: rgba(196, 164, 73, 0.1);
        transform: translateY(-2px);
      }
      
      .zodiac-sign-btn.active {
        background: var(--color-gold);
        border-color: #A38435;
      }
      
      .zodiac-sign-btn .symbol {
        font-size: 1.3rem;
        margin-bottom: 0.25rem;
      }
      
      .house-products-grid {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 3rem 3rem 3rem;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
      }
      
      .oracle-cta-block {
        max-width: 800px;
        margin: 3rem auto 4rem auto;
        padding: 3rem 2rem;
        text-align: center;
        background: linear-gradient(135deg, rgba(244, 239, 232, 0.4) 0%, rgba(252, 250, 250, 0.7) 100%);
        border: 1px solid rgba(196, 164, 73, 0.3);
        border-radius: 12px;
      }
      
      .oracle-cta-block p {
        font-family: var(--font-serif);
        font-size: 1.2rem;
        color: var(--color-ink);
        margin-bottom: 1.5rem;
        font-style: italic;
      }
      
      .no-products-message {
        grid-column: 1 / -1;
        text-align: center;
        font-family: var(--font-serif);
        color: #5a5856;
        font-size: 1.2rem;
        font-style: italic;
        padding: 3rem;
      }
      
      .clear-filters-btn {
        background: none;
        border: none;
        color: var(--color-gold);
        cursor: pointer;
        text-decoration: underline;
        font-size: 1rem;
        margin-top: 1rem;
      }
      
      @media (max-width: 1200px) {
        .house-products-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      @media (max-width: 768px) {
        .house-products-grid {
          grid-template-columns: repeat(2, 1fr);
          padding: 0 1.5rem 3rem 1.5rem;
          gap: 1.5rem;
        }
        
        .zodiac-sign-btn {
          min-width: 60px;
          padding: 0.5rem 0.6rem;
          font-size: 0.7rem;
        }
        
        .zodiac-sign-btn .symbol {
          font-size: 1.1rem;
        }
      }
      
      @media (max-width: 480px) {
        .house-products-grid {
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Render the complete page
   */
  render() {
    const container = document.querySelector(this.options.containerSelector);
    if (!container) {
      console.error('Container not found:', this.options.containerSelector);
      return;
    }

    container.innerHTML = '';
    
    // Render filter chips
    container.appendChild(this.createFilterChips());
    
    // Render zodiac shop panel
    container.appendChild(this.createZodiacPanel());
    
    // Render products grid
    container.appendChild(this.createProductsGrid());
    
    // Render oracle CTA
    container.appendChild(this.createOracleCTA());
  }

  /**
   * Create filter chips section
   */
  createFilterChips() {
    const section = document.createElement('div');
    section.className = 'house-filter-section';
    
    const chips = document.createElement('div');
    chips.className = 'filter-chips';
    
    this.categoryFilters.forEach(filter => {
      const chip = document.createElement('button');
      chip.className = `filter-chip ${this.activeCategory === filter.id ? 'active' : ''}`;
      chip.textContent = filter.label;
      chip.addEventListener('click', () => {
        this.activeCategory = filter.id;
        this.render();
      });
      chips.appendChild(chip);
    });
    
    section.appendChild(chips);
    return section;
  }

  /**
   * Create zodiac shop panel
   */
  createZodiacPanel() {
    const panel = document.createElement('div');
    panel.className = 'zodiac-shop-panel';
    
    const title = document.createElement('h3');
    title.textContent = '✧ Shop by Sign ✧';
    
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Filter products by your zodiac sign';
    
    const buttons = document.createElement('div');
    buttons.className = 'zodiac-sign-buttons';
    
    // Add "All Signs" button
    const allBtn = document.createElement('button');
    allBtn.className = `zodiac-sign-btn ${!this.activeSign ? 'active' : ''}`;
    allBtn.innerHTML = '<span class="symbol">✦</span><span>All</span>';
    allBtn.addEventListener('click', () => {
      this.activeSign = null;
      this.render();
    });
    buttons.appendChild(allBtn);
    
    // Add individual sign buttons
    this.zodiacSigns.forEach(sign => {
      const btn = document.createElement('button');
      btn.className = `zodiac-sign-btn ${this.activeSign === sign.name ? 'active' : ''}`;
      btn.innerHTML = `<span class="symbol">${sign.symbol}</span><span>${sign.name}</span>`;
      btn.addEventListener('click', () => {
        this.activeSign = sign.name;
        this.render();
      });
      buttons.appendChild(btn);
    });
    
    panel.appendChild(title);
    panel.appendChild(subtitle);
    panel.appendChild(buttons);
    
    return panel;
  }

  /**
   * Create products grid
   */
  createProductsGrid() {
    const grid = document.createElement('div');
    grid.className = 'house-products-grid';
    
    const filteredProducts = this.getFilteredProducts();
    
    if (filteredProducts.length === 0) {
      const noProducts = document.createElement('div');
      noProducts.className = 'no-products-message';
      noProducts.innerHTML = `
        <p>No products match your current filters.</p>
        <button class="clear-filters-btn">Clear all filters</button>
      `;
      noProducts.querySelector('.clear-filters-btn').addEventListener('click', () => {
        this.activeCategory = 'all';
        this.activeSign = null;
        this.render();
      });
      grid.appendChild(noProducts);
      return grid;
    }
    
    filteredProducts.forEach(product => {
      grid.appendChild(this.createProductCard(product));
    });
    
    return grid;
  }

  /**
   * Create a single product card
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

    // Use configurable asset path for product images
    const placeholderPath = this.options.assetsPath.replace('/products/', '/img/placeholder.png');
    const imageUrl = product.image ? `${this.options.assetsPath}${product.image}` : placeholderPath;
    
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
          onerror="this.src='../assets/img/placeholder.png'; this.style.opacity='0.3';"
          loading="lazy"
        >
      </div>
      <h3 style="
        font-size: 1.1rem;
        color: var(--color-ink);
        margin-bottom: 0.5rem;
        font-family: var(--font-serif);
        flex-grow: 1;
      ">
        ${product.title}
      </h3>
      ${product.sign && product.sign !== 'all' ? `
        <p style="
          font-size: 0.85rem;
          color: var(--color-gold);
          margin-bottom: 0.5rem;
        ">
          ${product.sign}
        </p>
      ` : ''}
      <div style="margin: 0.5rem 0;">
        ${product.compareAtPrice && product.compareAtPrice > product.price ? `
          <span style="
            text-decoration: line-through;
            color: #999;
            font-size: 0.9rem;
            margin-right: 0.5rem;
          ">£${product.compareAtPrice.toFixed(2)}</span>
        ` : ''}
        <span style="
          font-size: 1.3rem;
          color: var(--color-ink);
          font-weight: 600;
        ">£${product.price.toFixed(2)}</span>
      </div>
      <a 
        href="../product.html?id=${product.sku}"
        style="
          display: inline-block;
          background: var(--color-gold);
          color: var(--color-ink);
          border: none;
          padding: 0.7rem 1.5rem;
          font-size: 0.9rem;
          font-family: inherit;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
          letter-spacing: 1px;
          font-weight: 500;
          text-decoration: none;
          text-align: center;
          margin-top: 0.5rem;
        "
      >
        View
      </a>
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

    return card;
  }

  /**
   * Create Oracle CTA block
   */
  createOracleCTA() {
    const cta = document.createElement('div');
    cta.className = 'oracle-cta-block';
    cta.innerHTML = `
      <p>Need guidance choosing a piece? Visit The Oracle.</p>
      <a href="../oracle.html" class="button-primary button-gold">Consult The Oracle</a>
    `;
    return cta;
  }

  /**
   * Show error message
   */
  showError() {
    const container = document.querySelector(this.options.containerSelector);
    if (container) {
      container.innerHTML = `
        <div style="
          max-width: 800px;
          margin: 4rem auto;
          padding: 2rem;
          background: rgba(204, 0, 0, 0.1);
          border: 2px solid #CC0000;
          border-radius: 12px;
          text-align: center;
          color: #CC0000;
          font-size: 1.2rem;
        ">
          Unable to load products. Please refresh the page.
        </div>
      `;
    }
  }

  /**
   * Static method to create and initialize in one call
   */
  static create(options) {
    const page = new HouseProductPage(options);
    page.init();
    return page;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HouseProductPage;
}
