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

 // --- Shop page (/shop) with filters + sane defaults + "Load more" ---
 const shopArea = document.querySelector('[data-shop-grid]');
 if (shopArea){
 const signSel = document.querySelector('[data-filter-sign]');
 const catSel = document.querySelector('[data-filter-cat]');
 const countEl = document.querySelector('[data-shop-count]');
 const moreWrap = document.querySelector('[data-shop-more]');
 let limit = 12;

 // Preselect from query params (sign, cat, gender)
 const params = new URLSearchParams(location.search);
 const qpSign = params.get('sign');
 const qpCat = params.get('cat');
 const qpGender = params.get('gender'); // maps to product.category "Men"/"Women"

 // Derive categoryGroup for each product if not set
 products.forEach(p=>{
 if (!p.categoryGroup){
 const t = (p.type||p.kind||'').toLowerCase();
 p.categoryGroup = t.includes('print') ? 'Prints' : (t.includes('digital')||t.includes('reading')?'Digital':'Apparel');
 }
 });

 function render(list){
 const slice = list.slice(0, limit);
 shopArea.innerHTML = slice.map(cardHTML).join('');
 countEl.textContent = `${list.length} items`;
 if (moreWrap){
 moreWrap.classList.toggle('hidden', list.length <= limit);
 }
 // make the "Load more" work
 const btn = document.querySelector('[data-load-more]');
 if (btn){
 btn.onclick = ()=>{ limit += 12; applyFilters(); };
 }
 }

 function applyFilters(){
 const sVal = signSel ? signSel.value : 'All';
 const cVal = catSel ? catSel.value : 'All';
 const gVal = qpGender || 'All';
 const list = products.filter(p =>
 (sVal==='All' || p.sign===sVal) &&
 (cVal==='All' || p.categoryGroup===cVal || p.category===cVal) &&
 (gVal==='All' || p.category===gVal)
 );
 render(list);
 }

 // build dropdowns
 if (signSel) signSel.innerHTML = ['All',...new Set(signs.map(s=>s.sign))].map(v=>`<option value="${v}">${v}</option>`).join('');
 if (catSel) catSel.innerHTML = ['All','Apparel','Prints','Digital'].map(v=>`<option value="${v}">${v}</option>`).join('');

 // Apply query params to selectors if present
 if (signSel && qpSign && signSel.querySelector(`option[value="${qpSign}"]`)) signSel.value = qpSign;
 else if (signSel && signSel.querySelector(`option[value="${current.sign}"]`)) signSel.value = current.sign;
 if (catSel && qpCat) catSel.value = qpCat;

 if (signSel) signSel.addEventListener('change', ()=>{ limit = 12; applyFilters(); });
 if (catSel) catSel.addEventListener('change', ()=>{ limit = 12; applyFilters(); });

 // initial render
 applyFilters();
 }

 // --- UI card template ---
 function cardHTML(p){
 const safeTitle = p.title.replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c]));
 return `
 <a class="card" href="/product/?sku=${encodeURIComponent(p.sku)}" style="padding:16px;display:block">
 <div style="aspect-ratio:1/1;background:#0e0f15;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:12px">
 <img src="${p.image}" alt="Photo of ${safeTitle}" loading="lazy" decoding="async" onerror="this.style.display='none';this.parentElement.textContent='Image coming soon'">
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
