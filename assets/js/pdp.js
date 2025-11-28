(async function(){
 const fmtGBP = v => `£${v.toFixed(2)}`;
 const API_BASE = (window.LYRION_API_BASE)||'';
 const qs = new URLSearchParams(location.search);
 const sku = qs.get('sku');
 const mount = document.querySelector('[data-pdp]');

 let calendar;
 try {
 const res = await fetch('/data/calendar-uk-2025.json');
 if (!res.ok) throw new Error('Failed to load calendar data');
 calendar = await res.json();
 } catch (err) {
 console.error('PDP error:', err);
 mount.innerHTML = `<div class="card" style="padding:16px"><h1>Error loading product</h1><p>Please try again later or visit the <a href="/shop">shop</a>.</p></div>`;
 return;
 }
 const signs = Object.values(calendar);

 // Build small catalog (same shape as Step 2)
 const products = [];
 for (const s of signs){
 products.push(
 { sku:`${s.abbr}-HOOD-STD`, title:`${s.sign} Zodiac Hoodie`, category:"Apparel", kind:"hoodie", sign:s.sign, price:s.prices.hoodie, image:`/assets/img/${s.slug}-hoodie.webp`, isDigital:false },
 { sku:`${s.abbr}-TEE-STD`, title:`${s.sign} Zodiac Tee`, category:"Apparel", kind:"tee", sign:s.sign, price:s.prices.tee, image:`/assets/img/${s.slug}-tee.webp`, isDigital:false },
 { sku:`${s.abbr}-PRINT-A3`, title:`${s.sign} Art Print (A3)`,category:"Prints", kind:"print", sign:s.sign, price:s.prices.print, image:`/assets/img/${s.slug}-print.webp`, isDigital:false },
 { sku:`READ-${s.abbr}-MINI`,title:`${s.sign} Mini Reading`, category:"Digital", kind:"reading",sign:s.sign, price:s.prices.reading,image:`/assets/img/${s.slug}-reading.webp`,isDigital:true }
 );
 }

 const product = products.find(p=>p.sku===sku);
 if (!product){
 mount.innerHTML = `<div class="card" style="padding:16px"><h1>Product not found</h1><p>Try the <a href="/shop">shop</a>.</p></div>`;
 return;
 }

 const rec = signs.find(s=>s.sign===product.sign);

 // Determine a single cross-sell
 let cross = null;
 if (product.kind === "hoodie" || product.kind === "tee"){
   cross = {
     sku: `${rec.abbr}-PRINT-A3`,
     title: `${product.sign} Art Print (A3)`,
     category: "Prints",
     kind: "print",
     sign: product.sign,
     price: rec.prices.print,
     image: `/assets/img/${rec.slug}-print.webp`,
     isDigital: false
   };
 } else if (product.kind === "print"){
   cross = {
     sku: `${rec.abbr}-TEE-STD`,
     title: `${product.sign} Zodiac Tee`,
     category: "Apparel",
     kind: "tee",
     sign: product.sign,
     price: rec.prices.tee,
     image: `/assets/img/${rec.slug}-tee.webp`,
     isDigital: false
   };
 }

 const isApparel = product.category==='Apparel';
 const addOnSku = `READ-${rec.abbr}-MINI`;
 const addOnPrice = rec.prices.reading;
 const freeShipThresh = 75;

 mount.innerHTML = `
 <div class="card" style="padding:16px;display:grid;gap:16px">
 <div style="display:grid;gap:16px;grid-template-columns:1fr 1fr;align-items:start">
 <div>
 <div style="aspect-ratio:1/1;background:#0e0f15;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden">
 <img src="${product.image}" alt="${product.title}" onerror="this.parentElement.textContent='Image coming soon'">
 </div>
 </div>
 <div>
 <h1>${product.title}</h1>
 <p style="color:#b9bcc7;margin-bottom:8px">${product.category}${product.isDigital?' · Digital':''} · ${product.sign}</p>
 <div style="font-size:22px;margin-bottom:12px" data-price>${fmtGBP(product.price)}</div>

 <form id="buy" style="display:grid;gap:12px">
 ${isApparel ? `
 <label>Size
 <select name="size" required>
 <option value="S">S</option><option value="M" selected>M</option>
 <option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
 </select>
 </label>` : ``}

 <label>Quantity
 <input type="number" name="qty" min="1" max="10" value="1" inputmode="numeric">
 </label>

 ${isApparel ? `
 <label style="display:flex;gap:8px;align-items:center">
 <input type="checkbox" name="addon">
 <span>Add ${product.sign} Mini Reading (+${fmtGBP(addOnPrice)})</span>
 </label>` : ``}

 ${cross ? `
 <div class="card" style="padding:12px;display:flex;gap:12px;align-items:center">
 <div style="width:72px;aspect-ratio:1/1;border-radius:8px;overflow:hidden;background:#0e0f15;flex:0 0 auto;display:flex;align-items:center;justify-content:center">
 <img src="${cross.image}" alt="${cross.title}" onerror="this.parentElement.textContent='—'">
 </div>
 <div style="flex:1 1 auto">
 <div style="font-weight:600" data-cross-head></div>
 <div style="font-size:14px;color:#b9bcc7" data-cross-sub></div>
 </div>
 <label style="white-space:nowrap">
 <input type="checkbox" name="cross">
 <span>+ ${fmtGBP(cross.price)}</span>
 </label>
 </div>` : ``}

 <div aria-live="polite" data-freeship style="font-size:14px;color:#b9bcc7"></div>

 <button class="button" type="submit" data-cta>Buy Now — ${fmtGBP(product.price)}</button>

 <div style="font-size:12px;color:#b9bcc7">UK shipping £3.95 (3–5 business days). Free over £75. Prints ship separately when mixed-cart.</div>
 </form>
 </div>
 </div>
 </div>
 `;

 const form = document.getElementById('buy');
 const qtyEl = form.querySelector('[name="qty"]');
 const addonEl = form.querySelector('[name="addon"]');
 const cta = form.querySelector('[data-cta]');
 const freeship = form.querySelector('[data-freeship]');

 const crossEl = form.querySelector('[name="cross"]');
 const crossHead = form.querySelector('[data-cross-head]');
 const crossSub = form.querySelector('[data-cross-sub]');

 // Tiny copy A/B (random per session)
 const abKey = 'lyrion_upsell_copy';
 let ab = sessionStorage.getItem(abKey);
 if (!ab){ ab = Math.random() < 0.5 ? 'A' : 'B'; sessionStorage.setItem(abKey, ab); }
 if (crossHead){
   crossHead.textContent = ab === 'A' ? 'Complete the set' : `Pair with the matching ${cross.kind}`;
   crossSub.textContent = ab === 'A' ? cross.title : `${cross.title}`;
 }

 function subtotal(){
 const q = Math.max(1, parseInt(qtyEl.value||'1',10));
 let sum = product.price * q;
 if (addonEl && addonEl.checked) sum += addOnPrice;
 if (crossEl && crossEl.checked && cross) sum += cross.price;
 return sum;
 }

 function updateUI(){
 const sum = subtotal();
 cta.textContent = `Buy Now — ${fmtGBP(sum)}`;
 const need = freeShipThresh - sum;
 freeship.textContent = need > 0 ? `£${need.toFixed(2)} away from free shipping` : `You've unlocked free shipping`;
 }

 qtyEl.addEventListener('input', updateUI);
 if (addonEl) addonEl.addEventListener('change', updateUI);
 if (crossEl) crossEl.addEventListener('change', updateUI);
 updateUI();

 // Real Stripe checkout via Cloudflare Worker
 form.addEventListener('submit', async (e)=>{
 e.preventDefault();
 const q = Math.max(1, parseInt(qtyEl.value||'1',10));
 const items = [{
 sku: product.sku, qty: q, price: product.price, currency:'GBP',
 sign: product.sign, category: product.category, kind: product.kind,
 isDigital: product.isDigital,
 ...(isApparel ? { size: form.size.value } : {})
 }];
 if (addonEl && addonEl.checked){
 items.push({ sku: `READ-${rec.abbr}-MINI`, qty: 1, price: addOnPrice, currency:'GBP', sign: product.sign, category:'Digital', kind:'reading', isDigital:true });
 }
 if (crossEl && crossEl.checked && cross){
 items.push({
 sku: cross.sku, qty: 1, price: cross.price, currency:'GBP',
 sign: cross.sign, category: cross.category, kind: cross.kind, isDigital:false
 });
 }
 try {
 const res = await fetch(`${API_BASE}/checkout`, {
 method:'POST',
 headers:{'Content-Type':'application/json'},
 body: JSON.stringify({ items })
 });
 if (!res.ok){
 let msg = 'Checkout error. Please try again.';
 try { const err = await res.json(); if (err.error) msg = err.error; } catch {}
 alert(msg);
 return;
 }
 const data = await res.json();
 if (data && data.url){ location.href = data.url; }
 else { alert('Unable to start checkout.'); }
 } catch (err) {
 alert('Network error. Please check your connection and try again.');
 }
 });
})();
