exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const ok = event.headers["x-internal-auth"] === process.env.INTERNAL_SHARED_SECRET;
  if (!ok) return { statusCode: 401, body: "Unauthorized" };

  let payload = {};
  try { payload = JSON.parse(event.body||"{}"); } catch {}
  const { topic = "unknown_failure", message = "", context = {} } = payload;

  const subject = `URGENT: ${topic}`;
  const html = `
    <p><strong>${topic}</strong></p>
    ${message ? `<p>${message}</p>` : ``}
    <pre style="white-space:pre-wrap">${JSON.stringify(context, null, 2)}</pre>
  `;

  if (process.env.RESEND_API_KEY && process.env.ORDER_NOTIFICATION_EMAIL){
    try{
      const r = await fetch("https://api.resend.com/emails",{
        method:"POST",
        headers:{ "Content-Type":"application/json","Authorization":`Bearer ${process.env.RESEND_API_KEY}`},
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "LYRĪON Ops <no-reply@lyrion.co.uk>",
          to: [process.env.ORDER_NOTIFICATION_EMAIL],
          subject, html
        })
      });
      if (!r.ok) console.error("Resend ops-failure email error", await r.text());
    }catch(e){ console.error("Ops-failure email error", e.message); }
  } else {
    console.log("DRY-RUN OPS FAILURE", subject, context);
  }

  return { statusCode: 200, body: JSON.stringify({ok:true}) };
};
