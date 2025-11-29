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
  const year = new Date().getFullYear();

  document.querySelectorAll('[data-legal-footer]').forEach(function(el) {
    // Clear existing content
    el.textContent = '';

    var parts = [];

    if (L.businessName) {
      parts.push(document.createTextNode("© " + year + " " + L.businessName));
    }
    if (L.companyNumber) {
      if (parts.length > 0) parts.push(document.createTextNode(" · "));
      parts.push(document.createTextNode("Company No: " + L.companyNumber));
    }
    if (L.vatNumber) {
      if (parts.length > 0) parts.push(document.createTextNode(" · "));
      parts.push(document.createTextNode("VAT: " + L.vatNumber));
    }
    if (L.contactEmail) {
      if (parts.length > 0) parts.push(document.createTextNode(" · "));
      var link = document.createElement('a');
      link.href = "mailto:" + L.contactEmail;
      link.textContent = L.contactEmail;
      parts.push(link);
    }

    parts.forEach(function(part) {
      el.appendChild(part);
    });
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
