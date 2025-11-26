/**
 * ZodiacLibraryGrid Component
 * A reusable component for displaying the twelve zodiac signs in an elegant, responsive grid
 * 
 * Features:
 * - Displays zodiac symbol, name, dates, and "Enter Constellation" button
 * - Elegant card design with gradient backgrounds and gold borders
 * - Responsive layout: adapts from mobile to desktop
 * - Hover effects and animations
 */

class ZodiacLibraryGrid {
  /**
   * Creates a new ZodiacLibraryGrid instance
   * @param {Object} options - Optional configuration
   * @param {string} options.containerSelector - CSS selector for the container (default: creates a new section)
   * @param {boolean} options.showHeader - Whether to show the header (default: true)
   * @param {string} options.headerTitle - Title text (default: 'The Zodiac Library')
   * @param {string} options.headerSubtitle - Subtitle text
   * @param {string} options.basePath - Base path for links (default: 'zodiac/')
   */
  constructor(options = {}) {
    this.options = {
      containerSelector: options.containerSelector || null,
      showHeader: options.showHeader !== false,
      headerTitle: options.headerTitle || 'The Zodiac Library',
      headerSubtitle: options.headerSubtitle || 'Twelve cosmic archetypes. Discover your celestial essence.',
      basePath: options.basePath || 'zodiac/'
    };

    // Zodiac signs data
    this.zodiacSigns = [
      { symbol: '♈', name: 'Aries', dates: 'March 21 - April 19', slug: 'aries' },
      { symbol: '♉', name: 'Taurus', dates: 'April 20 - May 20', slug: 'taurus' },
      { symbol: '♊', name: 'Gemini', dates: 'May 21 - June 20', slug: 'gemini' },
      { symbol: '♋', name: 'Cancer', dates: 'June 21 - July 22', slug: 'cancer' },
      { symbol: '♌', name: 'Leo', dates: 'July 23 - August 22', slug: 'leo' },
      { symbol: '♍', name: 'Virgo', dates: 'August 23 - September 22', slug: 'virgo' },
      { symbol: '♎', name: 'Libra', dates: 'September 23 - October 22', slug: 'libra' },
      { symbol: '♏', name: 'Scorpio', dates: 'October 23 - November 21', slug: 'scorpio' },
      { symbol: '♐', name: 'Sagittarius', dates: 'November 22 - December 21', slug: 'sagittarius' },
      { symbol: '♑', name: 'Capricorn', dates: 'December 22 - January 19', slug: 'capricorn' },
      { symbol: '♒', name: 'Aquarius', dates: 'January 20 - February 18', slug: 'aquarius' },
      { symbol: '♓', name: 'Pisces', dates: 'February 19 - March 20', slug: 'pisces' }
    ];
  }

  /**
   * Renders the complete zodiac library grid
   * @param {HTMLElement|string} container - Container element or selector
   */
  render(container) {
    let targetContainer;
    
    if (typeof container === 'string') {
      targetContainer = document.querySelector(container);
    } else if (container instanceof HTMLElement) {
      targetContainer = container;
    } else if (this.options.containerSelector) {
      targetContainer = document.querySelector(this.options.containerSelector);
    }

    if (!targetContainer) {
      console.error('Container not found for ZodiacLibraryGrid');
      return;
    }

    // Clear existing content
    targetContainer.innerHTML = '';

    // Add styles if not already added
    this.injectStyles();

    // Add header if enabled
    if (this.options.showHeader) {
      targetContainer.appendChild(this.createHeader());
    }

    // Add zodiac grid
    targetContainer.appendChild(this.createGrid());
  }

  /**
   * Injects the necessary CSS styles for the zodiac library grid
   */
  injectStyles() {
    if (document.getElementById('zodiac-library-grid-styles')) {
      return; // Styles already injected
    }

    const style = document.createElement('style');
    style.id = 'zodiac-library-grid-styles';
    style.textContent = `
      .zodiac-library-container {
        max-width: 1200px;
        margin: 4rem auto;
        padding: 0 2rem;
        text-align: center;
      }
      
      .zodiac-library-container h1 {
        font-size: 3.5rem;
        color: var(--color-ink);
        margin-bottom: 1rem;
        font-family: var(--font-serif);
      }
      
      .zodiac-library-container .subtitle {
        font-size: 1.3rem;
        color: var(--color-gold);
        font-style: italic;
        margin-bottom: 4rem;
        font-family: var(--font-serif);
      }
      
      .zodiac-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
      }
      
      .zodiac-card {
        background: linear-gradient(135deg, rgba(244, 239, 232, 0.5) 0%, rgba(252, 250, 250, 0.9) 100%);
        border: 2px solid var(--color-gold);
        border-radius: 12px;
        padding: 3rem 2rem 2rem 2rem;
        text-align: center;
        transition: all 0.4s ease;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .zodiac-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(196, 164, 73, 0.3);
        border-color: #A38435;
      }
      
      .zodiac-card .symbol {
        font-size: 4rem;
        color: var(--color-gold);
        margin-bottom: 1rem;
        display: block;
      }
      
      .zodiac-card h3 {
        font-size: 1.8rem;
        color: var(--color-ink);
        margin-bottom: 0.5rem;
        font-family: var(--font-serif);
      }
      
      .zodiac-card .dates {
        font-size: 0.95rem;
        color: var(--color-gold);
        font-style: italic;
      }

      @media (max-width: 768px) {
        .zodiac-library-container h1 {
          font-size: 2.5rem;
        }
        
        .zodiac-library-container .subtitle {
          font-size: 1.1rem;
        }
        
        .zodiac-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .zodiac-card {
          padding: 2rem 1.5rem 1.5rem 1.5rem;
        }
        
        .zodiac-card .symbol {
          font-size: 3rem;
        }
        
        .zodiac-card h3 {
          font-size: 1.5rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Creates the header section
   * @returns {HTMLElement}
   */
  createHeader() {
    const header = document.createElement('div');
    header.className = 'zodiac-library-header';
    
    const title = document.createElement('h2');
    title.className = 'section-title-celestial';
    title.style.cssText = 'margin-top: 0; font-size: 2.5rem;';
    title.textContent = this.options.headerTitle;
    
    const subtitle = document.createElement('p');
    subtitle.className = 'section-subtitle';
    subtitle.style.cssText = 'margin-bottom: 2rem;';
    subtitle.textContent = this.options.headerSubtitle;
    
    header.appendChild(title);
    header.appendChild(subtitle);
    
    return header;
  }

  /**
   * Creates the zodiac signs grid
   * @returns {HTMLElement}
   */
  createGrid() {
    const grid = document.createElement('div');
    grid.className = 'zodiac-grid';

    this.zodiacSigns.forEach(sign => {
      grid.appendChild(this.createZodiacCard(sign));
    });

    return grid;
  }

  /**
   * Creates a single zodiac card
   * @param {Object} sign - Zodiac sign data
   * @returns {HTMLElement}
   */
  createZodiacCard(sign) {
    const card = document.createElement('div');
    card.className = 'zodiac-card';

    const symbol = document.createElement('span');
    symbol.className = 'symbol';
    symbol.textContent = sign.symbol;

    const name = document.createElement('h3');
    name.textContent = sign.name;

    const dates = document.createElement('p');
    dates.className = 'dates';
    dates.textContent = sign.dates;

    const button = document.createElement('a');
    button.href = `${this.options.basePath}${sign.slug}.html`;
    button.className = 'button-primary button-gold';
    button.style.cssText = 'margin-top: 1.5rem;';
    button.textContent = 'Enter Constellation';

    card.appendChild(symbol);
    card.appendChild(name);
    card.appendChild(dates);
    card.appendChild(button);

    return card;
  }

  /**
   * Static method to create and render a grid in one call
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Optional configuration
   * @returns {ZodiacLibraryGrid} - The created ZodiacLibraryGrid instance
   */
  static create(container, options = {}) {
    const grid = new ZodiacLibraryGrid(options);
    grid.render(container);
    return grid;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZodiacLibraryGrid;
}
