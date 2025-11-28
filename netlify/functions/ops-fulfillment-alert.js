exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const ok = event.headers["x-internal-auth"] === process.env.INTERNAL_SHARED_SECRET;
  if (!ok) return { statusCode: 401, body: "Unauthorized" };

  let payload = {};
  try { payload = JSON.parse(event.body||"{}"); } catch {}
  const { sessionId, email, name, shippingAddress={}, issues=[] } = payload;

  const subject = `FULFILLMENT ATTENTION — ${sessionId}`;
  const html = `
    <p>Stripe session: <strong>${sessionId}</strong></p>
    <p>Customer: ${name||"—"} (${email||"—"})</p>
    <p>Ship to: ${shippingAddress.line1||"—"}, ${shippingAddress.city||""} ${shippingAddress.postal_code||""}, ${shippingAddress.country||""}</p>
    <p>Issues:</p>
    <pre>${issues.map(i=>`${i.sku||"?"} x${i.qty||1} — ${i.reason}`).join("\n")}</pre>
  `;

  if (process.env.RESEND_API_KEY && process.env.ORDER_NOTIFICATION_EMAIL){
    try{
      const r = await fetch("https://api.resend.com/emails",{
        method:"POST",
        headers:{ "Content-Type":"application/json","Authorization":`Bearer ${process.env.RESEND_API_KEY}`},
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "LYRĪON <no-reply@lyrion.co.uk>",
          to: [process.env.ORDER_NOTIFICATION_EMAIL],
          subject, html
        })
      });
      if (!r.ok) console.error("Resend ops email error", await r.text());
    }catch(e){ console.error("Ops email error", e.message); }
  } else {
    console.log("DRY-RUN OPS ALERT", subject, issues);
  }

  return { statusCode: 200, body: JSON.stringify({ok:true}) };
};
