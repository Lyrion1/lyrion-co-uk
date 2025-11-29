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

async function alertOps(env, topic, message, context){
  try{
    await fetch(`${env.NETLIFY_FUNCTION_BASE}/ops-failure-alert`, {
      method:"POST",
      headers:{ "Content-Type":"application/json", "X-Internal-Auth": env.INTERNAL_SHARED_SECRET },
      body: JSON.stringify({ topic, message, context })
    });
  }catch(_e){}
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
        await alertOps(env, "checkout_failed", err.message || "checkout_failed", {
          origin,
          note: "No PII; summary only"
        });
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

          // 3) Physical: route to Printful/Gelato or alert ops
          if (physical.length){
            try {
            // Fetch routing map
            let map = {};
            try{
              const r = await fetch(env.ROUTING_JSON_URL, { cf: { cacheTtl: 60 }});
              map = await r.json();
            }catch(e){ console.log("ROUTING_FETCH_ERR", e.message); }

            const printfulItems = [];
            const gelatoItems = [];
            const unmapped = [];

            // Group physical items
            for (const it of physical){
              const cfg = map[it.sku];
              if (!cfg){ unmapped.push({ ...it, reason:"no-sku" }); continue; }

              if (cfg.provider === "printful"){
                const variantId = (cfg.variants||{})[it.size||"M"]; // default M if missing
                if (!variantId){ unmapped.push({ ...it, reason:"no-size-variant" }); continue; }
                printfulItems.push({ external_variant_id: variantId, quantity: it.qty });
              }
              else if (cfg.provider === "gelato"){
                if (!cfg.product_uid || !cfg.file_url){ unmapped.push({ ...it, reason:"missing-gelato-config" }); continue; }
                gelatoItems.push({
                  product_uid: cfg.product_uid,
                  copies: it.qty,
                  attributes: cfg.attributes || { size: "A3", paper: "200gsm" },
                  files: [{ url: cfg.file_url }]
                });
              }
              else {
                unmapped.push({ ...it, reason:"unknown-provider" });
              }
            }

            // Create Printful order (if any)
            if (printfulItems.length){
              try{
                const pfRes = await fetch("https://api.printful.com/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${env.PRINTFUL_API_KEY}`
                  },
                  body: JSON.stringify({
                    external_id: sessionId, // idempotency
                    shipping: "STANDARD",
                    recipient: {
                      name: address.name || name || "",
                      address1: address.line1,
                      address2: address.line2,
                      city: address.city,
                      state_code: address.state,
                      country_code: address.country,
                      zip: address.postal_code,
                      email
                    },
                    items: printfulItems
                  })
                });
                if (!pfRes.ok){
                  const txt = await pfRes.text();
                  console.log("PRINTFUL_ERR", txt);
                  unmapped.push(...printfulItems.map(i=>({sku:`PF:${i.external_variant_id}`, qty:i.quantity, reason:"printful_api_error"})));
                }
              }catch(e){
                console.log("PRINTFUL_NET_ERR", e.message);
                unmapped.push(...printfulItems.map(i=>({sku:`PF:${i.external_variant_id}`, qty:i.quantity, reason:"printful_network"})));
              }
            }

            // Create Gelato order (if any)
            if (gelatoItems.length){
              try{
                const gRes = await fetch("https://order.gelatoapis.com/v4/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": env.GELATO_API_KEY
                  },
                  body: JSON.stringify({
                    order_reference_id: sessionId, // idempotency
                    currency: "GBP",
                    contact_email: email,
                    shipping_address: {
                      first_name: ((name||"").split(" ")[0]) || "",
                      last_name: ((name||"").split(" ").slice(1).join(" ")) || "",
                      address_line1: address.line1,
                      address_line2: address.line2,
                      city: address.city,
                      state: address.state,
                      postal_code: address.postal_code,
                      country: address.country
                    },
                    items: gelatoItems,
                    shipping_method: "Express" // or "Standard" if you prefer
                  })
                });
                if (!gRes.ok){
                  const txt = await gRes.text();
                  console.log("GELATO_ERR", txt);
                  unmapped.push(...gelatoItems.map(i=>({sku:`GEL:${i.product_uid}`, qty:i.copies, reason:"gelato_api_error"})));
                }
              }catch(e){
                console.log("GELATO_NET_ERR", e.message);
                unmapped.push(...gelatoItems.map(i=>({sku:`GEL:${i.product_uid}`, qty:i.copies, reason:"gelato_network"})));
              }
            }

            // Alert ops for anything unmapped or failed
            if (unmapped.length){
              try{
                await fetch(`${env.NETLIFY_FUNCTION_BASE}/ops-fulfillment-alert`, {
                  method:"POST",
                  headers:{
                    "Content-Type":"application/json",
                    "X-Internal-Auth": env.INTERNAL_SHARED_SECRET
                  },
                  body: JSON.stringify({
                    sessionId, email, name,
                    shippingAddress: address,
                    issues: unmapped
                  })
                });
              }catch(e){ console.log("OPS_ALERT_ERR", e.message); }
            }
            } catch (fulfillErr) {
              await alertOps(env, "fulfillment_exception", fulfillErr.message || "fulfillment_exception", {
                sessionId: event?.data?.object?.id || "",
                note: "Check worker logs for details."
              });
              throw fulfillErr;
            }
          }
        }

        return new Response(JSON.stringify({received:true}), { headers:{...headers,"Content-Type":"application/json"} });
      }catch(err){
        await alertOps(env, "webhook_signature_failed", err.message || "sig_failed", {
          ip: request.headers.get("CF-Connecting-IP") || "",
          bodyLength: body ? body.length : 0
        });
        return new Response(JSON.stringify({error:"signature_verification_failed"}), { status:400, headers:{...headers,"Content-Type":"application/json"} });
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
