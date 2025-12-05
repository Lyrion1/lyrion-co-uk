import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const TOKENS = {
 CREAM: "#FAF7F1",
 GOLD: "#C9A86A",
 INK: "#1E1E21",
 MUTED: "#5C5F6A",
 DEEP: "#151823",
 VELVET:"#2A2A2A",
};

const OUT = {
 svg: "assets/products/mockups/svg",
 png: "assets/products/mockups/png",
 webp: "assets/products/mockups/webp",
};

async function ensureDirs() {
 for (const d of Object.values(OUT)) await fs.mkdir(d, { recursive: true });
}

function svgWrap(body, w=1500, h=1500, bg=TOKENS.CREAM) {
 return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="background:${bg}">
 <defs>
 <style>
 .title{font-family: Georgia, serif; fill:${TOKENS.INK}; font-size:56px}
 .sub{font-family: -apple-system, Segoe UI, Roboto, sans-serif; fill:${TOKENS.MUTED}; font-size:30px}
 </style>
 </defs>
 ${body}
</svg>`;
}

function panel(x1,y1,x2,y2,r=36,fill="#FCFAF6", stroke="#E0DFDC") {
 return `
 <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
 <feDropShadow dx="0" dy="10" stdDeviation="16" flood-opacity="0.25"/>
 </filter>
 <rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3" filter="url(#shadow)"/>`;
}

/* ---------- drawing helpers (simple shapes) ---------- */
const escapeXml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const circle = (cx,cy,r,fill,stroke,sw=2)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke??'none'}" stroke-width="${sw}"/>`;
const rrect = (x1,y1,x2,y2,r,fill,stroke="#D0D0D0",sw=3)=>`<rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text = (x,y,cls,txt)=>`<text x="${x}" y="${y}" class="${cls}">${escapeXml(txt)}</text>`;
const arc = (x1,y1,x2,y2,start,end,color,w)=>`<path d="M0,0" stroke="${color}" />` + `<path d="M ${x1+(x2-x1)/2} ${y1+(y2-y1)/2}" stroke="none" />` + 
 `<svg/>`;

/* We'll keep the art minimal and consistent per item */
const items = [
 // ----- Accessories (in-house) -----
 {
 slug: "accessory-solstice-chain",
 title: "Solstice Chain",
 sub: "Fine black cord · Gold-tone charm",
 svg: () => svgWrap(`
 ${panel(220,280,1280,1220,60)}
 <path d="M360,840 A390,130 0 0 1 1140,840" stroke="${TOKENS.INK}" stroke-width="8" fill="none"/>
 ${circle(750,840,58,TOKENS.GOLD,"none")}
 ${text(540,240,"title","Solstice Chain")}
 ${text(540,300,"sub","Fine black cord · Gold-tone charm")}
 `)
 },
 {
 slug: "accessory-celestial-bookmark",
 title: "Celestial Bookmark",
 sub: "Black card · Gold crescent foil",
 svg: () => svgWrap(`
 ${rrect(520,220,980,1200,40,TOKENS.INK,"#282A30")}
 ${circle(750,540,90,TOKENS.GOLD,"none")}
 ${circle(770,540,80,TOKENS.INK,"none")}
 ${text(500,160,"title","Celestial Bookmark")}
 ${text(500,210,"sub","Black card · Gold crescent foil")}
 ${text(680,1090,"sub","LYRĪON")}
 `)
 },
 {
 slug: "accessory-blessing-ribbon",
 title: "Blessing Ribbon",
 sub: "Velvet ribbon · Gold sigil",
 svg: () => svgWrap(`
 ${rrect(200,780,1300,900,26,"#2E2E2E","#3A3A3A")}
 ${Array.from({length:10},(_,i)=>text(240+i*120,850,"sub","✧ LYRĪON ✧")).join("")}
 ${text(420,280,"title","Blessing Ribbon")}
 ${text(420,340,"sub","Velvet ribbon · Gold sigil")}
 `)
 },
 {
 slug: "accessory-velvet-pouch",
 title: "Velvet Pouch",
 sub: "Gold crest patch",
 svg: () => svgWrap(`
 ${rrect(500,380,1000,1080,70,TOKENS.VELVET,"#3A3A3A")}
 <line x1="500" y1="470" x2="1000" y2="470" stroke="#515151" stroke-width="4"/>
 ${circle(750,790,88,TOKENS.CREAM,TOKENS.GOLD,6)}
 ${text(705,795,"sub","LYRĪON")}
 ${text(480,300,"title","Velvet Pouch")}
 ${text(480,360,"sub","Gold crest patch")}
 `)
 },
 {
 slug: "accessory-wax-seal-kit",
 title: "Wax Seal Kit",
 sub: "Custom crest head · Gold wax stick",
 svg: () => svgWrap(`
 ${panel(360,620,1140,950,40)}
 ${rrect(440,740,620,800,20,"#8B5E3C","#785235",2)}
 ${circle(690,770,56,TOKENS.GOLD,"#7E673E",2)}
 ${text(650,776,"sub","LYRĪON")}
 ${rrect(760,755,1040,785,12,TOKENS.GOLD,"#B19054",2)}
 ${text(360,560,"title","Wax Seal Kit")}
 ${text(360,610,"sub","Custom crest head · Gold wax stick")}
 `)
 },

 // ----- Digital -----
 {
 slug: "digital-ritual-kit-solstice",
 title: "Solstice Ritual Kit (Digital)",
 sub: "Altar layout · Invocation · Soundtrack link",
 svg: () => svgWrap(`
 ${rrect(500,420,1000,1120,36,TOKENS.CREAM,TOKENS.INK)}
 <rect x="520" y="440" width="460" height="660" rx="28" fill="none" stroke="${TOKENS.GOLD}" stroke-width="6"/>
 ${circle(750,560,70,TOKENS.GOLD,"none")}
 ${text(520,360,"title","Solstice Ritual Kit (Digital)")}
 ${text(520,410,"sub","Altar layout · Invocation · Soundtrack link")}
 `)
 },
 {
 slug: "digital-ritual-kit-equinox",
 title: "Equinox Ritual Kit (Digital)",
 sub: "Altar layout · Invocation · Soundtrack link",
 svg: () => svgWrap(`
 ${rrect(500,420,1000,1120,36,TOKENS.CREAM,TOKENS.INK)}
 <rect x="520" y="440" width="460" height="660" rx="28" fill="none" stroke="${TOKENS.GOLD}" stroke-width="6"/>
 ${circle(750,560,70,TOKENS.GOLD,"none")}
 ${text(520,360,"title","Equinox Ritual Kit (Digital)")}
 ${text(520,410,"sub","Altar layout · Invocation · Soundtrack link")}
 `)
 },
 {
 slug: "digital-zodiac-wallpapers-pack",
 title: "Zodiac Phone Wallpapers Pack",
 sub: "Day & Night pairs · 12 signs",
 svg: () => svgWrap(`
 ${rrect(380,380,1120,1140,40,TOKENS.CREAM,"#DDDCDA")}
 ${rrect(420,420,700,1100,40,TOKENS.CREAM,TOKENS.MUTED,3)}
 ${rrect(610,450,890,1130,40,TOKENS.DEEP,TOKENS.MUTED,3)}
 ${rrect(800,420,1080,1100,40,TOKENS.CREAM,TOKENS.MUTED,3)}
 ${circle(560,760,50,TOKENS.CREAM,TOKENS.GOLD,6)}
 ${circle(750,800,50,TOKENS.CREAM,TOKENS.GOLD,6)}
 ${circle(940,740,50,TOKENS.CREAM,TOKENS.GOLD,6)}
 ${text(380,320,"title","Zodiac Phone Wallpapers Pack")}
 ${text(380,370,"sub","Day & Night pairs · 12 signs")}
 `)
 },
 {
 slug: "digital-meditation-new-moon",
 title: "New Moon Meditation (Audio)",
 sub: "Guided · 12–18 minutes · MP3",
 svg: () => svgWrap(`
 ${rrect(480,520,1020,1000,40,TOKENS.DEEP,"#474A55",3)}
 ${circle(750,760,90,TOKENS.CREAM,TOKENS.GOLD,6)}
 ${text(420,360,"title","New Moon Meditation (Audio)")}
 ${text(420,410,"sub","Guided · 12–18 minutes · MP3")}
 `)
 },
 {
 slug: "digital-meditation-full-moon",
 title: "Full Moon Meditation (Audio)",
 sub: "Guided · 12–18 minutes · MP3",
 svg: () => svgWrap(`
 ${rrect(480,520,1020,1000,40,TOKENS.DEEP,"#474A55",3)}
 ${circle(750,760,90,TOKENS.CREAM,TOKENS.GOLD,6)}
 ${text(420,360,"title","Full Moon Meditation (Audio)")}
 ${text(420,410,"sub","Guided · 12–18 minutes · MP3")}
 `)
 },
 {
 slug: "digital-meditation-trio",
 title: "Meditation Trio (Audio)",
 sub: "New Moon · Full Moon · Grounding",
 svg: () => svgWrap(`
 ${rrect(440,560,760,980,30,TOKENS.DEEP,"#474A55")}
 ${rrect(620,600,940,1020,30,TOKENS.CREAM,"#DDDCDA")}
 ${rrect(800,540,1120,960,30,TOKENS.DEEP,"#474A55")}
 ${text(380,360,"title","Meditation Trio (Audio)")}
 ${text(380,410,"sub","New Moon · Full Moon · Grounding")}
 `)
 },
 {
 slug: "digital-oracle-mini-deck",
 title: "Printable Oracle Cards (Mini)",
 sub: "12 archetypes · PDF",
 svg: () => svgWrap(`
 ${rrect(360,460,760,1080,30,TOKENS.CREAM,TOKENS.INK)}
 <rect x="380" y="480" width="360" height="580" rx="24" fill="none" stroke="${TOKENS.GOLD}" stroke-width="6"/>
 ${text(420,820,"sub","THE TWINS")}
 ${rrect(820,460,1220,1080,30,TOKENS.INK,TOKENS.INK)}
 ${circle(1020,770,70,TOKENS.CREAM,TOKENS.GOLD,6)}
 ${text(360,360,"title","Printable Oracle Cards (Mini)")}
 ${text(360,410,"sub","12 archetypes · PDF")}
 `)
 },
 {
 slug: "digital-affirmations-monthly",
 title: "Affirmations Monthly",
 sub: "PDF + Audio · Subscription £5/mo",
 svg: () => svgWrap(`
 ${rrect(500,420,1000,1120,36,TOKENS.CREAM,TOKENS.INK)}
 <rect x="520" y="440" width="460" height="660" rx="28" fill="none" stroke="${TOKENS.GOLD}" stroke-width="6"/>
 ${text(500,360,"title","Affirmations Monthly")}
 ${text(500,410,"sub","PDF + Audio · Subscription £5/mo")}
 ${text(620,720,"title","AFFIRMATIONS")}
 ${text(650,660,"sub","CELESTIAL")}
 `)
 },
];

async function renderOne({ slug, svg }) {
 const svgStr = typeof svg === "function" ? svg() : svg;
 const svgPath = path.join(OUT.svg, `${slug}.svg`);
 const pngPath = path.join(OUT.png, `${slug}.png`);
 const webpPath = path.join(OUT.webp, `${slug}.webp`);
 await fs.writeFile(svgPath, svgStr, "utf8");
 // convert with sharp; ensure background is not transparent
 await sharp(Buffer.from(svgStr))
 .resize(1500,1500, { fit: "contain", background: TOKENS.CREAM })
 .flatten({ background: TOKENS.CREAM })
 .png({ compressionLevel: 9 })
 .toFile(pngPath);
 await sharp(Buffer.from(svgStr))
 .resize(1500,1500, { fit: "contain", background: TOKENS.CREAM })
 .flatten({ background: TOKENS.CREAM })
 .webp({ quality: 90 })
 .toFile(webpPath);
 return { slug, png: pngPath, webp: webpPath, svg: svgPath };
}

async function main() {
 await ensureDirs();
 const manifest = {};
 for (const item of items) {
 const out = await renderOne(item);
 manifest[item.slug] = {
 png: `/${out.png.replace(/^assets\//,"assets/")}`,
 webp:`/${out.webp.replace(/^assets\//,"assets/")}`,
 svg: `/${out.svg.replace(/^assets\//,"assets/")}`,
 };
 }
 await fs.writeFile("assets/products/mockups/manifest.json", JSON.stringify(manifest, null, 2));
 console.log("Generated", Object.keys(manifest).length, "mockups");
}
main().catch(e=>{ console.error(e); process.exit(1); });
