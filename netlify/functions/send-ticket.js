/**
 * Netlify Function: Send Event Ticket Email
 * 
 * Called by the Cloudflare Worker webhook after a successful checkout
 * containing partner event tickets.
 */

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

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

    const subject = "Your LYRĪON ticket";
    const lines = items.map(i => `• ${escapeHtml(i.title) || "Event"} (SKU ${escapeHtml(i.sku)}) x${i.qty}`).join("\n");
    const html = `<p>Hi ${escapeHtml(name) || "there"},</p><p>Your ticket is confirmed:</p><pre>${lines}</pre><p>We'll email joining details 24h before the event.</p>`;

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
                console.error("Resend ticket email error", t);
            }
        } catch (err) {
            console.error("Ticket email error", err.message);
        }
    } else {
        console.log("DRY-RUN ticket email →", email, lines);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
