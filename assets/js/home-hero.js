(async function(){
 const el = document.querySelector('[data-home-hero]');
 if (!el) return;
 try{
 const res = await fetch('/data/calendar-uk-2025.json');
 const cal = await res.json();
 const month = String(new Date().getMonth()+1).padStart(2,'0');
 const cur = cal[month];
 if (!cur) return;
 el.innerHTML = `
 <div style="display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap">
 <div>
 <h1 style="margin:0 0 8px">${cur.sign} — Monthly Capsule</h1>
 <p style="color:#b9bcc7;margin:0">Hoodie · Tee · A3 Print — Optional Mini Reading</p>
 </div>
 <div style="display:flex;gap:8px;flex-wrap:wrap">
 <a class="button" href="/zodiac-now">Shop ${cur.sign}</a>
 <a class="button secondary" href="/readings">Readings</a>
 </div>
 </div>`;
 }catch(_e){}
})();
