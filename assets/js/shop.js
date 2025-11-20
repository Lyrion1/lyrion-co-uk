document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const filterNav = document.getElementById('filter-nav');

    // Welcome message shown on initial load and when 'All' filter is selected
    const WELCOME_MESSAGE = '<p style="text-align: center; grid-column: 1 / -1; font-family: var(--font-serif); font-size: 1.5rem; color: var(--color-gold); margin-top: 2rem; font-style: italic;">Select a Celestial Quarter to begin your journey.</p>';

    // Function to fetch and render products
    async function loadProducts() {
        try {
            const response = await fetch('./products.json');
            const products = await response.json();
            
            // Display initial welcome message instead of rendering all products
            productGrid.innerHTML = WELCOME_MESSAGE;

            // Setup filtering logic
            filterNav.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON') {
                    const filter = event.target.getAttribute('data-filter');
                    
                    // Update active button state
                    filterNav.querySelectorAll('button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    event.target.classList.add('active');

                    // Filter and render products only for specific categories
                    if (filter === 'All') {
                        // Show message when 'All' is selected instead of showing all products
                        productGrid.innerHTML = WELCOME_MESSAGE;
                    } else {
                        // Filter and render products for specific category
                        const filteredProducts = products.filter(product => {
                            return product.category === filter;
                        });
                        renderProducts(filteredProducts);
                    }
                }
            });

        } catch (error) {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: #CC0000;">The Oracle cannot find the catalogue. Please check the products.json file path.</p>';
        }
    }

    // Function to render the products to the DOM
    function renderProducts(products) {
        productGrid.innerHTML = ''; // Clear existing products
        
        if (products.length === 0) {
            productGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; font-family: var(--font-serif); margin-top: 2rem;">No items found in this celestial sphere.</p>';
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('collection-item');
            
            // IMPORTANT: The image path assumes images are in assets/products/
            // Remember to upload your product images (e.g., aries-hoodie.webp) to a folder named 'assets/products/'
            const buyLinkHtml = product.buyLink 
                ? `<a href="${product.buyLink}" class="button-primary" target="_blank" rel="noopener noreferrer">View Details & Order</a>`
                : `<button class="button-primary" disabled style="opacity: 0.5; cursor: not-allowed;">Coming Soon</button>`;
            
            productElement.innerHTML = `
                <img src="assets/products/${product.image || 'placeholder.webp'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">£${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                ${buyLinkHtml}
            `;
            productGrid.appendChild(productElement);
        });
    }

    loadProducts();
});
