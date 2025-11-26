/**
 * LYRĪON Store Module
 * Handles all store automation including product display, cart management,
 * and checkout integration
 */

const LyrionStore = (function() {
    'use strict';

    // Prevent double initialization
    if (window._lyrionStoreInitialized) {
        return window.LyrionStore;
    }

    // Store state
    const state = {
        products: [],
        cart: [],
        loading: false,
        error: null,
        initialized: false
    };

    // API endpoints - uses /api/ prefix which redirects to /.netlify/functions/ via netlify.toml
    const API = {
        getProducts: '/.netlify/functions/get-products',
        createCheckout: '/.netlify/functions/create-checkout'
    };

    // Stripe publishable key - should be set in the HTML before loading this script
    const STRIPE_KEY = window.STRIPE_PUBLISHABLE_KEY || '';

    /**
     * Initialize the store
     */
    async function init() {
        // Prevent re-initialization
        if (state.initialized) {
            console.log('LYRĪON Store already initialized');
            return;
        }
        
        console.log('Initializing LYRĪON Store...');
        state.initialized = true;
        window._lyrionStoreInitialized = true;
        
        try {
            // Load cart from localStorage
            loadCart();
            
            // Bind event listeners
            bindEvents();
            
            // Load products if on a shop page
            if (isShopPage()) {
                await loadProducts();
            }
            
            // Update cart UI
            updateCartUI();
        } catch (error) {
            console.error('Error initializing store:', error);
            // Still mark as initialized to prevent retry loops
        }
    }

    /**
     * Check if current page is a shop page
     */
    function isShopPage() {
        return window.location.pathname.includes('shop') || 
               window.location.pathname.includes('collections') ||
               window.location.pathname.includes('products');
    }

    /**
     * Load products from the API with fallback to static data
     */
    async function loadProducts(category = null) {
        state.loading = true;
        state.error = null;
        
        // Show loading state first
        const container = document.getElementById('products-grid') || 
                         document.querySelector('.products-container');
        if (container) {
            container.innerHTML = '<p class="loading">Loading celestial offerings...</p>';
        }

        try {
            let url = API.getProducts;
            if (category) {
                url += `?category=${encodeURIComponent(category)}`;
            }

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to load products');
            }

            const data = await response.json();
            state.products = data.products || [];
            
            // Render products if container exists
            renderProducts();

        } catch (error) {
            console.error('Error loading products from API:', error);
            state.error = error.message;
            
            // Try to load static fallback data
            try {
                await loadStaticProducts(category);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                // Show user-friendly message
                renderFallbackMessage();
            }
        } finally {
            state.loading = false;
        }
    }
    
    /**
     * Load static products as fallback when API is unavailable
     */
    async function loadStaticProducts(category = null) {
        try {
            // Try to dynamically import static product data
            // Use absolute path from site root to work regardless of page context
            const module = await import('/data/products.js');
            let products = module.PRODUCTS_DATA || [];
            
            // Filter by category if specified
            if (category) {
                const categoryMap = {
                    'woman': 'Women',
                    'man': 'Men',
                    'moongirls': 'Moon Girls',
                    'starboys': 'Star Boys',
                    'homeart': 'Home & Altar',
                    'digital': 'Digital',
                    'bundles': 'Bundles',
                    'hats': 'Hats',
                    'socks': 'Socks'
                };
                const targetCategory = categoryMap[category.toLowerCase()] || category;
                products = products.filter(p => 
                    p.category && p.category.toLowerCase() === targetCategory.toLowerCase()
                );
            }
            
            // Transform to expected format
            state.products = products.map(p => ({
                id: p.sku,
                name: p.title,
                description: p.subtitle || p.description,
                price: parseFloat(p.price) || 0,
                image: p.image ? `/assets/products/${p.image}` : '/assets/img/placeholder.png',
                category: p.category
            }));
            
            state.error = null;
            state.loading = false; // Set loading to false before rendering
            renderProducts();
            console.log('Loaded static fallback products:', state.products.length);
        } catch (importError) {
            console.error('Could not load static products:', importError);
            throw importError;
        }
    }
    
    /**
     * Show a user-friendly fallback message when products can't load
     */
    function renderFallbackMessage() {
        const container = document.getElementById('products-grid') || 
                         document.querySelector('.products-container');
        if (container) {
            container.innerHTML = `
                <div class="products-fallback" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <p style="font-family: var(--font-serif); font-size: 1.3rem; color: var(--color-gold); font-style: italic; margin-bottom: 1rem;">
                        ✧ Celestial offerings are aligning... ✧
                    </p>
                    <p style="color: #666; margin-bottom: 2rem;">
                        Our products are preparing for your journey. Please refresh the page or explore our collections.
                    </p>
                    <a href="/products/collections.html" class="button-primary button-gold">View Collections</a>
                </div>
            `;
        }
    }

    /**
     * Render products to the page
     */
    function renderProducts() {
        const container = document.getElementById('products-grid') || 
                         document.querySelector('.products-container');
        
        if (!container) return;

        if (state.loading) {
            container.innerHTML = '<p class="loading">Loading products...</p>';
            return;
        }

        if (state.error) {
            container.innerHTML = `<p class="error">${state.error}</p>`;
            return;
        }

        if (state.products.length === 0) {
            container.innerHTML = '<p class="no-products">No products found.</p>';
            return;
        }

        container.innerHTML = state.products.map(product => `
            <article class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">£${product.price.toFixed(2)}</p>
                    <button class="button-primary add-to-cart" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </article>
        `).join('');

        // Bind add to cart buttons
        container.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });
    }

    /**
     * Handle add to cart click
     */
    function handleAddToCart(event) {
        const productId = event.target.dataset.productId;
        const product = state.products.find(p => p.id === productId);
        
        if (product) {
            addToCart(product);
        }
    }

    /**
     * Add product to cart
     */
    function addToCart(product) {
        const existingItem = state.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.push({
                ...product,
                quantity: 1
            });
        }

        saveCart();
        updateCartUI();
        showNotification(`${product.name} added to cart`);
    }

    /**
     * Remove product from cart
     */
    function removeFromCart(productId) {
        state.cart = state.cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    /**
     * Update cart item quantity
     */
    function updateQuantity(productId, quantity) {
        const item = state.cart.find(i => i.id === productId);
        
        if (item) {
            item.quantity = Math.max(0, quantity);
            
            if (item.quantity === 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                updateCartUI();
            }
        }
    }

    /**
     * Save cart to localStorage
     */
    function saveCart() {
        localStorage.setItem('lyrion_cart', JSON.stringify(state.cart));
    }

    /**
     * Load cart from localStorage
     */
    function loadCart() {
        const saved = localStorage.getItem('lyrion_cart');
        if (saved) {
            try {
                state.cart = JSON.parse(saved);
            } catch (e) {
                state.cart = [];
            }
        }
    }

    /**
     * Get cart total
     */
    function getCartTotal() {
        return state.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Get cart item count
     */
    function getCartCount() {
        return state.cart.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Update cart UI elements
     */
    function updateCartUI() {
        // Update cart count badge
        const countBadge = document.querySelector('.cart-count');
        if (countBadge) {
            countBadge.textContent = getCartCount();
            countBadge.style.display = getCartCount() > 0 ? 'block' : 'none';
        }

        // Update cart total
        const totalElement = document.querySelector('.cart-total');
        if (totalElement) {
            totalElement.textContent = `£${getCartTotal().toFixed(2)}`;
        }

        // Render cart items if cart container exists
        renderCartItems();
    }

    /**
     * Render cart items
     */
    function renderCartItems() {
        const container = document.querySelector('.cart-items');
        if (!container) return;

        if (state.cart.length === 0) {
            container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        container.innerHTML = state.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>£${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-minus" data-product-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-plus" data-product-id="${item.id}">+</button>
                    <button class="remove-item" data-product-id="${item.id}">×</button>
                </div>
            </div>
        `).join('');

        // Bind quantity buttons
        container.querySelectorAll('.quantity-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.productId;
                const item = state.cart.find(i => i.id === id);
                if (item) updateQuantity(id, item.quantity - 1);
            });
        });

        container.querySelectorAll('.quantity-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.productId;
                const item = state.cart.find(i => i.id === id);
                if (item) updateQuantity(id, item.quantity + 1);
            });
        });

        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCart(e.target.dataset.productId);
            });
        });
    }

    /**
     * Initiate checkout process
     */
    async function checkout() {
        if (state.cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }

        if (!STRIPE_KEY) {
            console.error('Stripe publishable key not configured');
            showNotification('Checkout is not yet configured. Please contact support.');
            return;
        }

        try {
            // Calculate total for all cart items
            const cartTotal = getCartTotal();
            const cartItems = state.cart.map(item => `${item.name} x${item.quantity}`).join(', ');
            const firstItemId = state.cart[0].id;

            const response = await fetch(API.createCheckout, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: state.cart.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        productId: item.id
                    }))
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Checkout failed');
            }

            const data = await response.json();

            // Redirect to Stripe Checkout URL if provided
            if (data.url) {
                window.location.href = data.url;
                return;
            }

            // Fallback to Stripe.js redirect
            if (data.sessionId && window.Stripe) {
                const stripe = window.Stripe(STRIPE_KEY);
                await stripe.redirectToCheckout({ sessionId: data.sessionId });
            } else if (!window.Stripe) {
                throw new Error('Stripe library not loaded');
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            showNotification('Checkout failed. Please try again or contact support.');
        }
    }

    /**
     * Show notification
     */
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'store-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Bind global event listeners
     */
    function bindEvents() {
        try {
            // Checkout button - wrap in try-catch for safety
            const checkoutButtons = document.querySelectorAll('.checkout-button');
            if (checkoutButtons && checkoutButtons.length > 0) {
                checkoutButtons.forEach(btn => {
                    if (btn) {
                        btn.addEventListener('click', checkout);
                    }
                });
            }

            // Category filters
            const categoryButtons = document.querySelectorAll('[data-category]');
            if (categoryButtons && categoryButtons.length > 0) {
                categoryButtons.forEach(btn => {
                    if (btn) {
                        btn.addEventListener('click', (e) => {
                            const category = e.target.dataset.category;
                            loadProducts(category || null);
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error binding store events:', error);
        }
    }

    /**
     * Clear the cart
     */
    function clearCart() {
        state.cart = [];
        saveCart();
        updateCartUI();
    }

    // Public API
    return {
        init,
        loadProducts,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCart: () => [...state.cart],
        getCartTotal,
        getCartCount,
        checkout,
        clearCart
    };
})();

// Expose to global scope
window.LyrionStore = LyrionStore;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LyrionStore.init());
} else {
    LyrionStore.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LyrionStore;
}
