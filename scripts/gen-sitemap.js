/* eslint-disable */
const fs = require('fs');
const path = require('path');

const SITE = process.env.SITE_BASE || 'https://lyrion.co.uk';
const today = new Date().toISOString().slice(0,10);

const routes = [
  '/', '/shop/', '/zodiac-now/', '/readings/', '/support/',
  '/product/', '/success/', '/contact/', '/returns/', '/privacy/', '/legal/'
];

const urls = routes.map(u => `  <url>
    <loc>${new URL(u, SITE).href}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === '/' ? '1.0' : '0.7'}</priority>
  </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'sitemap.xml'), xml);
console.log('✅ sitemap.xml written for', SITE);
