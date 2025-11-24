# ProductGrid Component

A reusable, responsive component for displaying product collections with elegant minimal styling.

## Features

- ✨ **Elegant Design**: Consistent with LYRION's celestial aesthetic
- 📱 **Fully Responsive**: 2 columns on mobile → 3 columns on tablet → 4 columns on desktop
- 🎨 **Minimal Styling**: Clean, focused product display with hover effects
- 🔧 **Highly Configurable**: Flexible options for customization
- ⚡ **Lightweight**: Pure JavaScript, no dependencies

## Usage

### Basic Usage

```html
<!-- Include the component -->
<script src="js/components/ProductGrid.js"></script>

<script>
  // Your product data
  const products = [
    {
      sku: "A-HOOD-ARIES",
      title: "Aries Zodiac Hoodie",
      subtitle: "Premium celestial hoodie",
      price: 110.00,
      compareAtPrice: 0,
      image: "A-HOOD-ARIES-image.webp",
      type: "apparel",
      isSale: false
    },
    // ... more products
  ];

  // Create and render the grid
  ProductGrid.create(products, {
    containerSelector: 'main',
    headerTitle: 'Our Products',
    headerSubtitle: 'Celestial apparel and ritual items'
  });
</script>
```

### Advanced Usage

```javascript
// Create instance with custom options
const grid = new ProductGrid(products, {
  containerSelector: '#my-container',
  gridClass: 'custom-grid',
  showHeader: true,
  headerTitle: 'Featured Collection',
  headerSubtitle: 'Handpicked celestial items'
});

// Render the grid
grid.render();

// Update products dynamically
const newProducts = await fetchProducts();
grid.updateProducts(newProducts);
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `containerSelector` | string | `'main'` | CSS selector for the container element |
| `gridClass` | string | `''` | Additional CSS class for the grid |
| `showHeader` | boolean | `true` | Whether to show the header section |
| `headerTitle` | string | `'Products'` | Title text for the header |
| `headerSubtitle` | string | `'Celestial apparel...'` | Subtitle text for the header |

## Product Data Structure

Each product object should have the following properties:

```javascript
{
  sku: string,           // Unique product identifier
  title: string,         // Product name
  subtitle?: string,     // Optional subtitle
  price: number,         // Current price
  compareAtPrice?: number, // Original price (for sale items)
  image: string,         // Image filename (in /assets/products/)
  type: string,          // Product type (e.g., 'apparel', 'digital')
  isSale: boolean,       // Whether product is on sale
  sign?: string,         // Optional zodiac sign
  bundleItems?: array    // Optional bundle items
}
```

## Responsive Breakpoints

- **Mobile (≤768px)**: 2 columns
- **Tablet (769px - 1200px)**: 3 columns  
- **Desktop (>1200px)**: 4 columns

## Events

The component emits a custom `product-view` event when a View button is clicked:

```javascript
document.addEventListener('product-view', (event) => {
  const product = event.detail.product;
  console.log('Product viewed:', product);
  // Handle the view action
});
```

## Integration with Checkout

If a global `buy()` function exists (from `checkout.js`), the ProductGrid will automatically use it when the View button is clicked:

```javascript
// In your checkout.js
function buy(sku) {
  // Handle purchase flow
}
```

## Styling

The component uses CSS variables defined in your theme:

```css
:root {
  --color-ink: #151311;
  --color-gold: #C4A449;
  --color-cream: #F4EFE8;
  --font-serif: 'Playfair Display', serif;
}
```

## Example

See `ProductGrid-example.html` for a complete working example.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript required
- No polyfills needed for modern environments

## License

Part of the LYRION Celestial Couture project.
