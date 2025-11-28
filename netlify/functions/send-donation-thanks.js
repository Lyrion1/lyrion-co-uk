/**
 * Netlify Function: Send Donation Thank You Email
 * 
 * Called by the Cloudflare Worker webhook after a successful checkout
 * containing donation items.
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

    const { email, name, amountPence = 0, currency = "gbp" } = payload;

    const amount = (amountPence / 100).toFixed(2);
    const subject = "Thank you for supporting LYRĪON";
    const html = `<p>Hi ${name || "there"},</p><p>Thank you for your donation of £${amount}.</p><p>Your support keeps the constellations shining ✧</p>`;

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
        console.log("DRY-RUN donation email to", email, "amount:", amount);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
