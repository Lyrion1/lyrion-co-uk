// Serverless function to retrieve products from the store
// This function fetches product data for the shop

exports.handler = async (event, context) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse query parameters for filtering
        const { category, id } = event.queryStringParameters || {};

        // Sample product data - in production, this would come from a database or CMS
        const products = [
            {
                id: 'celestial-woman-hoodie',
                name: 'Celestial Woman Hoodie',
                price: 65.00,
                category: 'Woman',
                description: 'Elegant silhouette woven with cosmic intention',
                image: '/assets/img/products/celestial-woman-hoodie.jpg'
            },
            {
                id: 'celestial-man-hoodie',
                name: 'Celestial Man Hoodie',
                price: 65.00,
                category: 'Man',
                description: 'Refined design embodying strength and cosmic alignment',
                image: '/assets/img/products/celestial-man-hoodie.jpg'
            },
            {
                id: 'moon-girls-tee',
                name: 'Moon Girls Tee',
                price: 35.00,
                category: 'MoonGirls',
                description: 'Enchanting apparel for young spirits guided by lunar light',
                image: '/assets/img/products/moon-girls-tee.jpg'
            },
            {
                id: 'star-boys-tee',
                name: 'Star Boys Tee',
                price: 35.00,
                category: 'StarBoys',
                description: 'Bold celestial pieces for the young adventurer',
                image: '/assets/img/products/star-boys-tee.jpg'
            },
            {
                id: 'altar-cloth',
                name: 'Celestial Altar Cloth',
                price: 45.00,
                category: 'HomeArt',
                description: 'Transform your sacred space with celestial homeware',
                image: '/assets/img/products/altar-cloth.jpg'
            },
            {
                id: 'digital-oracle-reading',
                name: 'Digital Oracle Reading',
                price: 25.00,
                category: 'Digital',
                description: 'Personalized birth chart reading delivered digitally',
                image: '/assets/img/products/oracle-reading.jpg'
            }
        ];

        let filteredProducts = products;

        // Filter by category if provided
        if (category) {
            filteredProducts = products.filter(
                p => p.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by specific ID if provided
        if (id) {
            filteredProducts = products.filter(p => p.id === id);
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                products: filteredProducts,
                total: filteredProducts.length
            })
        };

    } catch (error) {
        console.error('Get Products Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve products' })
        };
    }
};
