/**
 * LYRION Mock Event Data
 * 
 * This file contains mock/seed data for testing and development.
 * Includes workshops, gatherings, and celestial circles.
 */

export const MOCK_EVENTS = [
  {
    id: "EVENT-001",
    title: "Full Moon Ceremony & Sound Bath",
    date: "2025-12-15T19:00:00",
    venueName: "The Celestial Sanctuary",
    venueAddress: "42 Lunar Lane, London SW1A 1AA",
    description: "Join us for an evening of lunar reverence and sound healing. We'll gather under the full moon's glow to honor the cycles of nature and align with celestial rhythms through crystal bowl meditation and guided visualization.",
    image: "event-full-moon-ceremony.webp",
    ticketUrl: "https://example.com/tickets/full-moon-ceremony",
    category: "circle",
    featured: true,
    createdBy: "celestial-sanctuary"
  },
  {
    id: "EVENT-002",
    title: "Birth Chart Reading Workshop",
    date: "2025-12-08T14:00:00",
    venueName: "Cosmic Corner Studio",
    venueAddress: "17 Star Street, Manchester M1 1AE",
    description: "Learn to read your natal chart in this comprehensive workshop. We'll explore planetary placements, aspects, houses, and how to interpret the cosmic blueprint of your soul. Perfect for beginners and intermediate students alike.",
    image: "event-birth-chart-workshop.webp",
    ticketUrl: "https://example.com/tickets/birth-chart-workshop",
    category: "workshop",
    featured: true,
    createdBy: "cosmic-corner"
  },
  {
    id: "EVENT-003",
    title: "Winter Solstice Gathering",
    date: "2025-12-21T18:30:00",
    venueName: "The Astral Garden",
    venueAddress: "88 Constellation Court, Brighton BN1 1AA",
    description: "Celebrate the longest night of the year with a community gathering centered on rebirth and renewal. We'll share seasonal rituals, herbal tea, and set intentions for the returning light. Bring an item to place on our communal altar.",
    image: "event-winter-solstice.webp",
    ticketUrl: "https://example.com/tickets/winter-solstice",
    category: "gathering",
    featured: false,
    createdBy: "astral-garden"
  },
  {
    id: "EVENT-004",
    title: "Tarot & Astrology Fusion",
    date: "2025-12-12T19:30:00",
    venueName: "The Mystic Parlour",
    venueAddress: "23 Oracle Way, Edinburgh EH1 2NG",
    description: "Discover the profound connections between tarot archetypes and astrological symbolism. This workshop bridges two ancient wisdom traditions, revealing how the cards mirror planetary energies and zodiacal themes.",
    image: "event-tarot-astrology.webp",
    ticketUrl: "https://example.com/tickets/tarot-astrology",
    category: "workshop",
    featured: false,
    createdBy: "mystic-parlour"
  },
  {
    id: "EVENT-005",
    title: "New Moon Manifestation Circle",
    date: "2025-12-30T20:00:00",
    venueName: "The Moon Temple",
    venueAddress: "5 Crescent Drive, Bristol BS1 5TL",
    description: "Harness the potent energy of the new moon to plant seeds for the year ahead. We'll work with intention-setting, visualization, and ritual to call in your deepest desires. All experience levels welcome.",
    image: "event-new-moon-circle.webp",
    ticketUrl: "https://example.com/tickets/new-moon-circle",
    category: "circle",
    featured: true,
    createdBy: "moon-temple"
  },
  {
    id: "EVENT-006",
    title: "Astrology for Self-Discovery",
    date: "2026-01-18T10:00:00",
    venueName: "Starlight Academy",
    venueAddress: "101 Galaxy Road, Oxford OX1 1AA",
    description: "A full-day immersive workshop exploring astrology as a tool for personal growth and self-awareness. We'll dive deep into your chart, identifying patterns, strengths, and areas for evolution. Limited to 12 participants for intimate learning.",
    image: "event-astrology-discovery.webp",
    ticketUrl: "https://example.com/tickets/astrology-discovery",
    category: "workshop",
    featured: false,
    createdBy: "starlight-academy"
  }
];

// Export individual events for convenience
export const FULL_MOON_CEREMONY = MOCK_EVENTS[0];
export const BIRTH_CHART_WORKSHOP = MOCK_EVENTS[1];
export const WINTER_SOLSTICE = MOCK_EVENTS[2];

export default MOCK_EVENTS;
