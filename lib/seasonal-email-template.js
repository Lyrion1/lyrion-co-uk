/**
 * LYRĪON Seasonal Email Broadcast Template
 * 
 * Creates beautiful seasonal update emails announcing new cycles
 */

const { createEmailTemplate } = require('./email');

/**
 * Get poetic introduction for each season
 * @param {string} season - Season name
 * @returns {string} Poetic paragraph
 */
function getSeasonalPoetry(season) {
  const poetry = {
    "Ascendant": `
      <p style="font-style: italic; color: #5a5856; margin-bottom: 24px;">
        The wheel turns, and spring's first light breaks through winter's veil. 
        The Ascendant Cycle has begun — a time of awakening, renewal, and blossoming intentions. 
        Like the new moon rising in darkness, we emerge into possibility. 
        The cosmos invites you to plant seeds of desire and watch them reach toward the stars.
      </p>
    `,
    "Apex": `
      <p style="font-style: italic; color: #5a5856; margin-bottom: 24px;">
        The sun reaches its zenith, and the universe pulses with radiant power. 
        The Apex Cycle has arrived — a time of full illumination, manifestation, and abundance. 
        Like the full moon in her brilliant glory, we stand in our greatest light. 
        The cosmos calls you to embrace your power and bring your visions into being.
      </p>
    `,
    "Veil": `
      <p style="font-style: italic; color: #5a5856; margin-bottom: 24px;">
        Autumn's wisdom descends like golden leaves, and the Veil Cycle begins to stir. 
        A sacred time of introspection, release, and gathering wisdom from what has been. 
        Like the waning moon retreating into shadow, we honor the harvest and prepare for rest. 
        The cosmos whispers: what must you release to make space for transformation?
      </p>
    `,
    "Return": `
      <p style="font-style: italic; color: #5a5856; margin-bottom: 24px;">
        Winter's silence falls, and the Return Cycle calls us home to the sacred void. 
        A time of deep rest, regeneration, and communion with the unseen mysteries. 
        Like the dark moon cradled in infinite space, we surrender to the necessary stillness. 
        The cosmos holds you gently: rest now, for spring will come again.
      </p>
    `
  };
  
  return poetry[season] || '';
}

/**
 * Get ritual suggestion for each season
 * @param {string} season - Season name
 * @returns {string} Ritual description
 */
function getSeasonalRitual(season) {
  const rituals = {
    "Ascendant": "Light a white or green candle at dawn. Write three intentions on paper and place them beneath a clear quartz crystal. Speak them aloud to the rising sun.",
    "Apex": "At noon, stand in sunlight and hold a citrine or sunstone. Visualize your goals manifesting with golden light. Carry this stone throughout the cycle.",
    "Veil": "At twilight, burn sage or rosemary. Write what you wish to release on autumn leaves. Offer them to the earth or running water with gratitude.",
    "Return": "Before sleep, sit in darkness with black tourmaline or obsidian. Practice deep breathing and honor your need for rest. Dream with intention."
  };
  
  return rituals[season] || '';
}

/**
 * Create a seasonal update email
 * @param {string} season - Season name ("Ascendant", "Apex", "Veil", "Return")
 * @param {Array} topProducts - Array of 3 top seasonal products
 * @returns {Object} Email details { subject, html }
 */
function seasonalUpdateEmail(season, topProducts = []) {
  const subject = `The ${season} Cycle Has Begun ✧`;
  const preheader = `The cosmic wheel turns — discover what the ${season} season brings for you`;
  
  // Build products HTML
  let productsHtml = '';
  if (topProducts && topProducts.length > 0) {
    productsHtml = `
      <h3 style="color: #C4A449; font-size: 20px; margin-top: 40px; margin-bottom: 20px;">
        This Season's Essential Offerings
      </h3>
    `;
    
    topProducts.slice(0, 3).forEach(product => {
      const productUrl = product.url || `https://lyrion.co.uk/product.html?id=${product.id}`;
      const productImage = product.image || product.images?.[0] || '';
      
      productsHtml += `
        <div style="margin-bottom: 30px; padding-bottom: 30px; border-bottom: 1px solid #f4efe8;">
          ${productImage ? `<img src="${productImage}" alt="${product.name}" style="width: 100%; max-width: 400px; height: auto; border-radius: 8px; margin-bottom: 15px;">` : ''}
          <h4 style="color: #151311; font-size: 18px; margin: 10px 0;">${product.name}</h4>
          <p style="color: #5a5856; margin: 10px 0;">${product.description || ''}</p>
          <a href="${productUrl}" class="button-gold" style="display: inline-block; padding: 12px 24px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px;">
            View Offering ✧
          </a>
        </div>
      `;
    });
  }
  
  const content = `
    <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
      ✦ The ${season} Cycle Begins ✦
    </h2>
    
    ${getSeasonalPoetry(season)}
    
    ${productsHtml}
    
    <h3 style="color: #C4A449; font-size: 20px; margin-top: 40px; margin-bottom: 20px;">
      Your ${season} Ritual
    </h3>
    <div style="background-color: #f4efe8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <p style="color: #151311; font-style: italic; line-height: 1.8; margin: 0;">
        ${getSeasonalRitual(season)}
      </p>
    </div>
    
    <div style="text-align: center; margin-top: 40px;">
      <p style="color: #5a5856; margin-bottom: 20px;">
        May this season align you with cosmic harmony.
      </p>
      <a href="https://lyrion.co.uk/shop.html" class="button-gold" style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Explore the Collection ✧
      </a>
    </div>
  `;
  
  const html = createEmailTemplate(content, preheader);
  
  return {
    subject,
    html
  };
}

module.exports = {
  seasonalUpdateEmail,
  getSeasonalPoetry,
  getSeasonalRitual
};
