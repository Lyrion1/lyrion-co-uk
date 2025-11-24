/**
 * LYRION Bundle Discount Automation
 * Automatically applies "Constellation Pair Discount" when 2+ products from same sign are in cart
 */

/**
 * Calculate bundle discount for cart
 * @param {Array} cartItems - Current cart items with sign information
 * @returns {Object} Discount information {hasDiscount, amount, message, eligibleSigns}
 */
function calculateConstellationPairDiscount(cartItems) {
  if (!cartItems || cartItems.length < 2) {
    return { hasDiscount: false, amount: 0, message: '', eligibleSigns: [] };
  }
  
  // Count products per zodiac sign
  const signCounts = {};
  
  cartItems.forEach(item => {
    const sign = extractZodiacSignFromProduct(item);
    if (sign) {
      if (!signCounts[sign]) {
        signCounts[sign] = [];
      }
      signCounts[sign].push(item);
    }
  });
  
  // Check if any sign has 2 or more products
  const eligibleSigns = Object.keys(signCounts).filter(sign => signCounts[sign].length >= 2);
  
  if (eligibleSigns.length === 0) {
    return { hasDiscount: false, amount: 0, message: '', eligibleSigns: [] };
  }
  
  // Calculate discount: £5 per sign with 2+ products
  const discountAmount = eligibleSigns.length * 5.00;
  
  const message = eligibleSigns.length === 1
    ? `Your ${eligibleSigns[0]} alignment is recognised ✧`
    : `Your celestial alignment is recognised ✧`;
  
  return {
    hasDiscount: true,
    amount: discountAmount,
    message: message,
    eligibleSigns: eligibleSigns,
    details: `Constellation Pair Discount: -£${discountAmount.toFixed(2)}`
  };
}

/**
 * Extract zodiac sign from product information
 * @param {Object} item - Cart item
 * @returns {string|null} Zodiac sign name or null
 */
function extractZodiacSignFromProduct(item) {
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  // Check SKU, title, and tags
  const searchText = `${item.sku || ''} ${item.title || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
  
  for (const sign of zodiacSigns) {
    if (searchText.includes(sign.toLowerCase())) {
      return sign;
    }
  }
  
  return null;
}

/**
 * Display bundle discount message in cart
 * @param {HTMLElement} container - Container to display discount
 * @param {Object} discountInfo - Discount information from calculateConstellationPairDiscount
 */
function displayConstellationDiscountMessage(container, discountInfo) {
  if (!container || !discountInfo.hasDiscount) return;
  
  // Remove existing discount message if present
  const existingMessage = document.getElementById('constellation-discount-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new discount message
  const discountMessage = document.createElement('div');
  discountMessage.id = 'constellation-discount-message';
  discountMessage.style.cssText = `
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(196, 164, 73, 0.15) 100%);
    border: 2px solid rgba(196, 164, 73, 0.4);
    border-radius: 8px;
    text-align: center;
  `;
  
  discountMessage.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 0.5rem;">
      <span style="font-size: 1.5rem; color: #C4A449;">✧</span>
      <h4 style="font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #151311; margin: 0; font-weight: 600;">
        Constellation Pair Discount
      </h4>
      <span style="font-size: 1.5rem; color: #C4A449;">✧</span>
    </div>
    <p style="font-size: 1rem; color: #5a5856; margin: 0.5rem 0; font-style: italic;">
      ${discountInfo.message}
    </p>
    <p style="font-size: 1.2rem; color: #C4A449; font-weight: 600; margin: 0.5rem 0;">
      -£${discountInfo.amount.toFixed(2)}
    </p>
    <p style="font-size: 0.85rem; color: #8a8886; margin: 0.5rem 0;">
      ${discountInfo.eligibleSigns.length > 1 
        ? `Discounts applied for: ${discountInfo.eligibleSigns.join(', ')}` 
        : `Discount applied for ${discountInfo.eligibleSigns[0]} items`}
    </p>
  `;
  
  container.appendChild(discountMessage);
}

/**
 * Check cart for eligible discounts and display message
 * Call this function whenever cart is updated
 * @param {Array} cartItems - Current cart items
 * @param {HTMLElement} displayContainer - Container for discount message
 * @returns {Object} Discount information
 */
function checkAndDisplayConstellationDiscount(cartItems, displayContainer) {
  const discountInfo = calculateConstellationPairDiscount(cartItems);
  
  if (discountInfo.hasDiscount && displayContainer) {
    displayConstellationDiscountMessage(displayContainer, discountInfo);
  }
  
  return discountInfo;
}

/**
 * Get cart total with constellation discount applied
 * @param {Array} cartItems - Cart items with price information
 * @returns {Object} Total information {subtotal, discount, total}
 */
function calculateCartTotalWithDiscount(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + (price * quantity);
  }, 0);
  
  const discountInfo = calculateConstellationPairDiscount(cartItems);
  const discount = discountInfo.amount;
  const total = Math.max(0, subtotal - discount); // Ensure total doesn't go negative
  
  return {
    subtotal: subtotal,
    discount: discount,
    total: total,
    discountInfo: discountInfo
  };
}

/**
 * Display cart total summary with discount
 * @param {HTMLElement} container - Container for total display
 * @param {Object} totalInfo - Total information from calculateCartTotalWithDiscount
 */
function displayCartTotalWithDiscount(container, totalInfo) {
  if (!container) return;
  
  container.innerHTML = `
    <div style="padding: 1.5rem; background: white; border: 1px solid #e0ddd9; border-radius: 8px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="color: #5a5856;">Subtotal:</span>
        <span style="color: #151311; font-weight: 600;">£${totalInfo.subtotal.toFixed(2)}</span>
      </div>
      ${totalInfo.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #C4A449;">
          <span>Constellation Discount:</span>
          <span style="font-weight: 600;">-£${totalInfo.discount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div style="border-top: 2px solid #e0ddd9; margin: 1rem 0; padding-top: 1rem;">
        <div style="display: flex; justify-content: space-between;">
          <span style="font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #151311; font-weight: 600;">Total:</span>
          <span style="font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #C4A449; font-weight: 600;">£${totalInfo.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Add progress indicator showing how close user is to getting discount
 * @param {HTMLElement} container - Container for progress indicator
 * @param {Array} cartItems - Current cart items
 */
function displayDiscountProgress(container, cartItems) {
  if (!container) return;
  
  // Count items per sign
  const signCounts = {};
  cartItems.forEach(item => {
    const sign = extractZodiacSignFromProduct(item);
    if (sign) {
      signCounts[sign] = (signCounts[sign] || 0) + 1;
    }
  });
  
  // Find signs with exactly 1 item (close to discount)
  const almostThereSign = Object.keys(signCounts).find(sign => signCounts[sign] === 1);
  
  if (almostThereSign) {
    const progressMessage = document.createElement('div');
    progressMessage.style.cssText = `
      margin: 1rem 0;
      padding: 1rem;
      background: rgba(196, 164, 73, 0.05);
      border: 1px dashed rgba(196, 164, 73, 0.3);
      border-radius: 6px;
      text-align: center;
    `;
    
    progressMessage.innerHTML = `
      <p style="font-size: 0.95rem; color: #5a5856; margin: 0;">
        Add one more ${almostThereSign} item to unlock a £5 Constellation Pair Discount ✧
      </p>
    `;
    
    container.appendChild(progressMessage);
  }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateConstellationPairDiscount,
    displayConstellationDiscountMessage,
    checkAndDisplayConstellationDiscount,
    calculateCartTotalWithDiscount,
    displayCartTotalWithDiscount,
    displayDiscountProgress
  };
}
