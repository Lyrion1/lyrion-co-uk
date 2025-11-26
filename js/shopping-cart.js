// Shopping cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_KEY_HERE'; // Replace with your actual key
const API_BASE = '/.netlify/functions';

// Initialize store
async function initStore() {
 updateCartCount();
 
 // If we're on a product page, load products
 if (window.location.pathname.includes('shop') || window.location.pathname.includes('collections')) {
 await loadProducts();
 }
}

// Load products from Printful via our function
async function loadProducts(category = null) {
 const productsContainer = document.getElementById('products-grid');
 
 if (!productsContainer) {
 console.log('No products grid found on this page');
 return;
 }

 // Show loading state
 productsContainer.innerHTML = '<div class="loading">Loading products...</div>';

 try {
 const response = await fetch(`${API_BASE}/get-products`);
 const data = await response.json();

 if (!data.success) {
 throw new Error(data.error);
 }

 let products = data.products;

 // Filter by category if specified
 if (category) {
 products = products.filter(p => p.category === category);
 }

 // Render products
 productsContainer.innerHTML = products.map(product => `
 <div class="product-card" data-product-id="${product.id}">
 <img src="${product.thumbnail}" alt="${product.name}" class="product-image">
 <h3 class="product-name">${product.name}</h3>
 <p class="product-price">${product.currency} £${product.price}</p>
 <button 
 class="add-to-cart-btn" 
 onclick="addToCart('${product.id}', '${product.variants[0].id}', '${product.name}', ${product.price}, '${product.thumbnail}')"
 >
 Add to Cart
 </button>
 </div>
 `).join('');

 } catch (error) {
 console.error('Error loading products:', error);
 productsContainer.innerHTML = `
 <div class="error">
 <p>Unable to load products. Please try again later.</p>
 <p style="font-size: 0.9em; color: #666;">${error.message}</p>
 </div>
 `;
 }
}

// Add item to cart
function addToCart(productId, variantId, name, price, image) {
 const item = {
 productId,
 variantId,
 name,
 price,
 image,
 quantity: 1
 };

 // Check if item already in cart
 const existingItem = cart.find(i => i.variantId === variantId);
 
 if (existingItem) {
 existingItem.quantity++;
 } else {
 cart.push(item);
 }

 saveCart();
 updateCartCount();
 showCartNotification();
}

// Remove item from cart
function removeFromCart(variantId) {
 cart = cart.filter(item => item.variantId !== variantId);
 saveCart();
 updateCartCount();
 renderCart();
}

// Update cart count in header
function updateCartCount() {
 const cartCountElements = document.querySelectorAll('.cart-count');
 const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
 
 cartCountElements.forEach(el => {
 el.textContent = totalItems;
 el.style.display = totalItems > 0 ? 'inline' : 'none';
 });
}

// Save cart to localStorage
function saveCart() {
 localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification when item added
function showCartNotification() {
 const notification = document.createElement('div');
 notification.className = 'cart-notification';
 notification.textContent = '✓ Added to cart';
 document.body.appendChild(notification);

 setTimeout(() => {
 notification.style.opacity = '0';
 setTimeout(() => notification.remove(), 300);
 }, 2000);
}

// Render cart page
function renderCart() {
 const cartContainer = document.getElementById('cart-items');
 const cartTotal = document.getElementById('cart-total');
 
 if (!cartContainer) return;

 if (cart.length === 0) {
 cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
 if (cartTotal) cartTotal.textContent = '£0.00';
 return;
 }

 const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

 cartContainer.innerHTML = cart.map(item => `
 <div class="cart-item">
 <img src="${item.image}" alt="${item.name}">
 <div class="cart-item-details">
 <h4>${item.name}</h4>
 <p>£${item.price}</p>
 <div class="quantity-controls">
 <button onclick="updateQuantity('${item.variantId}', -1)">-</button>
 <span>${item.quantity}</span>
 <button onclick="updateQuantity('${item.variantId}', 1)">+</button>
 </div>
 </div>
 <button onclick="removeFromCart('${item.variantId}')" class="remove-btn">Remove</button>
 </div>
 `).join('');

 if (cartTotal) {
 cartTotal.textContent = `£${total.toFixed(2)}`;
 }
}

// Update item quantity
function updateQuantity(variantId, change) {
 const item = cart.find(i => i.variantId === variantId);
 
 if (item) {
 item.quantity += change;
 
 if (item.quantity <= 0) {
 removeFromCart(variantId);
 } else {
 saveCart();
 renderCart();
 updateCartCount();
 }
 }
}

// Checkout with Stripe
async function checkout() {
 if (cart.length === 0) {
 alert('Your cart is empty');
 return;
 }

 const checkoutBtn = document.getElementById('checkout-btn');
 if (checkoutBtn) {
 checkoutBtn.disabled = true;
 checkoutBtn.textContent = 'Processing...';
 }

 try {
 const response = await fetch(`${API_BASE}/create-checkout`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({ items: cart })
 });

 const data = await response.json();

 if (data.error) {
 throw new Error(data.error);
 }

 // Redirect to Stripe Checkout
 window.location.href = data.url;

 } catch (error) {
 console.error('Checkout error:', error);
 alert('Checkout failed. Please try again.');
 
 if (checkoutBtn) {
 checkoutBtn.disabled = false;
 checkoutBtn.textContent = 'Checkout';
 }
 }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initStore);

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.loadProducts = loadProducts;
window.renderCart = renderCart;
