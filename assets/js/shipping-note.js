(function(){
  const cfg = (window.LYRION_SHIPPING)||{};
  const price = (cfg.standardPricePence||0)/100;
  const days = `${cfg.estMinBusinessDays||3}–${cfg.estMaxBusinessDays||5} business days`;
  const free = typeof cfg.freeThresholdGBP === 'number' ? cfg.freeThresholdGBP : 75;
  const sep = cfg.printsShipSeparately ? " Prints ship separately when mixed-cart." : "";

  const text = `UK shipping £${price.toFixed(2)} (${days}). Free over £${free}.${sep}`;

  function applyShippingNote(el){
    el.textContent = text;
    el.style.fontSize = '12px';
    el.style.color = 'var(--muted)';
  }

  // Apply to existing elements
  document.querySelectorAll('[data-shipping-note]').forEach(applyShippingNote);

  // Watch for dynamically added elements
  const observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
      mutation.addedNodes.forEach(function(node){
        if (node.nodeType === 1) {
          if (node.hasAttribute && node.hasAttribute('data-shipping-note')) {
            applyShippingNote(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('[data-shipping-note]').forEach(applyShippingNote);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
