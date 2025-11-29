(async function(){
try{
const resp = await fetch('/version.json',{cache:'no-store'});
const v = resp.ok ? await resp.json() : {};
const q = '?v=' + (v.commit || Date.now());
// version CSS
document.querySelectorAll('link[rel="stylesheet"][href^="/assets/"]').forEach(link=>{
if (!link.href.includes('?v=')) link.href = link.getAttribute('href') + q;
});
// version JS (only /assets, not external)
document.querySelectorAll('script[src^="/assets/"]').forEach(s=>{
if (s.src.includes('?v=')) return;
const n = document.createElement('script');
n.src = s.getAttribute('src') + q;
if (s.defer) n.defer = true;
if (s.type) n.type = s.type;
s.replaceWith(n);
});
// console stamp
if (v.commit) console.log(`LYRĪON build ${v.commit} @ ${v.time} (${v.branch||''})`);
}catch(_e){}
})();
