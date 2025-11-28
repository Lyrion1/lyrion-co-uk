(async function(){
 try {
 const fmtGBP = v => `£${v.toFixed(2)}`;
 const month = String(new Date().getMonth()+1).padStart(2,'0');
 const res = await fetch('/data/calendar-uk-2025.json');
 if (!res.ok) throw new Error('Failed to load calendar data');
 const calendar = await res.json();
 const current = calendar[month];

 // Build a small in-memory catalog from the calendar (hoodie, tee, print per sign)
 const signs = Object.values(calendar);
 const products = [];
 for (const s of signs){
 products.push(
 {
 sku:`${s.abbr}-HOOD-STD`, title:`${s.sign} Zodiac Hoodie`,
 category:"Apparel", kind:"hoodie", sign:s.sign, price:s.prices.hoodie,
 image:`/assets/img/${s.slug}-hoodie.webp`, isDigital:false
 },
 {
 sku:`${s.abbr}-TEE-STD`, title:`${s.sign} Zodiac Tee`,
 category:"Apparel", kind:"tee", sign:s.sign, price:s.prices.tee,
 image:`/assets/img/${s.slug}-tee.webp`, isDigital:false
 },
 {
 sku:`${s.abbr}-PRINT-A3`, title:`${s.sign} Art Print (A3)`,
 category:"Prints", kind:"print", sign:s.sign, price:s.prices.print,
 image:`/assets/img/${s.slug}-print.webp`, isDigital:false
 }
 );
 // Digital mini reading (shown on /readings, optional in /shop)
 products.push({
 sku:`READ-${s.abbr}-MINI`, title:`${s.sign} Mini Reading`,
 category:"Digital", kind:"reading", sign:s.sign, price:s.prices.reading,
 image:`/assets/img/${s.slug}-reading.webp`, isDigital:true
 });
 }

 // --- Home capsule rendering (index.html) ---
 const homeArea = document.querySelector('[data-home-capsule]');
 if (homeArea && current){
 const picks = [
 products.find(p=>p.sku===`${current.abbr}-HOOD-STD`),
 products.find(p=>p.sku===`${current.abbr}-TEE-STD`),
 products.find(p=>p.sku===`${current.abbr}-PRINT-A3`)
 ].filter(Boolean);

 homeArea.innerHTML = `
 <div>
 <h1>${current.sign} Capsule</h1>
 <p class="muted">Hoodie, tee, and art print for this month · Add an optional mini reading.</p>
 </div>
 <div class="grid cols-3">
 ${picks.map(cardHTML).join('')}
 </div>`;
 }

 // --- Zodiac Now page (/zodiac-now) ---
 const zodiacArea = document.querySelector('[data-zodiac-now]');
 if (zodiacArea && current){
 const picks = products.filter(p =>
 p.sku.startsWith(current.abbr) || p.sku===`READ-${current.abbr}-MINI`
 );
 zodiacArea.innerHTML = `
 <h1>${current.sign} — This Month</h1>
 <div class="grid cols-3">${picks.map(cardHTML).join('')}</div>`;
 }

 // --- Shop page (/shop) with simple filters ---
 const shopArea = document.querySelector('[data-shop-grid]');
 if (shopArea){
 const signSel = document.querySelector('[data-filter-sign]');
 const catSel = document.querySelector('[data-filter-cat]');
 function applyFilters(){
 const sVal = signSel.value; const cVal = catSel.value;
 const list = products.filter(p =>
 (sVal==='All' || p.sign===sVal) &&
 (cVal==='All' || p.category===cVal)
 );
 shopArea.innerHTML = list.map(cardHTML).join('');
 document.querySelector('[data-shop-count]').textContent = `${list.length} items`;
 }
 signSel.innerHTML = ['All',...new Set(signs.map(s=>s.sign))].map(v=>`<option>${v}</option>`).join('');
 catSel.innerHTML = ['All','Apparel','Prints','Digital'].map(v=>`<option>${v}</option>`).join('');
 signSel.addEventListener('change', applyFilters);
 catSel.addEventListener('change', applyFilters);
 applyFilters();
 }

 // --- UI card template ---
 function cardHTML(p){
 const safeTitle = p.title.replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c]));
 return `
 <a class="card" href="/product/?sku=${encodeURIComponent(p.sku)}" style="padding:16px;display:block">
 <div style="aspect-ratio:1/1;background:#0e0f15;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:12px">
 <img src="${p.image}" alt="${safeTitle}" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='Image coming soon'">
 </div>
 <h3 style="margin-bottom:6px">${safeTitle}</h3>
 <div style="display:flex;justify-content:space-between;align-items:center">
 <span>${fmtGBP(p.price)}</span>
 <span style="font-size:12px;color:#b9bcc7">${p.category}${p.isDigital?' · Digital':''}</span>
 </div>
 </a>`;
 }
 } catch (err) {
 console.error('Catalog error:', err);
 }
})();
