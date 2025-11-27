/**
 * LYRION Codex Fallback Content
 * 
 * This file contains fallback content for the Codex blog when
 * external APIs (NASA, AstroFeed) are unavailable. Written in
 * the LYRĪON brand voice: mystical, luxurious, intentional.
 */

/**
 * Helper to create slug (inlined to avoid circular dependency)
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
 * Fallback CodexPost array
 * Used when external feeds fail to load or return empty results
 */
export const CODEX_FALLBACK_POSTS = [
  {
    slug: createSlug('The Art of Celestial Alignment', '2025-11-25'),
    title: 'The Art of Celestial Alignment',
    date: '2025-11-25T10:00:00Z',
    category: 'Cosmic Weather',
    source: 'Internal',
    summary: 'As the planets shift and dance through the heavens, we are invited to align our earthly rituals with cosmic rhythm. Discover how to read the celestial weather and dress your intentions accordingly.',
    body: `The cosmos speaks in a language older than words—a dialect of light, shadow, and sacred geometry. To live in alignment with celestial weather is to become fluent in this ancient tongue.

Each planetary transit carries its own signature, its own invitation. When Mars moves through your sign, you feel the fire rising. When Venus graces your house of creativity, beauty flows effortlessly. These are not mere coincidences but cosmic correspondences waiting to be honoured.

At LYRĪON, we believe your wardrobe can become a ritual tool. Choose garments that resonate with the current celestial energies. During a Mercury retrograde, reach for pieces that ground you—earth tones, substantial fabrics, items that feel like armour for the soul.

When the Moon waxes full, don your most luminous silks, your pieces that catch and reflect light. You are not merely getting dressed; you are adorning yourself for ceremony.

The art of celestial alignment is not about prediction or control. It is about participation—becoming a conscious dancer in the cosmic ballet, moving with the music of the spheres rather than against it.

Begin simply: note the current lunar phase. Observe how you feel. Choose one garment that honours that feeling. This is the first step toward living in sacred rhythm with the universe that holds you.`,
    imageUrl: 'assets/img/oracle-hero.png'
  },
  {
    slug: createSlug('Full Moon Rituals for the Modern Mystic', '2025-11-22'),
    title: 'Full Moon Rituals for the Modern Mystic',
    date: '2025-11-22T14:30:00Z',
    category: 'Moon Musings',
    source: 'Internal',
    summary: 'The full moon illuminates what we have cultivated and what we must release. Learn to craft your own full moon ritual that honours both the light and the shadow within.',
    body: `She rises, luminous and complete, casting silver light upon everything hidden. The full moon has called to seekers across every culture and every age, and she calls to you now.

In the old ways, the full moon was a time of celebration and release. Our ancestors gathered to honour the harvest—both of field and of soul. They knew what we are remembering: that the moon's fullness mirrors our own capacity for wholeness.

A modern full moon ritual need not be elaborate. It needs only to be intentional. Here is a simple framework:

Prepare your space. Clear clutter, light a candle, place your favourite crystal on your altar. The physical act of preparation signals to your deeper self that something sacred is about to occur.

Write what you wish to release. The full moon is excellent for letting go. Write it down—the fear, the doubt, the relationship that no longer serves. Let the ink carry your intention.

Speak your gratitude aloud. The moon does not need to hear you, but you need to hear yourself. Name what has grown in your life, what has bloomed since the last new moon planted its seeds.

Release the paper to fire or earth. Burn it safely or bury it in the garden. This is not theatre; it is alchemy. You are physically transforming what you wish to release.

Dress for the occasion. Wear something that makes you feel lunar—white, silver, flowing. Your garments become part of the ritual, a second skin of intention.

Close with stillness. Sit in the moonlight if you can, or simply imagine her silver rays touching your crown. You are part of this cosmic dance. You always have been.`
  },
  {
    slug: createSlug('Winter Solstice and the Return of Light', '2025-11-18'),
    title: 'Winter Solstice and the Return of Light',
    date: '2025-11-18T08:00:00Z',
    category: 'Seasonal Wisdom',
    source: 'Internal',
    summary: 'The longest night carries the promise of returning light. Explore the ancient wisdom of the Winter Solstice and how to honour this pivotal threshold in the celestial year.',
    body: `In the deepest darkness, we find the seed of light. The Winter Solstice stands as the year's great threshold—that pivotal moment when the sun reaches its lowest arc and begins, imperceptibly at first, its return to fullness.

Our ancestors marked this moment with fires and feasts, understanding what modern life often obscures: that darkness is not something to fear but a sacred space for gestation. The seed sleeps in winter soil. The dream incubates in the unconscious. The light returns because it was never truly gone—only resting.

At LYRĪON, we honour the Solstice as a time of deep intention-setting. Not the frenetic resolutions of the new calendar year, but the quiet, powerful planting that happens in stillness.

Consider these practices:

Create a Solstice altar. Gather objects that represent what you wish to call into being in the coming cycle. Place them where you will see them daily. This is not decoration; it is magic made visible.

Write a letter to your future self. Seal it and date it for the Summer Solstice, when the light will reach its zenith. What do you hope to have cultivated by then? What seeds are you planting now?

Embrace the darkness before you celebrate the light. The longest night invites us into introspection. Before lighting your Solstice candles, sit in the darkness. Let it speak to you of rest, of potential, of the womb-space from which all creation emerges.

Choose your Solstice garments with intention. Deep colours—midnight blue, forest green, rich burgundy—honour the darkness. A touch of gold or silver catches the returning light. You are dressing for ceremony, even if the only witness is you.

The Solstice reminds us that every ending contains a beginning, every death a rebirth. We are part of this eternal cycle. Let your celebration reflect that knowing.`,
    imageUrl: 'assets/img/blog-hero.jpg'
  },
  {
    slug: createSlug('The Mythology of Orion', '2025-11-15'),
    title: 'The Mythology of Orion: Hunter Among the Stars',
    date: '2025-11-15T16:00:00Z',
    category: 'Celestial Stories',
    source: 'Internal',
    summary: 'One of winter\'s most magnificent constellations carries stories as old as human memory. Journey into the mythology of Orion and discover what this celestial hunter offers the modern seeker.',
    body: `Look up on any clear winter night, and there he stands: Orion, the Hunter, striding across the celestial dome with his distinctive belt of three bright stars. He has been watching over humanity since we first lifted our eyes to wonder at the night sky.

Every culture has named him. To the ancient Egyptians, he was Sah, the soul of Osiris. To the Greeks, he was the great hunter who boasted he could slay any creature on Earth—a boast that earned him his place among the stars. The Lakota people saw him as a hand, reaching across the sky.

What draws us to this constellation, generation after generation? Perhaps it is his reliability—he returns each winter, faithful as the cold. Perhaps it is his brilliance—the red supergiant Betelgeuse marking his shoulder, the blue-white Rigel at his foot, each a sun vastly larger than our own.

Or perhaps it is the invitation he extends: to become hunters ourselves. Not of beasts, but of meaning. Not of prey, but of purpose.

The mythology of Orion speaks to our own quest for significance. Here was a mortal so magnificent that the gods themselves could not let him fade from memory. They set him in the sky where he would inspire forever.

What do you hunt? What constellation of meaning are you creating with the choices you make? Each decision is a star. Each intention a point of light. Together, they form a pattern that tells your story across the sky of your life.

This winter, take time to find Orion. Stand beneath him and feel the cold air on your face. You are connected to every human who has ever gazed upward at the same stars, asked the same questions, felt the same wonder.

The cosmos is not distant. It is intimate. And Orion reminds us that even the most ordinary among us can become eternal.`
  },
  {
    slug: createSlug('Mercury Retrograde Survival Guide', '2025-11-10'),
    title: 'Mercury Retrograde: A Survival Guide for the Soul',
    date: '2025-11-10T12:00:00Z',
    category: 'Cosmic Weather',
    source: 'Internal',
    summary: 'Three times a year, Mercury appears to reverse its cosmic course. Rather than fearing this transit, learn to work with its reflective energy for profound inner work.',
    body: `The dreaded words spread across social media: Mercury is retrograde. Phones will fail. Contracts will crumble. Exes will text at 3 AM. The universe, apparently, is out to get us.

But this is not the whole story. Not even close.

Mercury retrograde is an optical illusion—the planet does not actually reverse. From our vantage point on Earth, Mercury appears to travel backward as it passes between us and the Sun. This phenomenon occurs three to four times annually, lasting about three weeks each time.

Rather than a cosmic curse, Mercury retrograde is an invitation to reflection. The prefix "re-" defines this period: review, reconsider, reconnect, revise. The universe is not punishing you; it is asking you to slow down.

Here is how to work with retrograde energy rather than against it:

Embrace the pause. Our culture worships constant forward motion. Mercury retrograde offers a sacred pause, a chance to look back before charging ahead. Take it.

Review before you sign. This is practical wisdom that serves you always, not just during retrograde. Read the fine print. Consider the commitment. There is wisdom in deliberation.

Back up your technology. Not because Mercury controls your hard drive, but because preparation is always sensible. Use this as a reminder to care for your tools.

Reconnect with your past. Those exes texting at 3 AM? They are simply responding to the same reflective energy you feel. You need not respond, but you can use their appearance as a prompt to consider what patterns you are ready to release.

Dress intentionally. During retrograde, choose grounding pieces—earthy tones, substantial fabrics, garments that make you feel centered. Your clothing becomes armour for navigating miscommunications with grace.

The cosmos is not your enemy. Mercury retrograde is a rhythm, a breath, a necessary pause in the eternal dance. Learn to dance with it, and you will find that even apparent setbacks contain hidden gifts.`
  },
  {
    slug: createSlug('New Moon Manifestation Practices', '2025-11-05'),
    title: 'New Moon Manifestation: Planting Seeds in Darkness',
    date: '2025-11-05T09:00:00Z',
    category: 'Moon Musings',
    source: 'Internal',
    summary: 'When the moon hides her face, we are given a blank canvas for intention. Discover powerful practices for setting new moon intentions that truly take root.',
    body: `In the darkness of the new moon, we find not absence but potential. The sky appears moonless, yet she is there—invisible, gestating, waiting. This is the cosmic moment for planting seeds.

Unlike the full moon, which illuminates what already exists, the new moon offers a blank slate. This is the time for new beginnings, fresh intentions, and dreams whispered into the dark.

Effective new moon manifestation requires more than wishful thinking. It demands clarity, commitment, and a willingness to nurture what you plant. Here is a framework:

Prepare your soil. Before the new moon arrives, spend time clearing what no longer serves. Tidy your space. Complete lingering tasks. Create room for the new.

Get specific. "I want to be happy" is too vague for the cosmos to work with. "I want to feel contentment in my daily routines by establishing a morning practice" gives the universe something concrete to support.

Write it down. The act of writing transforms thought into form. This is the first step of manifestation—bringing the invisible into the visible realm. Use beautiful paper. Choose words with care.

Speak your intention aloud. Your voice carries power. The vibration of spoken intention ripples out into the cosmos. Speak to the darkness as you would to a trusted confidant.

Create a symbolic action. Plant an actual seed. Light a candle. Choose a piece of jewelry to wear for the lunar month as a reminder of your intention. Physical actions anchor ethereal desires.

Trust the darkness. The seed does not push through soil immediately. It rests, gathers strength, waits for the right moment. Your intention does the same. Practice patience.

As the moon waxes toward fullness over the coming two weeks, take steps—however small—toward your intention. The cosmos responds to effort, not just wishes.

New moon manifestation is not magic in the fairy-tale sense. It is the magic of focused attention, aligned action, and trust in timing greater than your own. In the darkness, plant well.`
  }
];

/**
 * Get all fallback posts
 * @returns {CodexPost[]} Array of fallback posts
 */
export function getFallbackPosts() {
  return [...CODEX_FALLBACK_POSTS];
}

export default CODEX_FALLBACK_POSTS;
