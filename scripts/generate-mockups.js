#!/usr/bin/env node

/**
 * Generate elegant storefront mockups for LYRĪON accessories and digital products
 * Outputs: SVG, PNG (1500x1500), WebP (1500x1500, quality 90)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Theme tokens
const THEME = {
  CREAM: '#FAF7F1',
  GOLD: '#C9A86A',
  INK: '#1E1E21',
  DEEP: '#151823',
  MUTED: '#5C5F6A'
};

// Product definitions
const PRODUCTS = {
  // Accessories (handmade/in-house)
  'accessory-solstice-chain': {
    name: 'Solstice Chain',
    type: 'accessory',
    icon: 'chain'
  },
  'accessory-celestial-bookmark': {
    name: 'Celestial Bookmark',
    type: 'accessory',
    icon: 'bookmark'
  },
  'accessory-blessing-ribbon': {
    name: 'Blessing Ribbon',
    type: 'accessory',
    icon: 'ribbon'
  },
  'accessory-velvet-pouch': {
    name: 'Velvet Pouch',
    type: 'accessory',
    icon: 'pouch'
  },
  'accessory-wax-seal-kit': {
    name: 'Wax Seal Kit',
    type: 'accessory',
    icon: 'seal'
  },
  
  // Digital products
  'digital-ritual-kit-solstice': {
    name: 'Ritual Kit: Solstice',
    type: 'digital',
    icon: 'sun'
  },
  'digital-ritual-kit-equinox': {
    name: 'Ritual Kit: Equinox',
    type: 'digital',
    icon: 'balance'
  },
  'digital-zodiac-wallpapers-pack': {
    name: 'Zodiac Wallpapers Pack',
    type: 'digital',
    icon: 'stars'
  },
  'digital-meditation-new-moon': {
    name: 'Meditation: New Moon',
    type: 'digital',
    icon: 'new-moon'
  },
  'digital-meditation-full-moon': {
    name: 'Meditation: Full Moon',
    type: 'digital',
    icon: 'full-moon'
  },
  'digital-meditation-trio': {
    name: 'Meditation Trio',
    type: 'digital',
    icon: 'triple-moon'
  },
  'digital-oracle-mini-deck': {
    name: 'Oracle Mini Deck',
    type: 'digital',
    icon: 'cards'
  },
  'digital-affirmations-monthly': {
    name: 'Monthly Affirmations',
    type: 'digital',
    icon: 'scroll'
  }
};

/**
 * Generate SVG mockup for a product
 */
function generateSVG(slug, product) {
  const { name, type, icon } = product;
  
  // Generate icon SVG based on type
  let iconSVG = '';
  
  switch(icon) {
    case 'chain':
      iconSVG = `
        <circle cx="750" cy="680" r="60" fill="none" stroke="${THEME.GOLD}" stroke-width="4"/>
        <circle cx="750" cy="800" r="60" fill="none" stroke="${THEME.GOLD}" stroke-width="4"/>
        <line x1="750" y1="740" x2="750" y2="740" stroke="${THEME.GOLD}" stroke-width="4"/>
        <path d="M 700 750 Q 750 770 800 750" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <path d="M 700 730 Q 750 710 800 730" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
      `;
      break;
    case 'bookmark':
      iconSVG = `
        <rect x="680" y="620" width="140" height="240" fill="${THEME.GOLD}" opacity="0.3" rx="4"/>
        <path d="M 685 625 L 685 855 L 750 800 L 815 855 L 815 625 Z" fill="none" stroke="${THEME.GOLD}" stroke-width="4"/>
        <line x1="705" y1="660" x2="785" y2="660" stroke="${THEME.GOLD}" stroke-width="2" opacity="0.6"/>
        <line x1="705" y1="690" x2="785" y2="690" stroke="${THEME.GOLD}" stroke-width="2" opacity="0.6"/>
      `;
      break;
    case 'ribbon':
      iconSVG = `
        <path d="M 650 700 Q 750 650 850 700 Q 750 750 650 700" fill="${THEME.GOLD}" opacity="0.3"/>
        <path d="M 650 700 Q 750 650 850 700" fill="none" stroke="${THEME.GOLD}" stroke-width="4"/>
        <path d="M 650 700 Q 750 750 850 700" fill="none" stroke="${THEME.GOLD}" stroke-width="4"/>
        <line x1="650" y1="700" x2="630" y2="850" stroke="${THEME.GOLD}" stroke-width="3"/>
        <line x1="850" y1="700" x2="870" y2="850" stroke="${THEME.GOLD}" stroke-width="3"/>
      `;
      break;
    case 'pouch':
      iconSVG = `
        <ellipse cx="750" cy="800" rx="100" ry="80" fill="${THEME.GOLD}" opacity="0.3"/>
        <path d="M 650 750 Q 650 850 750 900 Q 850 850 850 750" fill="none" stroke="${THEME.GOLD}" stroke-width="4"/>
        <line x1="680" y1="750" x2="820" y2="750" stroke="${THEME.GOLD}" stroke-width="3"/>
        <path d="M 720 750 Q 730 730 740 750" fill="none" stroke="${THEME.GOLD}" stroke-width="2"/>
        <path d="M 760 750 Q 770 730 780 750" fill="none" stroke="${THEME.GOLD}" stroke-width="2"/>
      `;
      break;
    case 'seal':
      iconSVG = `
        <circle cx="750" cy="750" r="80" fill="${THEME.GOLD}" opacity="0.3"/>
        <circle cx="750" cy="750" r="80" fill="none" stroke="${THEME.GOLD}" stroke-width="4"/>
        <circle cx="750" cy="750" r="50" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <path d="M 750 700 L 750 800 M 700 750 L 800 750" stroke="${THEME.GOLD}" stroke-width="2"/>
        <circle cx="750" cy="750" r="12" fill="${THEME.GOLD}"/>
      `;
      break;
    case 'sun':
      iconSVG = `
        <circle cx="750" cy="750" r="60" fill="${THEME.GOLD}" opacity="0.4"/>
        <circle cx="750" cy="750" r="60" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        ${[0,45,90,135,180,225,270,315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 750 + Math.cos(rad) * 80;
          const y1 = 750 + Math.sin(rad) * 80;
          const x2 = 750 + Math.cos(rad) * 110;
          const y2 = 750 + Math.sin(rad) * 110;
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${THEME.GOLD}" stroke-width="3"/>`;
        }).join('\n')}
      `;
      break;
    case 'balance':
      iconSVG = `
        <line x1="750" y1="680" x2="750" y2="820" stroke="${THEME.GOLD}" stroke-width="3"/>
        <line x1="650" y1="700" x2="850" y2="700" stroke="${THEME.GOLD}" stroke-width="3"/>
        <path d="M 650 700 L 630 750 L 670 750 Z" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <path d="M 850 700 L 830 750 L 870 750 Z" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <circle cx="750" cy="680" r="15" fill="${THEME.GOLD}"/>
      `;
      break;
    case 'stars':
      iconSVG = `
        ${[
          {cx: 700, cy: 700, r: 6},
          {cx: 800, cy: 680, r: 8},
          {cx: 730, cy: 760, r: 5},
          {cx: 780, cy: 740, r: 7},
          {cx: 750, cy: 820, r: 6},
          {cx: 820, cy: 780, r: 5},
          {cx: 680, cy: 780, r: 4}
        ].map(star => {
          const points = [];
          for(let i = 0; i < 5; i++) {
            const angle = (i * 144 - 90) * Math.PI / 180;
            points.push(`${star.cx + Math.cos(angle) * star.r},${star.cy + Math.sin(angle) * star.r}`);
          }
          return `<polygon points="${points.join(' ')}" fill="${THEME.GOLD}" opacity="0.8"/>`;
        }).join('\n')}
      `;
      break;
    case 'new-moon':
      iconSVG = `
        <circle cx="750" cy="750" r="70" fill="${THEME.INK}" opacity="0.3"/>
        <circle cx="750" cy="750" r="70" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <circle cx="750" cy="750" r="50" fill="${THEME.INK}" opacity="0.5"/>
      `;
      break;
    case 'full-moon':
      iconSVG = `
        <circle cx="750" cy="750" r="70" fill="${THEME.GOLD}" opacity="0.4"/>
        <circle cx="750" cy="750" r="70" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <circle cx="735" cy="735" r="8" fill="${THEME.GOLD}" opacity="0.6"/>
        <circle cx="770" cy="745" r="6" fill="${THEME.GOLD}" opacity="0.6"/>
        <circle cx="745" cy="770" r="5" fill="${THEME.GOLD}" opacity="0.6"/>
      `;
      break;
    case 'triple-moon':
      iconSVG = `
        <circle cx="680" cy="750" r="40" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <circle cx="750" cy="750" r="50" fill="${THEME.GOLD}" opacity="0.4"/>
        <circle cx="750" cy="750" r="50" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <circle cx="820" cy="750" r="40" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
      `;
      break;
    case 'cards':
      iconSVG = `
        <rect x="680" y="680" width="100" height="140" fill="${THEME.GOLD}" opacity="0.2" rx="6"/>
        <rect x="690" y="690" width="100" height="140" fill="${THEME.GOLD}" opacity="0.3" rx="6"/>
        <rect x="700" y="700" width="100" height="140" fill="none" stroke="${THEME.GOLD}" stroke-width="3" rx="6"/>
        <circle cx="750" cy="770" r="25" fill="none" stroke="${THEME.GOLD}" stroke-width="2"/>
        <path d="M 750 745 L 750 795 M 725 770 L 775 770" stroke="${THEME.GOLD}" stroke-width="2"/>
      `;
      break;
    case 'scroll':
      iconSVG = `
        <rect x="670" y="680" width="160" height="140" fill="${THEME.GOLD}" opacity="0.2" rx="8"/>
        <path d="M 680 690 Q 670 750 680 810" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <path d="M 820 690 Q 830 750 820 810" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>
        <line x1="690" y1="720" x2="810" y2="720" stroke="${THEME.GOLD}" stroke-width="2" opacity="0.7"/>
        <line x1="690" y1="750" x2="810" y2="750" stroke="${THEME.GOLD}" stroke-width="2" opacity="0.7"/>
        <line x1="690" y1="780" x2="810" y2="780" stroke="${THEME.GOLD}" stroke-width="2" opacity="0.7"/>
      `;
      break;
    default:
      iconSVG = `<circle cx="750" cy="750" r="60" fill="none" stroke="${THEME.GOLD}" stroke-width="3"/>`;
  }
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1500" height="1500" viewBox="0 0 1500 1500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="20"/>
      <feOffset dx="0" dy="10" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.2"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Cream background -->
  <rect width="1500" height="1500" fill="${THEME.CREAM}"/>
  
  <!-- Decorative border -->
  <rect x="50" y="50" width="1400" height="1400" fill="none" stroke="${THEME.GOLD}" stroke-width="2" opacity="0.3"/>
  
  <!-- Product icon with shadow -->
  <g filter="url(#shadow)">
    ${iconSVG}
  </g>
  
  <!-- Product name -->
  <text x="750" y="1000" font-family="Georgia, serif" font-size="48" fill="${THEME.INK}" text-anchor="middle" font-weight="300">
    ${name}
  </text>
  
  <!-- Type indicator -->
  <text x="750" y="1060" font-family="Georgia, serif" font-size="28" fill="${THEME.MUTED}" text-anchor="middle" font-style="italic">
    ${type === 'accessory' ? 'Handcrafted Accessory' : 'Digital Product'}
  </text>
  
  <!-- LYRĪON mark -->
  <text x="750" y="1350" font-family="Georgia, serif" font-size="32" fill="${THEME.GOLD}" text-anchor="middle" letter-spacing="4">
    LYRĪON
  </text>
</svg>`;
  
  return svg;
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Generating LYRĪON storefront mockups...\n');
  
  // Create output directories
  const baseDir = path.join(__dirname, '..', 'assets', 'products', 'mockups');
  const svgDir = path.join(baseDir, 'svg');
  const pngDir = path.join(baseDir, 'png');
  const webpDir = path.join(baseDir, 'webp');
  
  [svgDir, pngDir, webpDir].forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
  
  const manifest = {};
  
  // Generate mockups for each product
  for (const [slug, product] of Object.entries(PRODUCTS)) {
    console.log(`  Generating: ${slug}...`);
    
    // Generate SVG
    const svg = generateSVG(slug, product);
    const svgPath = path.join(svgDir, `${slug}.svg`);
    fs.writeFileSync(svgPath, svg);
    
    // Convert to PNG (1500x1500)
    const pngPath = path.join(pngDir, `${slug}.png`);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(pngPath);
    
    // Convert to WebP (1500x1500, quality 90)
    const webpPath = path.join(webpDir, `${slug}.webp`);
    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(webpPath);
    
    // Add to manifest with relative paths
    manifest[slug] = {
      png: `/assets/products/mockups/png/${slug}.png`,
      webp: `/assets/products/mockups/webp/${slug}.webp`
    };
  }
  
  // Write manifest
  const manifestPath = path.join(baseDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log('\n✅ Mockup generation complete!');
  console.log(`   SVG: ${Object.keys(PRODUCTS).length} files`);
  console.log(`   PNG: ${Object.keys(PRODUCTS).length} files`);
  console.log(`   WebP: ${Object.keys(PRODUCTS).length} files`);
  console.log(`   Manifest: manifest.json\n`);
}

main().catch(err => {
  console.error('❌ Error generating mockups:', err);
  process.exit(1);
});
