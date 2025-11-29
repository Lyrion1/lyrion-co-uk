window.LYRION_API_BASE = window.LYRION_API_BASE || "https://api.lyrion.co.uk";

/* Shipping defaults for UK-only launch */
window.LYRION_SHIPPING = Object.assign({
  standardPricePence: 395, // £3.95
  estMinBusinessDays: 3,
  estMaxBusinessDays: 5,
  freeThresholdGBP: 75,
  printsShipSeparately: true
}, window.LYRION_SHIPPING || {});
