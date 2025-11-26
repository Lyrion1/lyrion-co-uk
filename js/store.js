/**
 * LYRĪON Store Module
 * Handles all store automation including product display, cart management,
 * and checkout integration
 */

const LyrionStore = (function() {
    'use strict';

    // Store state
    const state = {
        products: [],
        cart: [],
        loading: false,
        error: null
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
        console.log('Initializing LYRĪON Store...');
        
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
     * Load products from the API
     */
    async function loadProducts(category = null) {
        state.loading = true;
        state.error = null;

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
            console.error('Error loading products:', error);
            state.error = error.message;
        } finally {
            state.loading = false;
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
            showNotification('Checkout is not configured. Please contact support.');
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
                    productData: {
                        id: firstItemId,
                        name: cartItems,
                        price: cartTotal
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Checkout failed');
            }

            const { sessionId } = await response.json();

            // Redirect to Stripe Checkout
            if (window.Stripe) {
                const stripe = window.Stripe(STRIPE_KEY);
                await stripe.redirectToCheckout({ sessionId });
            } else {
                throw new Error('Stripe library not loaded');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            showNotification('Checkout failed. Please try again.');
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
        // Checkout button
        document.querySelectorAll('.checkout-button').forEach(btn => {
            btn.addEventListener('click', checkout);
        });

        // Category filters
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                loadProducts(category);
            });
        });
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
