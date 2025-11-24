#!/usr/bin/env node

/**
 * LYRION Catalog Generator
 * Converts products-master.csv into products.json and routing.json
 * Usage: node scripts/generate-catalog.js
 */

const fs = require('fs');
const path = require('path');

// File paths
const CSV_PATH = path.join(__dirname, '../data/products-master.csv');
const PRODUCTS_JSON_PATH = path.join(__dirname, '../data/products.json');
const ROUTING_JSON_PATH = path.join(__dirname, '../data/routing.json');

// Valid categories and providers
const VALID_CATEGORIES = [
  'Men', 'Women', 'Moon Girls', 'Star Boys', 
  'Home & Altar', 'Bundles', 'Digital'
];

const VALID_PROVIDERS = [
  'printful', 'printify', 'gelato', 'digital', 'manual', 'mixed'
];

const VALID_TYPES = [
  'apparel', 'kids', 'home', 'digital', 'bundle'
];

/**
 * Parse CSV to array of objects
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      console.warn(`Line ${i + 1}: Column count mismatch. Skipping.`);
      continue;
    }

    const product = {};
    headers.forEach((header, index) => {
      product[header.trim()] = values[index].trim();
    });

    products.push(product);
  }

  return products;
}

/**
 * Parse a single CSV line, handling quoted commas
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

/**
 * Validate and normalize product data
 */
function validateProduct(product, lineNumber) {
  const errors = [];

  // Required fields
  if (!product.sku) errors.push('Missing SKU');
  if (!product.title) errors.push('Missing title');
  if (!product.price) errors.push('Missing price');
  if (!product.category) errors.push('Missing category');
  if (!product.type) errors.push('Missing type');
  if (!product.provider) errors.push('Missing provider');

  // Validate category
  if (product.category && !VALID_CATEGORIES.includes(product.category)) {
    errors.push(`Invalid category: ${product.category}. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Validate provider
  if (product.provider && !VALID_PROVIDERS.includes(product.provider)) {
    errors.push(`Invalid provider: ${product.provider}. Must be one of: ${VALID_PROVIDERS.join(', ')}`);
  }

  // Validate type
  if (product.type && !VALID_TYPES.includes(product.type)) {
    errors.push(`Invalid type: ${product.type}. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  // Validate price is numeric
  if (product.price && isNaN(parseFloat(product.price))) {
    errors.push(`Invalid price: ${product.price}`);
  }

  if (errors.length > 0) {
    console.error(`Line ${lineNumber}: ${product.sku || 'Unknown'} - ${errors.join(', ')}`);
    return false;
  }

  return true;
}

/**
 * Generate products.json for front-end
 */
function generateProductsJSON(products) {
  return products.map(p => {
    const bundleItems = p.bundle_items 
      ? p.bundle_items.split(',').map(s => s.trim()).filter(s => s)
      : [];

    return {
      sku: p.sku,
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description || p.subtitle || '',
      price: parseFloat(p.price),
      compareAtPrice: parseFloat(p.compare_at_price) || 0,
      currency: p.currency || 'GBP',
      category: p.category,
      sign: p.sign || '',
      type: p.type,
      image: p.image || 'placeholder.webp',
      tags: p.tags ? p.tags.split(',').map(t => t.trim()) : [],
      bundleItems: bundleItems,
      isSale: parseFloat(p.compare_at_price) > parseFloat(p.price)
    };
  });
}

/**
 * Generate routing.json for backend order broker
 */
function generateRoutingJSON(products) {
  const routing = {};

  products.forEach(p => {
    const bundleItems = p.bundle_items 
      ? p.bundle_items.split(',').map(s => s.trim()).filter(s => s)
      : [];

    routing[p.sku] = {
      provider: p.provider,
      provider_sku: p.provider_sku || '',
      type: p.type,
      bundleItems: bundleItems,
      price: parseFloat(p.price),
      currency: p.currency || 'GBP',
      title: p.title
    };
  });

  return routing;
}

/**
 * Main execution
 */
function main() {
  console.log('🌙 LYRION Catalog Generator Starting...\n');

  // Read CSV
  console.log('📖 Reading products-master.csv...');
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ Error: ${CSV_PATH} not found`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const products = parseCSV(csvText);
  console.log(`✓ Found ${products.length} products\n`);

  // Validate products
  console.log('🔍 Validating products...');
  let validProducts = [];
  let validationErrors = 0;

  products.forEach((product, index) => {
    if (validateProduct(product, index + 2)) {
      validProducts.push(product);
    } else {
      validationErrors++;
    }
  });

  if (validationErrors > 0) {
    console.error(`\n❌ ${validationErrors} validation error(s) found. Please fix before continuing.`);
    process.exit(1);
  }

  console.log(`✓ All products valid\n`);

  // Generate products.json
  console.log('📝 Generating products.json...');
  const productsJSON = generateProductsJSON(validProducts);
  fs.writeFileSync(
    PRODUCTS_JSON_PATH,
    JSON.stringify(productsJSON, null, 2),
    'utf-8'
  );
  console.log(`✓ Created ${PRODUCTS_JSON_PATH}`);

  // Generate routing.json
  console.log('📝 Generating routing.json...');
  const routingJSON = generateRoutingJSON(validProducts);
  fs.writeFileSync(
    ROUTING_JSON_PATH,
    JSON.stringify(routingJSON, null, 2),
    'utf-8'
  );
  console.log(`✓ Created ${ROUTING_JSON_PATH}`);

  // Summary
  console.log('\n✨ Catalog generation complete!');
  console.log(`   - ${productsJSON.length} products in catalog`);
  console.log(`   - Categories: ${[...new Set(validProducts.map(p => p.category))].join(', ')}`);
  console.log(`   - Providers: ${[...new Set(validProducts.map(p => p.provider))].join(', ')}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { parseCSV, validateProduct, generateProductsJSON, generateRoutingJSON };
