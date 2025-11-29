(async function(){
  try{
    const r = await fetch('/version.json', { cache:'no-store' });
    if (!r.ok) return;
    const v = await r.json();
    console.log(`LYRĪON build ${v.commit || 'unknown'} @ ${v.time} (${v.branch || ''})`);
    const slot = document.querySelector('[data-build]');
    if (slot) slot.textContent = `Build ${v.commit} · ${new Date(v.time).toLocaleString('en-GB')}`;
  }catch(_e){}
})();
