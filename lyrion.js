/**
 * LYRĪON - Core Revenue Stream Logic (js/lyrion.js)
 *
 * Handles Modals, Payment Simulation, and Product Recommendations.
 */

// --- MOCK DATA SIMULATION (REPLACE WITH YOUR ACTUAL PRODUCT IDs) ---
const PRODUCT_CATALOG = {
    // Ensure the keys match the Zodiac Signs (Aries, Taurus, Gemini, etc.)
    'Aries': [{ name: "The Catalyst Blazer", type: "Apparel", price: 380, image: "blazer.jpg" }, { name: "Martian Silk Tie", type: "Accessory", price: 90, image: "tie.jpg" }],
    'Taurus': [{ name: "Venusian Silk Scarf", type: "Accessory", price: 120, image: "scarf.jpg" }],
    'Gemini': [{ name: "Celestial Shift Trousers", type: "Apparel", price: 295, image: "trousers.jpg" }],
    'Virgo': [{ name: "The Harvest Bodysuit", type: "Apparel", price: 250, image: "bodysuit.jpg" }],
    'Scorpio': [{ name: "Plutonian Leather Clutch", type: "Accessory", price: 450, image: "clutch.jpg" }]
    // ... add remaining signs
};

const ORACLE_READINGS = [
    "The cosmos suggests a moment of stillness. Your question hangs between the Moon and Jupiter, indicating that a breakthrough relies not on force, but on **patience and reflection**.",
    "A hidden transit of Venus is influencing your path. What you seek is already within reach, yet obscured by self-doubt. **Trust the inner current**.",
    "Mars illuminates your third house. Your intention is pure, but your communication may be too subtle. Speak your truth with **poetic conviction**."
];

// --- UNIVERSAL UTILITIES ---

/** Creates an elegant product card following the existing visual language. */
function createProductCard(product) {
    // This template must match the existing product card HTML structure in your shop.html
    return `
        <div class="lyrion-card product-card">
            <figure class="product-image-container">
                <img src="./assets/products/${product.image}" alt="${product.name}" class="product-img">
            </figure>
            <div class="product-details">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-type">${product.type}</p>
                <p class="product-price">£${product.price}.00</p>
                <a href="#" class="button-secondary">Explore</a>
            </div>
        </div>
    `;
}

// --- FEATURE 1: PREMIUM ORACLE READINGS (PAID MODAL) ---

function openOracleModal() {
    const modal = document.getElementById('oracle-modal');
    if (!modal) return;
    modal.classList.add('is-active');
}

function closeOracleModal() {
    const modal = document.getElementById('oracle-modal');
    if (!modal) return;
    modal.classList.remove('is-active');
    // Clear dynamic content
    document.getElementById('reading-result').innerHTML = '';
    document.getElementById('oracle-form').reset();
    document.getElementById('oracle-form').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    // Modal close listeners
    const modal = document.getElementById('oracle-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'oracle-modal' || e.target.closest('.modal-close')) {
                closeOracleModal();
            }
        });
    }

    const form = document.getElementById('oracle-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hide form and show payment element
            form.style.display = 'none';
            simulatePaymentInitialization();
        });
    }
});

function simulatePaymentInitialization() {
    const resultContainer = document.getElementById('reading-result');
    
    // LIVE STRIPE CHECKOUT LINK for the £12.00 Premium Oracle Reading
    const stripeCheckoutLink = 'https://buy.stripe.com/9B63cofOc3CP7SUaQO83C00';

    resultContainer.innerHTML = `
        <p class="celestial-note" style="text-align: center;">Awaiting your offering of £12.00...</p>
        <div class="stripe-mock-container">
            <div class="stripe-element-placeholder">
                <p class="stripe-label">Payment Processing Portal</p>
                <p class="stripe-detail">Click below to proceed to our secure checkout page for the reading.</p>
                
                <a href="${stripeCheckoutLink}" target="_blank" 
                   class="mock-pay-btn button-primary button-gold" style="display: inline-block;">
                    Securely Pay £12.00
                </a>
            </div>
        </div>
    `;

    // After they click the link and the new tab opens, we simulate the reading success after a delay.
    const checkoutLink = resultContainer.querySelector('a');
    if (checkoutLink) {
        checkoutLink.addEventListener('click', () => {
            // Give the user time to pay on the new tab, then display the reading result.
            setTimeout(simulateReadingSuccess, 5000); 
        });
    }
}

function simulateReadingSuccess() {
    const resultContainer = document.getElementById('reading-result');
    const reading = ORACLE_READINGS[Math.floor(Math.random() * ORACLE_READINGS.length)];

    resultContainer.innerHTML = `
        <div class="reading-card">
            <h3 class="card-title-celestial" style="font-size: 1.5rem; text-align: center; color: var(--color-gold);">The Oracle Speaks</h3>
            <p class="reading-text">${reading}</p>
            <p class="celestial-signature">— With intention, LYRĪON</p>
        </div>
        
        <div class="tip-section">
            <h4 class="tip-prompt" style="font-weight: normal; margin-bottom: 10px;">If the message resonated, support the House:</h4>
            <div class="tip-buttons">
                <a href="https://ko-fi.com/lyrionhouse" target="_blank" class="button-secondary">Offer a Ko-Fi</a>
                <button class="button-secondary" onclick="alert('Simulating a £5 donation via Stripe.')">£5 Gift</button>
            </div>
        </div>
        <button class="button-primary button-gold" onclick="closeOracleModal()" style="margin-top: 25px; width: 100%;">Close Insight</button>
    `;
}


// --- FEATURE 3: ZODIAC WARDROBE PERSONAL STYLING ---

function findSignSilhouette() {
    const sign = prompt("Enter your Zodiac Sign (e.g., Aries, Virgo):");
    if (!sign) return;

    const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
    const recommendations = PRODUCT_CATALOG[normalizedSign];
    const resultsContainer = document.getElementById('wardrobe-recommendations');
    
    if (!resultsContainer) {
        alert("Error: Wardrobe container not found.");
        return;
    }

    let html = `<h2 class="section-title-celestial" style="margin-top: 5rem;">Your ${normalizedSign} Silhouette</h2>
                <p class="section-subtitle">A curated edit inspired by your celestial ruling.</p>
                <div class="recommendations-grid">`;

    if (recommendations && recommendations.length > 0) {
        recommendations.forEach(product => {
            html += createProductCard(product);
        });
    } else {
        html += `<p class="no-results-note" style="margin: 3rem 0; font-style: italic;">Our curators are aligning your stars. We found no specific edit for ${normalizedSign} at this moment. Try Aries or Virgo.</p>`;
    }

    html += `</div>`;
    resultsContainer.innerHTML = html;
    
    // Smooth scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// --- FEATURE 6: BLOG MONETIZATION (Tip Simulation) ---
function supportTheHouse(articleId) {
    // Opens a Ko-Fi/donation page directly
    window.open('https://ko-fi.com/lyrionhouse', '_blank');
}

function requestPersonalizedInsight(articleId) {
    // Triggers the Oracle Modal for a personalized reading.
    openOracleModal();
}

// --- BLOG FEED - Static Data (No Network Calls) ---
// Blog feed is now handled by static data in data/blog-feed.js
// If dynamic-feed-content container exists on a page, it should import the module directly
