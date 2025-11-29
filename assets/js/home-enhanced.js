(async function(){
 // Random product per sign (fallbacks if data is sparse)
 const showcase = document.querySelector('[data-home-showcase]');
 const bundlesGrid = document.querySelector('[data-home-bundles]');
 try{
 const [pRes, bRes] = await Promise.all([
 fetch('/data/products.json'), fetch('/data/bundles.json').catch(()=>null)
 ]);
 const products = (await pRes.json())||[];
 const bundles = bRes && bRes.ok ? await bRes.json() : [];

 // helper: pick one product for each sign if available
 const signs = [...new Set(products.map(p=>p.sign).filter(Boolean))];
 const picked = [];
 for (const s of signs){
 const list = products.filter(p=>p.sign===s);
 if (list.length){
 picked.push(list[Math.floor(Math.random()*list.length)]);
 }
 }

 const card = p => `
 <article class="card" style="padding:12px;display:grid;gap:10px">
 <div class="img-square"><img src="${p.image}" alt="Photo of ${p.title}" loading="lazy" decoding="async" onerror="this.parentElement.textContent='Image coming soon'"></div>
 <h3 style="margin:0">${p.title}</h3>
 <p class="muted" style="margin:0">${p.sign || ''} ${p.type||p.kind||''}</p>
 <div style="display:flex;justify-content:space-between;align-items:center">
 <div>£${Number(p.price||0).toFixed(2)}</div>
 <a class="button" href="/product/?sku=${encodeURIComponent(p.sku)}">View</a>
 </div>
 </article>`;

 if (showcase) showcase.innerHTML = picked.slice(0,12).map(card).join('');

 // bundles/homewares
 function bundleCard(b){
 return `
 <article class="card" style="padding:12px;display:grid;gap:10px">
 <div class="img-square"><img src="${b.image||'/assets/img/placeholder.webp'}" alt="${b.title}" loading="lazy" decoding="async" onerror="this.parentElement.textContent='Image coming soon'"></div>
 <h3 style="margin:0">${b.title}</h3>
 <p class="muted" style="margin:0">${(b.items||[]).length} items</p>
 <a class="button" href="/product/?sku=${encodeURIComponent(b.bundleSku||b.sku||'')}">View</a>
 </article>`;
 }

 // Homewares: filter by tag "homeware" or type contains "home"
 const homewares = products.filter(p=>{
 const tags = (p.tags||[]).map(t=>String(t).toLowerCase());
 return tags.includes('homeware') || (p.type||'').toLowerCase().includes('home');
 }).slice(0,6);

 const homeCard = p => `
 <article class="card" style="padding:12px;display:grid;gap:10px">
 <div class="img-square"><img src="${p.image}" alt="Photo of ${p.title}" loading="lazy" decoding="async" onerror="this.parentElement.textContent='Image coming soon'"></div>
 <h3 style="margin:0">${p.title}</h3>
 <div style="display:flex;justify-content:space-between;align-items:center">
 <div>£${Number(p.price||0).toFixed(2)}</div>
 <a class="button" href="/product/?sku=${encodeURIComponent(p.sku)}">View</a>
 </div>
 </article>`;

 if (bundlesGrid){
 const bundleCards = (bundles||[]).slice(0,3).map(bundleCard).join('');
 const hwCards = homewares.map(homeCard).join('');
 bundlesGrid.innerHTML = bundleCards + hwCards;
 }
 }catch(_e){}
})();
