const fetch = require('node-fetch');

const PRINTFUL_API_URL = 'https://api.printful.com/store/products';

exports.handler = async (event, context) => {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

  // Allow CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Validate API key is configured
  if (!PRINTFUL_API_KEY) {
    console.error('PRINTFUL_API_KEY environment variable is not set');
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        success: false,
        products: [],
        error: 'Products API not configured. Please try again later.',
        code: 'API_NOT_CONFIGURED'
      })
    };
  }

  try {
    // Fetch products from Printful
    const response = await fetch(PRINTFUL_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();

    // Safely transform Printful data into simple format
    const rawProducts = data.result || [];
    const products = rawProducts.map(product => {
      try {
        const syncVariants = product.sync_variants || [];
        const firstVariant = syncVariants[0];

        return {
          id: String(product.id || ''),
          name: product.name || 'Unnamed Product',
          thumbnail: product.thumbnail_url || '',
          price: firstVariant?.retail_price || '0.00',
          currency: firstVariant?.currency || 'GBP',
          variants: syncVariants.map(variant => ({
            id: String(variant.id || ''),
            name: variant.name || '',
            price: variant.retail_price || '0.00',
            image: variant.preview_url || product.thumbnail_url || '',
            size: variant.size || '',
            color: variant.color || ''
          })),
          category: determineCategory(product.name || '')
        };
      } catch (productError) {
        console.error('Error processing product:', productError);
        return null;
      }
    }).filter(Boolean); // Remove any null entries

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        products: products,
        count: products.length
      })
    };

  } catch (error) {
    console.error('Error fetching products:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        products: [],
        error: error.message || 'Failed to fetch products'
      })
    };
  }
};

// Helper function to categorize products
function determineCategory(productName) {
  const name = productName.toLowerCase();

  if (name.includes('candle')) return 'candles';
  if (name.includes('pillow') || name.includes('cushion')) return 'homeware';
  if (name.includes('hoodie') || name.includes('sweatshirt')) return 'warm-clothing';
  if (name.includes('t-shirt') || name.includes('tee')) return 'tees';
  if (name.includes('hat') || name.includes('cap') || name.includes('beanie')) return 'hats';
  if (name.includes('sock')) return 'socks';
  if (name.includes('pet') || name.includes('dog') || name.includes('cat')) return 'pet';

  return 'accessories';
}
