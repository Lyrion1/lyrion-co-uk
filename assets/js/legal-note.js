(function(){
  const L = window.LYRION_LEGAL || {};
  const vatNote = (L.showVatInclusiveNote && (L.countryCode || "GB") === "GB")
    ? "Prices include UK VAT." : "";

  function applyVatNote(el) {
    if (vatNote) {
      el.textContent = vatNote;
      el.style.fontSize = '12px';
      el.style.color = 'var(--muted)';
    } else {
      el.remove(); // if no note, don't leave an empty line
    }
  }

  // Insert VAT note wherever requested
  document.querySelectorAll('[data-vat-note]').forEach(applyVatNote);

  // Build legal footer line (only print the fields that exist)
  const bits = [];
  const year = new Date().getFullYear();
  if (L.businessName) bits.push("© " + year + " " + L.businessName);
  if (L.companyNumber) bits.push("Company No: " + L.companyNumber);
  if (L.vatNumber) bits.push("VAT: " + L.vatNumber);
  if (L.contactEmail) bits.push('<a href="mailto:' + L.contactEmail + '">' + L.contactEmail + '</a>');

  const line = bits.join(" · ");
  document.querySelectorAll('[data-legal-footer]').forEach(function(el) {
    if (line) { el.innerHTML = line; }
  });

  // Watch for dynamically added elements (for PDP rendered after DOM load)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          if (node.hasAttribute && node.hasAttribute('data-vat-note')) {
            applyVatNote(node);
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('[data-vat-note]').forEach(applyVatNote);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
