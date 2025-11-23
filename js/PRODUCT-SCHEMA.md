# LYRION Product Schema & Utilities

This document describes the product data schema and utility functions for the LYRION e-commerce platform.

## Product Schema

Each product in the system follows this schema:

```javascript
{
  id: string,              // Unique product identifier (SKU)
  title: string,           // Product title
  sign?: string,           // Optional: Zodiac sign (Aries-Pisces)
  category: string,        // Product category
  price: number,           // Product price in GBP
  images: string[],        // Array of image URLs/paths
  description: string,     // Product description
  attributes: {
    color?: string,        // Product color
    size?: string,         // Available sizes
    material?: string,     // Material composition
    embroidery?: boolean   // Whether product has embroidery
  },
  madeIn: string,          // Country of origin (default: "England")
  provider: string         // Print provider
}
```

## Valid Values

### Zodiac Signs
- Aries, Taurus, Gemini, Cancer, Leo, Virgo
- Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

### Categories
- `zodiac-wardrobe` - Celestial apparel
- `cosmic-home` - Homeware and ritual pieces
- `natal-atelier` - Custom bespoke designs
- `youth` - Youth collections (Moon Girls, Star Boys)
- `digital` - Digital readings and guides

### Providers
- `inkthreadable` (default)
- `printify`
- `gelato`
- `printful`
- `digital`

## Usage

### 1. Import the Module

```javascript
import {
  createProduct,
  filterBySign,
  filterByCategory,
  ZODIAC_SIGNS,
  CATEGORIES
} from './js/product-schema.js';
```

### 2. Load and Transform Products

```javascript
async function loadProducts() {
  const response = await fetch('/data/products.json');
  const rawProducts = await response.json();
  
  // Transform to schema if needed
  const products = rawProducts.map(p => createProduct(p));
  
  return products;
}
```

### 3. Filter Products by Sign

```javascript
const ariesProducts = filterBySign(products, 'Aries');
```

### 4. Filter Products by Category

```javascript
const wardrobeProducts = filterByCategory(products, 'zodiac-wardrobe');
```

### 5. Filter by Both Sign and Category

```javascript
const ariesWardrobe = filterBySignAndCategory(products, 'Aries', 'zodiac-wardrobe');
```

## Available Helper Functions

### Filtering Functions

- `filterBySign(products, sign)` - Filter by zodiac sign
- `filterByCategory(products, category)` - Filter by category
- `filterBySignAndCategory(products, sign, category)` - Filter by both
- `filterByProvider(products, provider)` - Filter by provider
- `filterByPriceRange(products, minPrice, maxPrice)` - Filter by price range

### Utility Functions

- `getUniqueSigns(products)` - Get all unique zodiac signs from products
- `getUniqueCategories(products)` - Get all unique categories
- `searchProducts(products, keyword)` - Search products by keyword

### Sorting Functions

- `sortByPrice(products, order)` - Sort by price ('asc' or 'desc')
- `sortByTitle(products, order)` - Sort by title ('asc' or 'desc')

### Validation

- `validateProduct(product)` - Validate a product against the schema
- `createProduct(data)` - Create a validated product from raw data

## Example: Complete Product Filtering

```javascript
import { 
  filterByCategory, 
  filterBySign, 
  filterByPriceRange,
  sortByPrice 
} from './js/product-schema.js';

async function getAffordableAriesWardrobe() {
  const response = await fetch('/data/products.json');
  let products = await response.json();
  
  // Apply multiple filters
  products = filterByCategory(products, 'zodiac-wardrobe');
  products = filterBySign(products, 'Aries');
  products = filterByPriceRange(products, 0, 75);
  products = sortByPrice(products, 'asc');
  
  return products;
}
```

## Integration with Existing Code

The schema is designed to work with the existing `data/products.json` structure. The `createProduct()` function handles transformation from the current format:

```javascript
// Current format (from products.json)
{
  "sku": "A-HOOD-ARIES",
  "title": "Aries Zodiac Hoodie",
  "price": 110,
  "category": "Men",
  "sign": "Aries",
  "image": "A-HOOD-ARIES-image.webp",
  "provider": "printful"
}

// Transforms to schema format
{
  "id": "A-HOOD-ARIES",
  "title": "Aries Zodiac Hoodie",
  "price": 110,
  "category": "zodiac-wardrobe",
  "sign": "Aries",
  "images": ["A-HOOD-ARIES-image.webp"],
  "provider": "printful",
  "madeIn": "England",
  "attributes": { ... }
}
```

## Category Mapping

The schema includes smart category mapping to handle legacy categories:

- `'apparel'`, `'men'`, `'women'` → `'zodiac-wardrobe'`
- `'home'`, `'altar'`, `'homeware'` → `'cosmic-home'`
- `'kids'`, `'moon girls'`, `'star boys'`, `'children'` → `'youth'`
- `'custom'`, `'bespoke'`, `'natal'` → `'natal-atelier'`
- `'digital'`, `'readings'`, `'guides'` → `'digital'`

## TypeScript Support

While this is a JavaScript module, JSDoc comments provide type hints for TypeScript and IDE autocomplete:

```javascript
/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * ...
 */
```

## Files

- `js/product-schema.js` - Main schema and utility functions
- `js/product-schema-examples.js` - Usage examples and patterns
- `js/PRODUCT-SCHEMA.md` - This documentation

## Notes

- All prices are in GBP
- Default `madeIn` is "England"
- Default `provider` is "inkthreadable"
- Images array supports multiple product photos
- The schema validates products but doesn't enforce strict typing at runtime
