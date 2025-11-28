/**
 * Netlify Function: Send Digital Reading Email
 * 
 * Called by the Cloudflare Worker webhook after a successful checkout
 * containing digital items.
 */

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const ok = event.headers["x-internal-auth"] === process.env.INTERNAL_SHARED_SECRET;
    if (!ok) {
        return { statusCode: 401, body: "Unauthorized" };
    }

    let payload = {};
    try {
        payload = JSON.parse(event.body || "{}");
    } catch (err) {
        console.error("JSON parse error:", err.message);
    }

    const { email, name, items = [] } = payload;

    // Compose a simple email body
    const subject = "Your LYRĪON Digital Reading";
    const lines = items.map(i => `• ${i.sign} ${i.kind} (SKU ${i.sku})`).join("\n");
    const html = `<p>Hi ${name || "there"},</p><p>Here are your digital items:</p><pre>${lines}</pre><p>You'll receive a follow-up within 24 hours if an interpretation is included.</p>`;

    // If RESEND_API_KEY present, send via Resend; else log only
    if (process.env.RESEND_API_KEY) {
        try {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: process.env.EMAIL_FROM || "LYRĪON <no-reply@lyrion.co.uk>",
                    to: [email],
                    subject,
                    html
                })
            });
            if (!res.ok) {
                const t = await res.text();
                console.error("Resend error", t);
            }
        } catch (err) {
            console.error("Email error", err.message);
        }
    } else {
        console.log("DRY-RUN send-digital to", email, "items:", items);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
