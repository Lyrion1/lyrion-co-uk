/**
 * LYRION Codex API Function
 * 
 * Serverless function to fetch and serve blog posts from
 * astronomy (NASA) and astrology feeds with in-memory caching.
 * Falls back to internal content when external APIs fail.
 */

const fetch = require('node-fetch');

// In-memory cache
let cache = {
  posts: null,
  timestamp: null
};

// Cache duration: 3 hours in milliseconds
const CACHE_DURATION = 3 * 60 * 60 * 1000;

// Valid categories
const CATEGORIES = {
  COSMIC_WEATHER: 'Cosmic Weather',
  MOON_MUSINGS: 'Moon Musings',
  SEASONAL_WISDOM: 'Seasonal Wisdom',
  CELESTIAL_STORIES: 'Celestial Stories'
};

// Fallback posts (in brand voice)
const FALLBACK_POSTS = [
  {
    slug: '2025-11-25-the-art-of-celestial-alignment',
    title: 'The Art of Celestial Alignment',
    date: '2025-11-25T10:00:00Z',
    category: CATEGORIES.COSMIC_WEATHER,
    source: 'Internal',
    summary: 'As the planets shift and dance through the heavens, we are invited to align our earthly rituals with cosmic rhythm. Discover how to read the celestial weather and dress your intentions accordingly.',
    body: 'The cosmos speaks in a language older than words—a dialect of light, shadow, and sacred geometry. To live in alignment with celestial weather is to become fluent in this ancient tongue.\n\nEach planetary transit carries its own signature, its own invitation. When Mars moves through your sign, you feel the fire rising. When Venus graces your house of creativity, beauty flows effortlessly. These are not mere coincidences but cosmic correspondences waiting to be honoured.\n\nAt LYRĪON, we believe your wardrobe can become a ritual tool. Choose garments that resonate with the current celestial energies. During a Mercury retrograde, reach for pieces that ground you—earth tones, substantial fabrics, items that feel like armour for the soul.\n\nWhen the Moon waxes full, don your most luminous silks, your pieces that catch and reflect light. You are not merely getting dressed; you are adorning yourself for ceremony.\n\nThe art of celestial alignment is not about prediction or control. It is about participation—becoming a conscious dancer in the cosmic ballet, moving with the music of the spheres rather than against it.',
    imageUrl: null
  },
  {
    slug: '2025-11-22-full-moon-rituals-for-the-modern-mystic',
    title: 'Full Moon Rituals for the Modern Mystic',
    date: '2025-11-22T14:30:00Z',
    category: CATEGORIES.MOON_MUSINGS,
    source: 'Internal',
    summary: 'The full moon illuminates what we have cultivated and what we must release. Learn to craft your own full moon ritual that honours both the light and the shadow within.',
    body: 'She rises, luminous and complete, casting silver light upon everything hidden. The full moon has called to seekers across every culture and every age, and she calls to you now.\n\nIn the old ways, the full moon was a time of celebration and release. Our ancestors gathered to honour the harvest—both of field and of soul. They knew what we are remembering: that the moon\'s fullness mirrors our own capacity for wholeness.\n\nA modern full moon ritual need not be elaborate. It needs only to be intentional. Prepare your space. Clear clutter, light a candle, place your favourite crystal on your altar. The physical act of preparation signals to your deeper self that something sacred is about to occur.\n\nWrite what you wish to release. The full moon is excellent for letting go. Write it down—the fear, the doubt, the relationship that no longer serves. Let the ink carry your intention.\n\nDress for the occasion. Wear something that makes you feel lunar—white, silver, flowing. Your garments become part of the ritual, a second skin of intention.',
    imageUrl: null
  },
  {
    slug: '2025-11-18-winter-solstice-and-the-return-of-light',
    title: 'Winter Solstice and the Return of Light',
    date: '2025-11-18T08:00:00Z',
    category: CATEGORIES.SEASONAL_WISDOM,
    source: 'Internal',
    summary: 'The longest night carries the promise of returning light. Explore the ancient wisdom of the Winter Solstice and how to honour this pivotal threshold in the celestial year.',
    body: 'In the deepest darkness, we find the seed of light. The Winter Solstice stands as the year\'s great threshold—that pivotal moment when the sun reaches its lowest arc and begins, imperceptibly at first, its return to fullness.\n\nOur ancestors marked this moment with fires and feasts, understanding what modern life often obscures: that darkness is not something to fear but a sacred space for gestation. The seed sleeps in winter soil. The dream incubates in the unconscious. The light returns because it was never truly gone—only resting.\n\nAt LYRĪON, we honour the Solstice as a time of deep intention-setting. Not the frenetic resolutions of the new calendar year, but the quiet, powerful planting that happens in stillness.\n\nCreate a Solstice altar. Gather objects that represent what you wish to call into being in the coming cycle. Place them where you will see them daily. This is not decoration; it is magic made visible.\n\nChoose your Solstice garments with intention. Deep colours—midnight blue, forest green, rich burgundy—honour the darkness. A touch of gold or silver catches the returning light.',
    imageUrl: null
  },
  {
    slug: '2025-11-15-the-mythology-of-orion',
    title: 'The Mythology of Orion: Hunter Among the Stars',
    date: '2025-11-15T16:00:00Z',
    category: CATEGORIES.CELESTIAL_STORIES,
    source: 'Internal',
    summary: 'One of winter\'s most magnificent constellations carries stories as old as human memory. Journey into the mythology of Orion and discover what this celestial hunter offers the modern seeker.',
    body: 'Look up on any clear winter night, and there he stands: Orion, the Hunter, striding across the celestial dome with his distinctive belt of three bright stars. He has been watching over humanity since we first lifted our eyes to wonder at the night sky.\n\nEvery culture has named him. To the ancient Egyptians, he was Sah, the soul of Osiris. To the Greeks, he was the great hunter who boasted he could slay any creature on Earth—a boast that earned him his place among the stars. The Lakota people saw him as a hand, reaching across the sky.\n\nThe mythology of Orion speaks to our own quest for significance. Here was a mortal so magnificent that the gods themselves could not let him fade from memory. They set him in the sky where he would inspire forever.\n\nWhat do you hunt? What constellation of meaning are you creating with the choices you make? Each decision is a star. Each intention a point of light. Together, they form a pattern that tells your story across the sky of your life.',
    imageUrl: null
  },
  {
    slug: '2025-11-10-mercury-retrograde-survival-guide',
    title: 'Mercury Retrograde: A Survival Guide for the Soul',
    date: '2025-11-10T12:00:00Z',
    category: CATEGORIES.COSMIC_WEATHER,
    source: 'Internal',
    summary: 'Three times a year, Mercury appears to reverse its cosmic course. Rather than fearing this transit, learn to work with its reflective energy for profound inner work.',
    body: 'The dreaded words spread across social media: Mercury is retrograde. Phones will fail. Contracts will crumble. Exes will text at 3 AM. The universe, apparently, is out to get us.\n\nBut this is not the whole story. Not even close.\n\nMercury retrograde is an optical illusion—the planet does not actually reverse. From our vantage point on Earth, Mercury appears to travel backward as it passes between us and the Sun. This phenomenon occurs three to four times annually, lasting about three weeks each time.\n\nRather than a cosmic curse, Mercury retrograde is an invitation to reflection. The prefix "re-" defines this period: review, reconsider, reconnect, revise. The universe is not punishing you; it is asking you to slow down.\n\nEmbrace the pause. Our culture worships constant forward motion. Mercury retrograde offers a sacred pause, a chance to look back before charging ahead. Take it.\n\nDress intentionally. During retrograde, choose grounding pieces—earthy tones, substantial fabrics, garments that make you feel centered. Your clothing becomes armour for navigating miscommunications with grace.',
    imageUrl: null
  },
  {
    slug: '2025-11-05-new-moon-manifestation-practices',
    title: 'New Moon Manifestation: Planting Seeds in Darkness',
    date: '2025-11-05T09:00:00Z',
    category: CATEGORIES.MOON_MUSINGS,
    source: 'Internal',
    summary: 'When the moon hides her face, we are given a blank canvas for intention. Discover powerful practices for setting new moon intentions that truly take root.',
    body: 'In the darkness of the new moon, we find not absence but potential. The sky appears moonless, yet she is there—invisible, gestating, waiting. This is the cosmic moment for planting seeds.\n\nUnlike the full moon, which illuminates what already exists, the new moon offers a blank slate. This is the time for new beginnings, fresh intentions, and dreams whispered into the dark.\n\nEffective new moon manifestation requires more than wishful thinking. It demands clarity, commitment, and a willingness to nurture what you plant.\n\nPrepare your soil. Before the new moon arrives, spend time clearing what no longer serves. Tidy your space. Complete lingering tasks. Create room for the new.\n\nGet specific. "I want to be happy" is too vague for the cosmos to work with. "I want to feel contentment in my daily routines by establishing a morning practice" gives the universe something concrete to support.\n\nAs the moon waxes toward fullness over the coming two weeks, take steps—however small—toward your intention. The cosmos responds to effort, not just wishes.',
    imageUrl: null
  }
];

/**
 * Create a slug from title and date
 */
function createSlug(title, date) {
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
 * Determine category based on content keywords
 */
function determineCategory(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  // Moon-related content
  if (text.includes('moon') || text.includes('lunar') || text.includes('eclipse')) {
    return CATEGORIES.MOON_MUSINGS;
  }
  
  // Transit/planetary content
  if (text.includes('transit') || text.includes('retrograde') || text.includes('mercury') || 
      text.includes('venus') || text.includes('mars') || text.includes('planetary')) {
    return CATEGORIES.COSMIC_WEATHER;
  }
  
  // Seasonal content
  if (text.includes('solstice') || text.includes('equinox') || text.includes('season') ||
      text.includes('winter') || text.includes('summer') || text.includes('spring') || text.includes('autumn')) {
    return CATEGORIES.SEASONAL_WISDOM;
  }
  
  // Space/astronomy content - default for NASA
  return CATEGORIES.CELESTIAL_STORIES;
}

/**
 * Fetch and parse NASA APOD or RSS feed
 */
async function fetchNASAFeed(url) {
  if (!url) return [];
  
  try {
    const response = await fetch(url, {
      timeout: 5000,
      headers: { 'Accept': 'application/json, text/xml, */*' }
    });
    
    if (!response.ok) {
      console.warn('NASA feed returned non-OK status:', response.status);
      return [];
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    // Handle JSON (NASA APOD API)
    if (contentType.includes('application/json')) {
      const data = await response.json();
      const items = Array.isArray(data) ? data : [data];
      
      return items.map(item => ({
        slug: createSlug(item.title || 'Untitled', item.date),
        title: item.title || 'Untitled',
        date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        category: determineCategory(item.title || '', item.explanation || ''),
        source: 'NASA',
        summary: (item.explanation || '').substring(0, 200) + '...',
        body: item.explanation || '',
        imageUrl: item.hdurl || item.url || null
      }));
    }
    
    // For RSS/XML feeds - return empty for now as we don't have xml parsing
    return [];
  } catch (error) {
    console.error('Error fetching NASA feed:', error.message);
    return [];
  }
}

/**
 * Fetch and parse astrology feed
 */
async function fetchAstroFeed(url) {
  if (!url) return [];
  
  try {
    const response = await fetch(url, {
      timeout: 5000,
      headers: { 'Accept': 'application/json, */*' }
    });
    
    if (!response.ok) {
      console.warn('Astro feed returned non-OK status:', response.status);
      return [];
    }
    
    const contentType = response.headers.get('content-type') || '';
    
    // Handle JSON
    if (contentType.includes('application/json')) {
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.items || data.articles || [data]);
      
      return items.map(item => ({
        slug: createSlug(item.title || 'Untitled', item.date || item.pubDate),
        title: item.title || 'Untitled',
        date: (item.date || item.pubDate) ? new Date(item.date || item.pubDate).toISOString() : new Date().toISOString(),
        category: determineCategory(item.title || '', item.description || item.content || ''),
        source: 'AstroFeed',
        summary: (item.description || item.summary || '').substring(0, 200) + '...',
        body: item.content || item.description || '',
        imageUrl: item.image || item.imageUrl || null
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Astro feed:', error.message);
    return [];
  }
}

/**
 * Check if cache is valid
 */
function isCacheValid() {
  if (!cache.posts || !cache.timestamp) return false;
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

/**
 * Main handler
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Return cached data if valid
    if (isCacheValid()) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ posts: cache.posts, cached: true })
      };
    }

    // Get feed URLs from environment
    const nasaFeedUrl = process.env.NASA_FEED_URL;
    const astroFeedUrl = process.env.ASTRO_FEED_URL;

    // Fetch from external sources
    const [nasaPosts, astroPosts] = await Promise.all([
      fetchNASAFeed(nasaFeedUrl),
      fetchAstroFeed(astroFeedUrl)
    ]);

    // Combine posts
    let posts = [...nasaPosts, ...astroPosts];

    // If no external posts, use fallback
    if (posts.length === 0) {
      posts = FALLBACK_POSTS;
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update cache
    cache = {
      posts: posts,
      timestamp: Date.now()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts: posts, cached: false })
    };

  } catch (error) {
    console.error('Codex API error:', error);
    
    // Return fallback posts on error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts: FALLBACK_POSTS, fallback: true })
    };
  }
};
