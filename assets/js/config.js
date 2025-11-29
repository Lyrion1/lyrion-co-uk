window.LYRION_SITE_BASE = window.LYRION_SITE_BASE || "https://lyrion.co.uk";
window.LYRION_API_BASE = window.LYRION_API_BASE || "https://api.lyrion.co.uk";

/* Shipping defaults for UK-only launch */
window.LYRION_SHIPPING = Object.assign({
  standardPricePence: 395, // £3.95
  estMinBusinessDays: 3,
  estMaxBusinessDays: 5,
  freeThresholdGBP: 75,
  printsShipSeparately: true
}, window.LYRION_SHIPPING || {});

/* Legal & VAT config — leave fields blank if unknown (they won't render) */
window.LYRION_LEGAL = Object.assign({
  businessName: "LYRĪON",         // public display name
  companyNumber: "",              // e.g., "12345678"
  vatNumber: "",                  // e.g., "GB123456789"
  countryCode: "GB",              // UK default
  showVatInclusiveNote: true,     // show "Prices include VAT"
  contactEmail: "hello@lyrion.co.uk"
}, window.LYRION_LEGAL || {});
