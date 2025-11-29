(function(){
  // Make all non-priority images lazy + async
  const imgs = document.getElementsByTagName('img');
  for (const im of imgs){
    if (im.hasAttribute('data-priority')) continue; // allow opt-out
    if (!im.hasAttribute('loading')) im.setAttribute('loading','lazy');
    if (!im.hasAttribute('decoding')) im.setAttribute('decoding','async');
  }

  // If a page marks an LCP image, ensure it has high fetch priority
  const lcp = document.querySelector('[data-lcp-img]');
  if (lcp){
    lcp.setAttribute('fetchpriority','high');
    lcp.setAttribute('loading','eager'); // override lazy
    lcp.setAttribute('decoding','async');
  }
})();
