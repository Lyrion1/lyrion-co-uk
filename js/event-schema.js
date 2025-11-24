/**
 * LYRION Event Schema & Utilities
 * 
 * Defines the event data structure and provides helper functions
 * for managing gatherings, workshops, and celestial circles.
 */

/**
 * Event Schema Definition
 * @typedef {Object} Event
 * @property {string} id - Unique event identifier
 * @property {string} title - Event title
 * @property {string} date - Event date (ISO 8601 format)
 * @property {string} venueName - Name of the venue
 * @property {string} venueAddress - Physical address of the venue
 * @property {string} description - Event description
 * @property {string} [image] - Optional event image URL/path
 * @property {string} [ticketUrl] - URL for ticket purchase
 * @property {string} category - Event category (workshop, gathering, circle)
 * @property {boolean} featured - Whether the event is featured
 * @property {string} createdBy - Venue/organizer identifier
 */

/**
 * Valid event categories
 */
export const EVENT_CATEGORIES = {
  WORKSHOP: 'workshop',
  GATHERING: 'gathering',
  CIRCLE: 'circle'
};

/**
 * Create an event object with schema validation
 * @param {Object} data - Raw event data
 * @returns {Event} Validated event object
 */
export function createEvent(data) {
  return {
    id: data.id || '',
    title: data.title || '',
    date: data.date || '',
    venueName: data.venueName || '',
    venueAddress: data.venueAddress || '',
    description: data.description || '',
    image: data.image || null,
    ticketUrl: data.ticketUrl || null,
    category: data.category || 'gathering',
    featured: data.featured || false,
    createdBy: data.createdBy || ''
  };
}

/**
 * Validate event against schema
 * @param {Object} event - Event to validate
 * @returns {boolean} Whether event is valid
 */
export function validateEvent(event) {
  if (!event.id || typeof event.id !== 'string') {
    console.error('Event must have a valid id');
    return false;
  }
  
  if (!event.title || typeof event.title !== 'string') {
    console.error('Event must have a valid title');
    return false;
  }
  
  if (!event.date || typeof event.date !== 'string') {
    console.error('Event must have a valid date');
    return false;
  }
  
  if (!event.venueName || typeof event.venueName !== 'string') {
    console.error('Event must have a valid venue name');
    return false;
  }
  
  if (event.category && !Object.values(EVENT_CATEGORIES).includes(event.category)) {
    console.warn(`Invalid event category: ${event.category}`);
  }
  
  return true;
}

/**
 * Get all events
 * @param {Event[]} events - Array of all events
 * @returns {Event[]} All events
 */
export function getAllEvents(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events;
}

/**
 * Get featured events
 * @param {Event[]} events - Array of all events
 * @returns {Event[]} Featured events only
 */
export function getFeaturedEvents(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events.filter(event => event.featured === true);
}

/**
 * Get events by category
 * @param {Event[]} events - Array of all events
 * @param {string} category - Category to filter by
 * @returns {Event[]} Filtered events
 */
export function getEventsByCategory(events, category) {
  if (!Array.isArray(events) || !category) {
    return events || [];
  }
  
  const normalizedCategory = category.toLowerCase();
  
  return events.filter(event => 
    event.category && event.category.toLowerCase() === normalizedCategory
  );
}

/**
 * Get event by ID
 * @param {Event[]} events - Array of events
 * @param {string} id - Event ID to find
 * @returns {Event|null} Found event or null
 */
export function getEventById(events, id) {
  if (!id || !Array.isArray(events)) {
    return null;
  }
  
  return events.find(event => event.id === id) || null;
}

/**
 * Get upcoming events (events after current date)
 * @param {Event[]} events - Array of events
 * @returns {Event[]} Future events sorted by date
 */
export function getUpcomingEvents(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  
  const now = new Date();
  
  return events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get past events (events before current date)
 * @param {Event[]} events - Array of events
 * @returns {Event[]} Past events sorted by date (most recent first)
 */
export function getPastEvents(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  
  const now = new Date();
  
  return events
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Format event date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatEventDate(dateString) {
  const date = new Date(dateString);
  
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-GB', options);
}

/**
 * Get events by venue
 * @param {Event[]} events - Array of events
 * @param {string} venueId - Venue ID to filter by
 * @returns {Event[]} Events for this venue
 */
export function getEventsByVenue(events, venueId) {
  if (!Array.isArray(events) || !venueId) {
    return [];
  }
  
  return events.filter(event => event.createdBy === venueId);
}

// Export default object with all utilities
export default {
  EVENT_CATEGORIES,
  createEvent,
  validateEvent,
  getAllEvents,
  getFeaturedEvents,
  getEventsByCategory,
  getEventById,
  getUpcomingEvents,
  getPastEvents,
  formatEventDate,
  getEventsByVenue
};
