/**
 * Netlify Function: Partner Payout Advice
 * 
 * Called by the Cloudflare Worker webhook after a successful checkout
 * containing partner event tickets. Sends an internal email with payout details.
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

    const { sessionId = "", email = "", name = "", advice = [] } = payload;

    const gbp = x => "£" + (x / 100).toFixed(2);
    const rows = advice.map(a =>
        `SKU ${a.sku} · qty ${a.qty} · gross ${gbp(a.grossPence)} · our ${gbp(a.ourCommissionPence)} (${a.commissionPct}%) · partner due ${gbp(a.partnerDuePence)}`
    ).join("\n");

    const html = `
<p><strong>Partner payout advice</strong></p>
<p>Stripe session: ${sessionId}</p>
<p>Customer: ${name || "—"} (${email || "—"})</p>
<pre>${rows}</pre>
<p>Note: amounts exclude Stripe fees. Pay partners per your agreement.</p>
`;

    if (process.env.RESEND_API_KEY && process.env.ORDER_NOTIFICATION_EMAIL) {
        try {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: process.env.EMAIL_FROM || "LYRĪON Ops <no-reply@lyrion.co.uk>",
                    to: [process.env.ORDER_NOTIFICATION_EMAIL],
                    subject: "Partner payout advice",
                    html
                })
            });
            if (!res.ok) {
                const t = await res.text();
                console.error("Resend payout email error", t);
            }
        } catch (err) {
            console.error("Payout email error", err.message);
        }
    } else {
        console.log("DRY-RUN payout advice:\n", rows);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
