(function(){
 try{
 const head = document.head;
 // Remove any old favicon links to avoid duplicates
 head.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').forEach(n=>n.remove());

 // Modern SVG favicon
 const icoSVG = document.createElement('link');
 icoSVG.setAttribute('rel','icon');
 icoSVG.setAttribute('type','image/svg+xml');
 icoSVG.setAttribute('href','/favicon.svg');
 head.appendChild(icoSVG);

 // Optional: apple touch icon if present (won't break if missing)
 const apple = document.createElement('link');
 apple.setAttribute('rel','apple-touch-icon');
 apple.setAttribute('href','/apple-touch-icon.png');
 head.appendChild(apple);

 // Theme color (address bar tint)
 let theme = head.querySelector('meta[name="theme-color"]');
 if (!theme){ theme = document.createElement('meta'); theme.setAttribute('name','theme-color'); head.appendChild(theme); }
 theme.setAttribute('content','#0b0b10');
 }catch(_e){}
})();
