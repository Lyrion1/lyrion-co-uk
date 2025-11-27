/**
 * LYRION Codex Types and Utilities
 * 
 * Defines the CodexPost data structure and provides helper functions
 * for managing blog/article content from astronomy and astrology feeds.
 */

/**
 * CodexPost Type Definition
 * @typedef {Object} CodexPost
 * @property {string} slug - URL-friendly unique identifier
 * @property {string} title - Article title
 * @property {string} date - Publication date (ISO 8601 format)
 * @property {'Cosmic Weather' | 'Moon Musings' | 'Seasonal Wisdom' | 'Celestial Stories'} category - Article category
 * @property {'NASA' | 'AstroFeed' | 'Internal'} source - Content source
 * @property {string} summary - Brief article summary
 * @property {string} body - Full article content
 * @property {string} [imageUrl] - Optional image URL
 */

/**
 * Valid Codex categories
 */
export const CODEX_CATEGORIES = {
  COSMIC_WEATHER: 'Cosmic Weather',
  MOON_MUSINGS: 'Moon Musings',
  SEASONAL_WISDOM: 'Seasonal Wisdom',
  CELESTIAL_STORIES: 'Celestial Stories'
};

/**
 * Valid content sources
 */
export const CODEX_SOURCES = {
  NASA: 'NASA',
  ASTROFEED: 'AstroFeed',
  INTERNAL: 'Internal'
};

/**
 * Create a slug from a title and date
 * @param {string} title - Article title
 * @param {string} date - ISO date string
 * @returns {string} URL-friendly slug
 */
export function createSlug(title, date) {
  const datePrefix = date ? new Date(date).toISOString().split('T')[0] : '';
  const slugifiedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return datePrefix ? `${datePrefix}-${slugifiedTitle}` : slugifiedTitle;
}

/**
 * Create a CodexPost object with validation
 * @param {Object} data - Raw post data
 * @returns {CodexPost} Validated CodexPost object
 */
export function createCodexPost(data) {
  const slug = data.slug || createSlug(data.title || '', data.date || '');
  
  return {
    slug: slug,
    title: data.title || '',
    date: data.date || new Date().toISOString(),
    category: data.category || CODEX_CATEGORIES.COSMIC_WEATHER,
    source: data.source || CODEX_SOURCES.INTERNAL,
    summary: data.summary || '',
    body: data.body || '',
    imageUrl: data.imageUrl || undefined
  };
}

/**
 * Validate a CodexPost
 * @param {Object} post - Post to validate
 * @returns {boolean} Whether post is valid
 */
export function validateCodexPost(post) {
  if (!post.slug || typeof post.slug !== 'string') {
    console.error('CodexPost must have a valid slug');
    return false;
  }
  
  if (!post.title || typeof post.title !== 'string') {
    console.error('CodexPost must have a valid title');
    return false;
  }
  
  if (!post.date || typeof post.date !== 'string') {
    console.error('CodexPost must have a valid date');
    return false;
  }
  
  if (!post.category || !Object.values(CODEX_CATEGORIES).includes(post.category)) {
    console.warn(`Invalid category: ${post.category}`);
  }
  
  if (!post.source || !Object.values(CODEX_SOURCES).includes(post.source)) {
    console.warn(`Invalid source: ${post.source}`);
  }
  
  return true;
}

/**
 * Get posts by category
 * @param {CodexPost[]} posts - Array of posts
 * @param {string} category - Category to filter by
 * @returns {CodexPost[]} Filtered posts
 */
export function getPostsByCategory(posts, category) {
  if (!Array.isArray(posts) || !category || category === 'All') {
    return posts || [];
  }
  return posts.filter(post => post.category === category);
}

/**
 * Get a post by slug
 * @param {CodexPost[]} posts - Array of posts
 * @param {string} slug - Slug to find
 * @returns {CodexPost|null} Found post or null
 */
export function getPostBySlug(posts, slug) {
  if (!Array.isArray(posts) || !slug) {
    return null;
  }
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Sort posts by date (newest first)
 * @param {CodexPost[]} posts - Array of posts
 * @returns {CodexPost[]} Sorted posts
 */
export function sortPostsByDate(posts) {
  if (!Array.isArray(posts)) {
    return [];
  }
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatPostDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-GB', options);
}

// Export default object with all utilities
export default {
  CODEX_CATEGORIES,
  CODEX_SOURCES,
  createSlug,
  createCodexPost,
  validateCodexPost,
  getPostsByCategory,
  getPostBySlug,
  sortPostsByDate,
  formatPostDate
};
