/**
 * LYRION Mock Bundle Data
 * 
 * This file contains mock/seed data for testing and development.
 * Includes curated bundles of zodiac-themed products.
 */

export const MOCK_BUNDLES = [
  {
    id: "BUNDLE-CELESTIAL-SIGNATURE",
    title: "Celestial Signature Bundle",
    products: [
      "A-HOOD-ARIES",
      "H-CAND-ARIES", 
      "N-PRINT-MINI-ARIES"
    ],
    price: 145.00,
    description: "A refined set of essentials aligned with your constellation. This signature collection includes a zodiac hoodie, zodiac candle, and birth chart mini print — perfect for embracing your celestial identity.",
    image: "bundle-celestial-signature.webp",
    category: "signature"
  },
  {
    id: "BUNDLE-LUNAR-HOME",
    title: "Lunar Home Bundle",
    products: [
      "H-BLANK-MOON",
      "H-PILL-ARIES",
      "N-PRINT-WALL-ARIES"
    ],
    price: 185.00,
    description: "Soft décor that brings quiet cosmic presence into your space. Transform your home with a moon phase blanket, zodiac pillow, and birth chart wall print — creating an atmosphere of serene celestial beauty.",
    image: "bundle-lunar-home.webp",
    category: "lunar-home"
  },
  {
    id: "BUNDLE-COSMIC-SELF",
    title: "Cosmic Self Bundle",
    products: [
      "N-CHART-CUSTOM",
      "N-JOURNAL-CUSTOM"
    ],
    price: 125.00,
    description: "Your celestial blueprint transformed into personal art. This intimate collection pairs a custom birth chart print with a bespoke journal, allowing you to explore and document your cosmic journey.",
    image: "bundle-cosmic-self.webp",
    category: "cosmic-self"
  }
];

// Export individual bundles for convenience
export const CELESTIAL_SIGNATURE = MOCK_BUNDLES[0];
export const LUNAR_HOME = MOCK_BUNDLES[1];
export const COSMIC_SELF = MOCK_BUNDLES[2];

export default MOCK_BUNDLES;
