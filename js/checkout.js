/**
 * LYRION Checkout Integration
 * Handles product purchases via Stripe checkout with multi-POD routing
 */

// Configuration - Update this URL after deploying the order broker worker
const WORKER_URL = 'https://lyrion-order-broker.YOURWORKER.workers.dev';

/**
 * Initiate checkout for a product by SKU
 * @param {string} sku - Product SKU from the catalog
 */
async function buy(sku) {
  if (!sku) {
    console.error('SKU is required for checkout');
    alert('Unable to start checkout. Please try again.');
    return;
  }

  // Show loading state
  const loadingMessage = showLoadingOverlay('Preparing your celestial checkout...');

  try {
    const response = await fetch(`${WORKER_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sku }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Checkout failed');
    }

    const data = await response.json();

    if (data && data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL received');
    }

  } catch (error) {
    console.error('Checkout error:', error);
    hideLoadingOverlay(loadingMessage);
    alert(`Unable to start checkout: ${error.message}. Please try again or contact support.`);
  }
}

/**
 * Show loading overlay
 */
function showLoadingOverlay(message) {
  const overlay = document.createElement('div');
  overlay.id = 'lyrion-loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(21, 19, 17, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: 'Playfair Display', serif;
  `;

  overlay.innerHTML = `
    <div style="text-align: center; color: #C4A449;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">✦</div>
      <div style="font-size: 1.5rem; font-style: italic;">${message}</div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay(overlay) {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
}

/**
 * Handle checkout success/cancellation on page load
 */
function handleCheckoutResult() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('success') === 'true') {
    showSuccessMessage();
  } else if (urlParams.get('cancelled') === 'true') {
    showCancelledMessage();
  }
}

/**
 * Show success message
 */
function showSuccessMessage() {
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(244, 239, 232, 0.95) 0%, rgba(252, 250, 250, 0.95) 100%);
    border: 2px solid #C4A449;
    padding: 2rem 3rem;
    border-radius: 12px;
    z-index: 9999;
    text-align: center;
    font-family: 'Playfair Display', serif;
    box-shadow: 0 10px 30px rgba(196, 164, 73, 0.3);
    max-width: 500px;
  `;

  message.innerHTML = `
    <div style="font-size: 2.5rem; color: #C4A449; margin-bottom: 1rem;">✦</div>
    <h3 style="font-size: 1.8rem; color: #151311; margin-bottom: 1rem;">Order Received</h3>
    <p style="font-size: 1.1rem; color: #5a5856; margin-bottom: 1.5rem; font-style: italic;">
      Your celestial order has been received. You will receive a confirmation email shortly.
    </p>
    <button onclick="this.parentElement.remove()" style="
      background: #C4A449;
      color: #151311;
      border: none;
      padding: 0.8rem 2rem;
      font-size: 1rem;
      font-family: inherit;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s ease;
    " onmouseover="this.style.background='#A38435'" onmouseout="this.style.background='#C4A449'">
      Continue
    </button>
  `;

  document.body.appendChild(message);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 10000);
}

/**
 * Show cancelled message
 */
function showCancelledMessage() {
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(244, 239, 232, 0.95);
    border: 2px solid #5a5856;
    padding: 1.5rem 2.5rem;
    border-radius: 12px;
    z-index: 9999;
    text-align: center;
    font-family: 'Playfair Display', serif;
    box-shadow: 0 8px 25px rgba(90, 88, 86, 0.2);
  `;

  message.innerHTML = `
    <p style="font-size: 1.1rem; color: #5a5856; margin: 0;">
      Checkout was cancelled. Return when you're ready.
    </p>
  `;

  document.body.appendChild(message);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', handleCheckoutResult);

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buy };
}
