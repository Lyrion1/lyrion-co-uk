# LYRION Mock Product Data

This directory contains mock/seed data for testing and development purposes.

## Files

- `mock-products.js` - JavaScript module with 40 mock products
- `MOCK-DATA-README.md` - This documentation file

## Mock Product Inventory

### Total: 40 Products

1. **Zodiac Embroidered Hoodies** - 12 items (one per zodiac sign)
   - Premium embroidered hoodies with constellation designs
   - Categories: zodiac-wardrobe
   - Price: £95.00 each
   - All include embroidery attribute

2. **Zodiac Candles** - 12 items (one per zodiac sign)
   - Hand-poured soy wax candles with element scents
   - Categories: cosmic-home
   - Price: £28.00 each

3. **Zodiac Pillows** - 12 items (one per zodiac sign)
   - Decorative pillows with embroidered constellations
   - Categories: cosmic-home
   - Price: £35.00 each
   - All include embroidery attribute

4. **Birth Chart Print** - 1 generic item
   - Museum-quality art print
   - Categories: cosmic-home
   - Price: £45.00
   - Not sign-specific

5. **Moon Phase Blanket** - 1 generic item
   - Woven blanket with moon phases
   - Categories: cosmic-home
   - Price: £78.00
   - Not sign-specific

6. **Custom Birth Chart Hoodie** - 1 custom item
   - Bespoke personalized hoodie
   - Categories: natal-atelier
   - Price: £145.00
   - Custom embroidery

7. **Custom Birth Chart Wall Print** - 1 custom item
   - Personalized wall art
   - Categories: natal-atelier
   - Price: £85.00

## Usage

### Import as ES6 Module

```javascript
import { MOCK_PRODUCTS, getMockProductsBySign, getMockProductsByCategory } from './data/mock-products.js';

// Get all mock products
console.log(MOCK_PRODUCTS);

// Get products for a specific zodiac sign
const ariesProducts = getMockProductsBySign('Aries');
console.log(ariesProducts); // Returns hoodie, candle, and pillow for Aries

// Get products by category
const wardrobeProducts = getMockProductsByCategory('zodiac-wardrobe');
console.log(wardrobeProducts); // Returns all 12 hoodies

// Get only zodiac products (those with sign field)
const zodiacProducts = getMockZodiacProducts();
console.log(zodiacProducts); // Returns 36 products with zodiac signs

// Get generic products (no sign field)
const genericProducts = getMockGenericProducts();
console.log(genericProducts); // Returns 4 generic products
```

### Use with Product Schema

```javascript
import { MOCK_PRODUCTS } from './data/mock-products.js';
import { filterBySign, filterByCategory } from './js/product-schema.js';

// Filter mock products using schema utilities
const leoProducts = filterBySign(MOCK_PRODUCTS, 'Leo');
const homeProducts = filterByCategory(MOCK_PRODUCTS, 'cosmic-home');
```

### Node.js (CommonJS)

```javascript
// For Node.js, you may need to convert or use dynamic import
const mockProducts = require('./mock-products.js');
```

## Product Schema

Each mock product follows the schema:

```javascript
{
  id: string,              // Unique identifier (e.g., "MOCK-HOOD-EMB-ARIES")
  title: string,           // Product name
  sign: string | null,     // Zodiac sign or null for generic
  category: string,        // Product category
  price: number,           // Price in GBP
  images: string[],        // Array of placeholder image names
  description: string,     // Product description
  attributes: {
    color: string,         // Primary color
    size: string,          // Available sizes
    material: string,      // Material composition
    embroidery: boolean    // Has embroidery
  },
  madeIn: string,          // Country of origin (all "England")
  provider: string         // Print provider
}
```

## Categories Used

- `zodiac-wardrobe` - Apparel items (12 hoodies)
- `cosmic-home` - Home goods and décor (25 items: candles, pillows, prints, blanket)
- `natal-atelier` - Custom/bespoke items (2 items: custom hoodie and print)

## Zodiac Signs Covered

All 12 zodiac signs are represented in hoodies, candles, and pillows:
- Aries, Taurus, Gemini, Cancer
- Leo, Virgo, Libra, Scorpio
- Sagittarius, Capricorn, Aquarius, Pisces

## Placeholder Images

All products use placeholder image names:
- `placeholder-hoodie-{sign}.jpg`
- `placeholder-candle-{sign}.jpg`
- `placeholder-pillow-{sign}.jpg`
- `placeholder-birth-chart-print.jpg`
- `placeholder-moon-phase-blanket.jpg`
- `placeholder-custom-hoodie.jpg`
- `placeholder-custom-wall-print.jpg`

## Testing Scenarios

This mock data is designed for:

1. **Sign-based filtering** - Test filtering by all 12 zodiac signs
2. **Category filtering** - Test 3 different categories
3. **Embroidery attribute** - Mix of products with/without embroidery
4. **Generic products** - Test products without zodiac associations
5. **Custom products** - Test natal-atelier/bespoke category
6. **Price ranges** - Variety of price points (£28 - £145)

## Integration with Existing Data

This mock data complements the existing `products.json` and can be:
- Used for development/testing
- Merged with real products for demos
- Used to populate collection pages
- Used for filter/search testing

## Notes

- All products are marked "Made in England"
- Providers vary: inkthreadable, printify, gelato
- Custom items have higher prices reflecting bespoke nature
- Embroidery attribute is true for hoodies and pillows
- Generic items (sign: null) are suitable for all customers
