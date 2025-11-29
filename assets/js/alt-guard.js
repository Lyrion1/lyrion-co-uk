(function(){
// Any <img> with class "decorative" will keep empty alt=""
// Any <img data-alt="..."> will use that text
function makeAltFromFilename(src){
try{
const base = (src||'').split('/').pop().split('?')[0];
// Remove file extension (case-insensitive, handles .jpg, .jpeg, .png, .webp, etc.)
const name = base.replace(/\.[a-zA-Z0-9]+$/,'').replace(/[-_]+/g,' ').trim();
return name ? name.charAt(0).toUpperCase()+name.slice(1) : 'Image';
}catch(_e){ return 'Image'; }
}
function nearestHeadingText(el){
let p = el;
// Traverse up to 4 levels to find a heading - covers most card/product layouts
// (image -> container -> card -> section with heading)
for (let i=0; i<4 && p; i++, p=p.parentElement){
const h = p.querySelector('h1,h2,h3');
if (h && h.textContent) return h.textContent.trim();
}
return '';
}
const imgs = document.images;
for (const im of imgs){
// Skip if explicitly set
if (im.hasAttribute('alt')) continue;

// Decorative forced empty
if (im.classList.contains('decorative') || im.getAttribute('aria-hidden')==='true'){
im.setAttribute('alt','');
continue;
}

// Prefer explicit data-alt
const dataAlt = im.getAttribute('data-alt');
if (dataAlt){ im.setAttribute('alt', dataAlt); continue; }

// Use nearby heading (good for product cards/PDP)
const head = nearestHeadingText(im);
if (head){ im.setAttribute('alt', head); continue; }

// Fallback to filename-based alt
im.setAttribute('alt', makeAltFromFilename(im.currentSrc || im.src));
}
})();
