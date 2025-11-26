/**
 * Script to update products.json with new role and house fields
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_PATH = path.join(__dirname, '../data/products.json');

// Read products
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

// Update each product with role and house fields
const updatedProducts = products.map(product => {
  // Determine role based on product type and category
  let role = 'apparel'; // default
  
  if (product.category === 'Digital') {
    role = 'digital';
  } else if (product.category === 'Home & Altar') {
    role = 'altar';
  } else if (product.category === 'Hats' || product.category === 'Socks' || 
             product.sku.includes('HAT') || product.sku.includes('SOCK') ||
             product.sku.includes('SCARF') || product.sku.includes('GLOVE')) {
    role = 'accessory';
  } else if (product.type === 'apparel' || product.category === 'Men' || 
             product.category === 'Women' || product.category === 'Moon Girls' || 
             product.category === 'Star Boys') {
    role = 'apparel';
  }
  
  // Determine house based on category
  let house = null;
  
  if (product.category === 'Women') {
    house = 'woman';
  } else if (product.category === 'Men') {
    house = 'man';
  } else if (product.category === 'Moon Girls') {
    house = 'girls';
  } else if (product.category === 'Star Boys') {
    house = 'boys';
  } else if (role === 'accessory') {
    // For accessories, determine house based on tone/style
    const title = product.title.toLowerCase();
    const desc = product.description.toLowerCase();
    const tags = (product.tags || []).join(' ').toLowerCase();
    const allText = `${title} ${desc} ${tags}`;
    
    if (allText.includes('pastel') || allText.includes('girls') || allText.includes('maiden')) {
      house = 'girls';
    } else if (allText.includes('dark') || allText.includes('boys') || allText.includes('starborn')) {
      house = 'boys';
    } else if (allText.includes('black') || allText.includes('gold') || allText.includes('celestial')) {
      // Black/gold = both woman & man, we'll default to 'woman' and handle multi-house later
      house = 'woman';
    } else {
      house = 'woman'; // default
    }
  }
  
  // Normalize sign field to "all" if not set or set to specific sign
  const sign = product.sign || 'all';
  
  return {
    ...product,
    role,
    house,
    sign
  };
});

// Write updated products back
fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(updatedProducts, null, 2));

console.log(`✅ Updated ${updatedProducts.length} products with role and house fields`);
console.log('\nSample updated product:');
console.log(JSON.stringify(updatedProducts[0], null, 2));
