(async function(){
  var API_BASE = window.LYRION_API_BASE || "";
  var L = window.LYRION_LISTING || {};
  var fmtGBP = function(v) { return "£" + Number(v||0).toFixed(2); };

  function wireUpgrades(){
    document.querySelectorAll('[data-upgrade-feature]').forEach(function(b){ if (L.featureLink) b.href = L.featureLink; });
    document.querySelectorAll('[data-upgrade-spotlight]').forEach(function(b){ if (L.spotlightLink) b.href = L.spotlightLink; });
  }

  function regionOf(ev){
    if (!ev.location) return 'UK-wide';
    var l = ev.location.toLowerCase();
    if (l.indexOf('london') !== -1) return 'London';
    if (l.indexOf('manchester') !== -1) return 'Manchester';
    return 'UK-wide';
  }

  function ics(ev){
    if (!ev.date) return '#';
    var dt = ev.date + 'T' + (ev.time||'19:00');
    var start = dt.replace(/[-:]/g,'') + '00';
    // Add 2 hours for end time
    var startDate = new Date(ev.date + 'T' + (ev.time||'19:00'));
    startDate.setHours(startDate.getHours() + 2);
    var endStr = startDate.toISOString().replace(/[-:]/g,'').split('.')[0] + '00';
    var body = [
      'BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
      'SUMMARY:' + ev.title,
      ev.location ? 'LOCATION:' + ev.location : '',
      'DTSTART:' + start, 'DTEND:' + endStr,
      'DESCRIPTION:' + (ev.subtitle||'') + (ev.bookUrl? ' — ' + ev.bookUrl : ''),
      'END:VEVENT','END:VCALENDAR'
    ].filter(Boolean).join('\r\n');
    return URL.createObjectURL(new Blob([body],{type:'text/calendar'}));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function card(ev){
    var featured = ev.listingType === 'featured' || ev.listingType === 'spotlight';
    var capacity = Number(ev.capacity||0);
    var available = Number.isFinite(Number(ev.available)) ? Number(ev.available) : capacity || Infinity;
    var sold = available <= 0 && capacity > 0;
    var badge = ev.listingType && ev.listingType !== 'free'
      ? '<span class="badge" style="font-size:12px;padding:2px 8px;border-radius:12px;background:var(--accent);color:#111">' + escapeHtml(ev.listingType) + '</span>'
      : '';
    var isPartner = ev.listingType === 'partnerTicketed' && ev.ticket;
    var price = isPartner ? fmtGBP(ev.ticket.price) : (Number(ev.price||0)>0 ? fmtGBP(ev.price) : 'Free');
    var dateTxt = ev.date ? new Date(ev.date + 'T' + (ev.time||'00:00')).toLocaleString('en-GB',{weekday:'short', day:'numeric', month:'short'}) : 'Date TBA';
    var timeTxt = ev.time ? new Date('2000-01-01T'+ev.time).toLocaleTimeString('en-GB',{hour:'2-digit', minute:'2-digit'}) : '';
    var img = ev.image || '/assets/img/placeholder-event.webp';

    return '\n    <article class="card" style="padding:12px;display:grid;gap:12px;' + (featured?'border-color:var(--accent)':'') + '">' +
      '\n      <div class="img-square"><img src="' + escapeHtml(img) + '" alt="' + escapeHtml(ev.title) + '" loading="lazy" decoding="async" onerror="this.parentElement.textContent=\'Image coming soon\'"></div>' +
      '\n      <div style="display:flex;justify-content:space-between;align-items:center">' +
      '\n        <h3 style="margin:0">' + escapeHtml(ev.title) + '</h3>' +
      '\n        <div style="display:flex;gap:8px;align-items:center">' +
      badge +
      (sold?'<span class="badge" style="font-size:12px;padding:2px 8px;border-radius:12px;background:#ccc;color:#111">Sold out</span>':'') +
      '\n        </div>' +
      '\n      </div>' +
      (ev.subtitle?'\n      <p class="muted" style="margin:0">' + escapeHtml(ev.subtitle) + '</p>':'') +
      '\n      <p style="margin:0"><strong>' + dateTxt + (timeTxt?' · '+timeTxt:'') + '</strong>' + (ev.location?' · ' + escapeHtml(ev.location):'') + '</p>' +
      '\n      <p class="muted" style="margin:0">' + escapeHtml(ev.mode) + (ev.host?' · ' + escapeHtml(ev.host):'') + '</p>' +
      '\n      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">' +
      '\n        <div><strong>' + price + '</strong>' + (Number.isFinite(capacity)&&capacity>0?' · '+Math.max(0,available)+'/'+capacity+' seats':'') + '</div>' +
      (isPartner
        ? '\n        <button class="button" data-internal-book ' + (sold?'disabled':'') +
          ' data-sku="' + escapeHtml(ev.sku||'') + '" data-title="' + escapeHtml(ev.title) + '"' +
          ' data-commission="' + (ev.ticket.ourCommissionPct||0) + '"' +
          ' data-price="' + (ev.ticket.price||0) + '">Book</button>'
        : (ev.bookUrl
          ? '\n        <a class="button' + (sold?' secondary':'') + '" href="' + escapeHtml(ev.bookUrl) + '" target="_blank" rel="noopener"' + (sold?' aria-disabled="true"':'') + '>Book</a>'
          : '\n        <span class="muted">Details soon</span>'
        )
      ) +
      '\n      </div>' +
      '\n      <div class="cluster">' +
      (ev.date ? '\n        <a class="button secondary" href="' + ics(ev) + '" download="' + escapeHtml(ev.id||'event') + '.ics">Add to calendar</a>' : '') +
      (ev.source?'\n        <span class="muted" style="font-size:12px">Source: ' + escapeHtml(ev.source) + '</span>':'') +
      '\n      </div>' +
      '\n    </article>';
  }

  var grid = document.querySelector('[data-gath-grid]');
  var typeSel = document.querySelector('[data-gath-filter-type]');
  var regSel = document.querySelector('[data-gath-filter-region]');
  var countEl = document.querySelector('[data-gath-count]');

  var data = { currency:'GBP', events:[] };
  try{ var r = await fetch('/data/gatherings.json'); data = await r.json(); }catch(e){ console.error('Failed to load gatherings:', e); }

  function apply(){
    var list = data.events || [];
    var t = (typeSel ? typeSel.value : 'all');
    var rg = (regSel ? regSel.value : 'all');
    if (t==='online') list = list.filter(function(e) { return (e.mode||'').toLowerCase().indexOf('online') !== -1; });
    if (t==='inperson') list = list.filter(function(e) { return (e.mode||'').toLowerCase().indexOf('online') === -1; });
    if (rg!=='all') list = list.filter(function(e) { return regionOf(e)===rg; });
    list = list.slice().sort(function(a,b){ return (a.date||'') < (b.date||'') ? -1 : 1; });
    if (grid) grid.innerHTML = list.map(card).join('');
    if (countEl) countEl.textContent = list.length + ' listings';

    // internal booking (partner tickets)
    if (grid) {
      grid.querySelectorAll('[data-internal-book]').forEach(function(btn){
        btn.addEventListener('click', async function(){
          var price = Number(btn.dataset.price||0);
          var commission = Number(btn.dataset.commission||0);
          var sku = btn.dataset.sku;
          var title = btn.dataset.title || 'Event ticket';

          var item = {
            sku: sku, qty:1, price: price, currency: data.currency || 'GBP',
            category: "Event", kind: "partner_ticket", isDigital: true,
            meta: { title: title, commissionPct: commission }
          };
          try{
            var response = await fetch(API_BASE + '/checkout', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ items:[item] })
            });
            var out = await response.json();
            if (out && out.url) location.href = out.url; else alert('Unable to start checkout.');
          }catch(e){ alert('Network error.'); }
        });
      });
    }

    wireUpgrades();
  }

  if (typeSel) typeSel.addEventListener('change', apply);
  if (regSel) regSel.addEventListener('change', apply);
  apply();
})();
