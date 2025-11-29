(function(){
 const SIGNS = [
 { sign:"Aries", slug:"aries", abbr:"AR" },{ sign:"Taurus", slug:"taurus", abbr:"TA" },
 { sign:"Gemini", slug:"gemini", abbr:"GE" },{ sign:"Cancer", slug:"cancer", abbr:"CA" },
 { sign:"Leo", slug:"leo", abbr:"LE" },{ sign:"Virgo", slug:"virgo", abbr:"VI" },
 { sign:"Libra", slug:"libra", abbr:"LI" },{ sign:"Scorpio", slug:"scorpio", abbr:"SC" },
 { sign:"Sagittarius", slug:"sagittarius", abbr:"SA" },{ sign:"Capricorn", slug:"capricorn", abbr:"CP" },
 { sign:"Aquarius", slug:"aquarius", abbr:"AQ" },{ sign:"Pisces", slug:"pisces", abbr:"PI" }
 ];
 const grid = document.querySelector('[data-collections-grid]');
 if (!grid) return;
 const card = s => `
 <article class="card" style="padding:16px;display:grid;gap:12px">
 <div class="img-square">
 <img src="/assets/zodiac-icons/${s.slug}.svg" alt="${s.sign} insignia"
 loading="lazy" decoding="async"
 onerror="this.parentElement.textContent='${s.sign}'">
 </div>
 <h3 style="margin:0">${s.sign}</h3>
 <div style="display:flex;gap:8px;flex-wrap:wrap">
 <a class="button secondary" href="/shop?sign=${encodeURIComponent(s.sign)}&cat=Apparel&gender=Men">Menswear</a>
 <a class="button secondary" href="/shop?sign=${encodeURIComponent(s.sign)}&cat=Apparel&gender=Women">Womenswear</a>
 <a class="button" href="/shop?sign=${encodeURIComponent(s.sign)}&cat=Prints">Art Prints</a>
 </div>
 </article>`;
 grid.innerHTML = SIGNS.map(card).join('');
})();
