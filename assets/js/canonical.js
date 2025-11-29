(function(){
  // Prefer the configured site; fall back to current origin
  const BASE = (window.LYRION_SITE_BASE) || (window.LYRION_LEGAL?.siteBase) || location.origin;
  const canon = new URL(location.pathname + (location.search || ''), BASE).href;
  // Create/replace canonical <link>
  let link = document.querySelector('link[rel="canonical"]');
  if (!link){
    link = document.createElement('link');
    link.setAttribute('rel','canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', canon);
})();
