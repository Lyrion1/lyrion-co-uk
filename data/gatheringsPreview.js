/**
 * LYRION Gatherings Preview Data
 * 
 * Preview data for upcoming celestial gatherings displayed
 * on the Codex page. Links to existing gatherings pages.
 */

/**
 * GatheringPreview Type Definition
 * @typedef {Object} GatheringPreview
 * @property {string} id - Unique identifier
 * @property {string} title - Event title
 * @property {string} date - Event date (ISO 8601 format)
 * @property {string} location - Event location (city or venue)
 * @property {string} shortDescription - Brief description for preview
 * @property {string} ctaLabel - Call-to-action button text
 * @property {string} ctaHref - Call-to-action link URL
 */

/**
 * Upcoming gatherings for preview display
 */
export const GATHERINGS_PREVIEW = [
  {
    id: 'preview-001',
    title: 'Full Moon Ceremony & Sound Bath',
    date: '2025-12-15T19:00:00',
    location: 'London',
    shortDescription: 'Gather under the full moon\'s glow for an evening of lunar reverence and sound healing through crystal bowl meditation.',
    ctaLabel: 'Reserve Your Place',
    ctaHref: 'gatherings/detail.html?id=EVENT-001'
  },
  {
    id: 'preview-002',
    title: 'Winter Solstice Gathering',
    date: '2025-12-21T18:30:00',
    location: 'Brighton',
    shortDescription: 'Celebrate the longest night with community rituals, herbal tea, and intentions for the returning light.',
    ctaLabel: 'Join the Circle',
    ctaHref: 'gatherings/detail.html?id=EVENT-003'
  },
  {
    id: 'preview-003',
    title: 'New Moon Manifestation Circle',
    date: '2025-12-30T20:00:00',
    location: 'Bristol',
    shortDescription: 'Harness the potent energy of the new moon to plant seeds for the year ahead through intention-setting and ritual.',
    ctaLabel: 'Explore Event',
    ctaHref: 'gatherings/detail.html?id=EVENT-005'
  }
];

/**
 * Format gathering date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatGatheringDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-GB', options);
}

/**
 * Get upcoming gatherings (max 3)
 * @returns {GatheringPreview[]} Array of upcoming gatherings
 */
export function getUpcomingGatherings() {
  const now = new Date();
  return GATHERINGS_PREVIEW
    .filter(g => new Date(g.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
}

export default GATHERINGS_PREVIEW;
