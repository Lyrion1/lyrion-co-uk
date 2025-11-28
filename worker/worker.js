import Stripe from "stripe";

function isAllowed(origin, allowList){
  if (!origin) return false;
  return allowList.some((pat)=> {
    if (pat.endsWith("*")) return origin.startsWith(pat.slice(0,-1));
    return origin === pat;
  });
}
function cors(origin, allowList){
  const allow = isAllowed(origin, allowList);
  const h = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
    "Vary": "Origin"
  };
  if (allow) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowList = (env.ALLOWED_ORIGINS||"").split(",").map(s=>s.trim()).filter(Boolean);

    if (request.method === "OPTIONS"){
      return new Response(null, { headers: cors(origin, allowList) });
    }

    if (url.pathname === "/checkout" && request.method === "POST"){
      const headers = cors(origin, allowList);
      try{
        const body = await request.json();
        const items = Array.isArray(body.items) ? body.items : [];
        if (!items.length) return new Response(JSON.stringify({error:"No items"}), {status:400, headers:{...headers,"Content-Type":"application/json"}});

        const hasPhysical = items.some(i => !i.isDigital);
        const subtotal = items.reduce((s,i)=> s + Number(i.price||0)*Number(i.qty||1), 0);
        const shippingFree = subtotal >= 75;

        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
          // Edge-friendly fetch client
          httpClient: Stripe.createFetchHttpClient()
        });

        const line_items = items.map(i => ({
          quantity: Math.max(1, Number(i.qty)||1),
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(Number(i.price||0) * 100),
            product_data: {
              name: i.title || `${i.sign||""} ${i.kind||"Item"}`.trim(),
              metadata: {
                sku: i.sku || "",
                sign: i.sign || "",
                kind: i.kind || "",
                category: i.category || "",
                size: i.size || "",
                isDigital: String(!!i.isDigital)
              }
            }
          }
        }));

        const params = {
          mode: "payment",
          line_items,
          allow_promotion_codes: true,
          success_url: `${env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.BASE_URL}/shop`,
          metadata: {
            skus: items.map(i=>i.sku).join(",").slice(0,500)
          }
        };

        if (hasPhysical){
          params.shipping_address_collection = { allowed_countries: ["GB"] };
          params.shipping_options = shippingFree
            ? [{ shipping_rate_data: {
                type: "fixed_amount",
                display_name: "Free UK Shipping",
                fixed_amount: { amount: 0, currency: "gbp" },
                delivery_estimate: { minimum:{unit:"business_day",value:3}, maximum:{unit:"business_day",value:5} }
              }}]
            : [{ shipping_rate_data: {
                type: "fixed_amount",
                display_name: "UK Standard",
                fixed_amount: { amount: 395, currency: "gbp" },
                delivery_estimate: { minimum:{unit:"business_day",value:3}, maximum:{unit:"business_day",value:5} }
              }}];
        }

        const session = await stripe.checkout.sessions.create(params);
        return new Response(JSON.stringify({ id: session.id, url: session.url }), {
          headers: { ...headers, "Content-Type":"application/json" }
        });
      }catch(err){
        return new Response(JSON.stringify({error: err.message || "checkout_failed"}), { status: 500, headers:{...headers,"Content-Type":"application/json"}});
      }
    }

    if (url.pathname === "/webhook" && request.method === "POST"){
      // Verify signature (stub handler for now)
      const headers = cors(origin, allowList);
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });
      const body = await request.text();
      const sig = request.headers.get("Stripe-Signature") || "";
      try{
        const event = await stripe.webhooks.constructEventAsync(
          body,
          sig,
          env.STRIPE_WEBHOOK_SECRET,
          undefined,
          Stripe.createSubtleCryptoProvider()
        );
        // Minimal: accept checkout.session.completed only (fulfillment in Step 5)
        if (event.type === "checkout.session.completed"){
          // TODO Step 5: fetch line items, route to POD/email
        }
        return new Response(JSON.stringify({received:true}), { headers:{...headers,"Content-Type":"application/json"} });
      }catch(err){
        return new Response(JSON.stringify({error:"signature_verification_failed"}), { status:400, headers:{...headers,"Content-Type":"application/json"} });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
