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
        if (!env.STRIPE_SECRET_KEY) {
          return new Response(JSON.stringify({error:"Server configuration error"}), {status:500, headers:{...headers,"Content-Type":"application/json"}});
        }

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

        // Stripe metadata values are limited to 500 characters
        const MAX_METADATA_LENGTH = 500;
        const params = {
          mode: "payment",
          line_items,
          allow_promotion_codes: true,
          success_url: `${env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.BASE_URL}/shop`,
          metadata: {
            skus: items.map(i=>i.sku).join(",").slice(0, MAX_METADATA_LENGTH)
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
      const headers = cors(origin, allowList);
      const stripe = new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });
      const body = await request.text();
      const sig = request.headers.get("Stripe-Signature") || "";
      try{
        const event = await stripe.webhooks.constructEventAsync(
          body, sig, env.STRIPE_WEBHOOK_SECRET, undefined, Stripe.createSubtleCryptoProvider()
        );

        if (event.type === "checkout.session.completed"){
          const sessionId = event.data.object.id;
          // Expand line items + product metadata for routing
          const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items.data.price.product"]
          });

          // Basic customer/shipping details
          const email = session.customer_details?.email || "";
          const name = session.customer_details?.name || "";
          const shipping = session.shipping_details?.address || session.customer_details?.address || {};
          const address = {
            name,
            email,
            line1: shipping.line1||"",
            line2: shipping.line2||"",
            city: shipping.city||"",
            state: shipping.state||"",
            postal_code: shipping.postal_code||"",
            country: shipping.country||"GB"
          };

          // Normalize items from expanded metadata
          const items = (session.line_items?.data||[]).map(li=>{
            const product = li.price?.product || {};
            const md = product.metadata || {};
            return {
              title: product.name || li.description || "Item",
              sku: md.sku || "",
              kind: md.kind || "",
              category: md.category || "",
              sign: md.sign || "",
              size: md.size || "",
              isDigital: (md.isDigital==="true" || md.category==="Digital"),
              qty: li.quantity || 1,
              unit_amount: li.price?.unit_amount || 0,
              currency: li.price?.currency || "gbp"
            };
          });

          // Split
          const digital = items.filter(i=>i.isDigital || i.category==="Digital");
          const donations = items.filter(i=>i.kind==="donation" || i.category==="Donation");
          const physical = items.filter(i=>!i.isDigital && i.category!=="Digital" && i.kind!=="donation");

          // 1) Digital fulfillment via Netlify Function
          if (digital.length){
            await fetch(`${env.NETLIFY_FUNCTION_BASE}/send-digital`, {
              method:"POST",
              headers:{
                "Content-Type":"application/json",
                "X-Internal-Auth": env.INTERNAL_SHARED_SECRET
              },
              body: JSON.stringify({
                sessionId, email, name,
                items: digital.map(d=>({sku:d.sku, qty:d.qty, sign:d.sign, kind:d.kind}))
              })
            }).catch((err)=>{ console.error("send-digital fetch error:", err.message); });
          }

          // 2) Donation thanks via Netlify Function
          if (donations.length){
            await fetch(`${env.NETLIFY_FUNCTION_BASE}/send-donation-thanks`, {
              method:"POST",
              headers:{
                "Content-Type":"application/json",
                "X-Internal-Auth": env.INTERNAL_SHARED_SECRET
              },
              body: JSON.stringify({
                sessionId, email, name,
                amountPence: donations.reduce((s,i)=> s + (i.unit_amount||0)*(i.qty||1),0),
                currency: "gbp"
              })
            }).catch((err)=>{ console.error("send-donation-thanks fetch error:", err.message); });
          }

          // 3) Physical: log now, route next step
          if (physical.length){
            // Temporary: store minimal log (no PII) via console
            console.log("PHYSICAL_PENDING", physical.map(p=>({sku:p.sku, qty:p.qty, kind:p.kind, size:p.size, sign:p.sign})));
            // Step 6 will: map SKUs -> providers (Printful/Gelato) and place orders.
          }
        }

        return new Response(JSON.stringify({received:true}), { headers:{...headers,"Content-Type":"application/json"} });
      }catch(err){
        return new Response(JSON.stringify({error:"signature_verification_failed"}), { status:400, headers:{...headers,"Content-Type":"application/json"} });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
