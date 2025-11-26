# LYRĪON Order Broker Deployment Guide

This guide walks through deploying the LYRĪON order broker to Cloudflare Workers.

## Prerequisites

- Cloudflare account (free tier works)
- Node.js 18+ installed
- Access to all provider API keys
- Stripe account configured

## Step-by-Step Deployment

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate.

### 3. Navigate to Order Broker Directory

```bash
cd automation/order-broker
```

### 4. Set Environment Variables

You'll need to set these secrets one by one:

```bash
# Stripe Configuration
wrangler secret put STRIPE_SECRET_KEY
# Enter: sk_live_... or sk_test_...

wrangler secret put STRIPE_WEBHOOK_SECRET
# Enter: whsec_... (get this after creating webhook)

# POD Provider Keys
wrangler secret put PRINTFUL_API_KEY
# Enter your Printful API key

wrangler secret put PRINTIFY_API_KEY
# Enter your Printify API token

wrangler secret put PRINTIFY_SHOP_ID
# Enter your Printify shop ID (find in dashboard URL)

wrangler secret put GELATO_API_KEY
# Enter your Gelato API key

wrangler secret put INKTHREADABLE_API_KEY
# Enter your Inkthreadable API key

# Email Configuration
wrangler secret put ORDER_NOTIFICATION_EMAIL
# Enter: orders@lyrion.co.uk (or your email)

# Site Configuration
wrangler secret put BASE_URL
# Enter: https://lyrion.co.uk (your website URL)

wrangler secret put ROUTING_JSON_URL
# Enter: https://raw.githubusercontent.com/Lyrion1/lyrion-co-uk/main/data/routing.json
```

### 5. Deploy Worker

```bash
wrangler publish
```

You should see output like:
```
✨ Success! Deployed to https://lyrion-order-broker.yoursubdomain.workers.dev
```

**Copy this URL** - you'll need it for the next steps.

### 6. Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter endpoint URL: `https://lyrion-order-broker.yoursubdomain.workers.dev/webhook`
5. Select events to listen to:
   - `checkout.session.completed`
6. Click **Add endpoint**
7. Click on the newly created webhook
8. Click **Reveal** under "Signing secret"
9. Copy the secret (starts with `whsec_`)
10. Update the secret in Cloudflare:
    ```bash
    wrangler secret put STRIPE_WEBHOOK_SECRET
    # Paste the whsec_... value
    ```

### 7. Update Front-End Configuration

Edit `js/checkout.js` in your repository:

```javascript
// Change this line:
const WORKER_URL = 'https://lyrion-order-broker.YOURWORKER.workers.dev';

// To your actual worker URL:
const WORKER_URL = 'https://lyrion-order-broker.yoursubdomain.workers.dev';
```

Commit and push:
```bash
git add js/checkout.js
git commit -m "Configure order broker URL"
git push
```

### 8. Test the Integration

#### Test Checkout Endpoint

```bash
curl -X POST https://lyrion-order-broker.yoursubdomain.workers.dev/checkout \
  -H "Content-Type: application/json" \
  -d '{"sku":"A-HOOD-ARIES"}'
```

Expected response:
```json
{
  "url": "https://checkout.stripe.com/c/pay/...",
  "sessionId": "cs_test_..."
}
```

#### Test with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
# or download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward events to local or deployed worker
stripe listen --forward-to https://lyrion-order-broker.yoursubdomain.workers.dev/webhook

# Trigger a test event
stripe trigger checkout.session.completed
```

### 9. Make a Test Purchase

1. Visit your website
2. Click on any product
3. Click "Add to Cart" or "Buy"
4. Complete the Stripe checkout (use test card: 4242 4242 4242 4242)
5. Check Cloudflare Workers logs:
   ```bash
   wrangler tail
   ```

### 10. Monitor Logs

**View real-time logs:**
```bash
wrangler tail
```

**View in Cloudflare Dashboard:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Workers & Pages**
3. Click on **lyrion-order-broker**
4. Click **Logs** tab

## Troubleshooting

### Worker not deploying

- Check wrangler.toml is present
- Ensure you're in the correct directory
- Run `wrangler whoami` to verify you're logged in

### Checkout endpoint returns 500

- Check all environment variables are set: `wrangler secret list`
- Verify ROUTING_JSON_URL is accessible
- Check worker logs: `wrangler tail`

### Webhook not triggering

- Verify webhook URL in Stripe dashboard
- Check webhook signing secret is correct
- Ensure worker is deployed and accessible
- Test with Stripe CLI

### Orders not being sent to POD providers

- Check provider API keys are correct
- Verify provider SKUs in products-master.csv
- Check worker logs for API errors
- Test provider APIs separately

### Routing.json not found

- Ensure routing.json is committed to main branch
- Make routing.json URL public (GitHub raw URL)
- Test URL in browser to verify accessibility

## Updating the Worker

After making changes to worker.js:

```bash
cd automation/order-broker
wrangler publish
```

Changes are deployed immediately.

## Custom Domain Setup (Optional)

To use a custom domain like `api.lyrion.co.uk`:

1. Add a CNAME record in your DNS:
   ```
   api.lyrion.co.uk CNAME lyrion-order-broker.yoursubdomain.workers.dev
   ```

2. Update wrangler.toml:
   ```toml
   [env.production]
   route = "https://api.lyrion.co.uk/*"
   ```

3. Deploy:
   ```bash
   wrangler publish
   ```

4. Update `js/checkout.js` with new URL:
   ```javascript
   const WORKER_URL = 'https://api.lyrion.co.uk';
   ```

## Security Best Practices

- ✅ All API keys stored as secrets (never in code)
- ✅ Stripe webhook signature verification enabled
- ✅ CORS properly configured
- ✅ No secrets logged
- ✅ HTTPS enforced

## Cost Estimation

**Cloudflare Workers Free Tier:**
- 100,000 requests per day
- More than sufficient for most e-commerce sites

**Typical usage:**
- Checkout: 1 request per customer
- Webhook: 1 request per order
- ~200-500 orders/day = ~1,000 requests/day

**Paid tier (if needed):**
- $5/month for 10 million requests

## Provider-Specific Configuration

### Printful Setup

1. Get API key from [Printful Dashboard](https://www.printful.com/dashboard/settings)
2. Note product/variant IDs for your designs
3. Update provider_sku in products-master.csv

### Printify Setup

1. Get API token from [Printify Dashboard](https://printify.com/app/account/api)
2. Find your Shop ID (in API docs or dashboard URL)
3. Update worker.js line 286: Replace `SHOP_ID` with your actual shop ID
4. Update provider_sku with product IDs

### Gelato Setup

1. Get API key from [Gelato Dashboard](https://dashboard.gelato.com)
2. Note product UIDs for your items
3. Update provider_sku in products-master.csv

### Inkthreadable Setup

1. Get API key from [Inkthreadable Dashboard](https://inkthreadable.co.uk)
2. Note product SKUs for your embroidered items
3. Update provider_sku in products-master.csv with INK-prefixed SKUs

## Support

For deployment issues:
- Check Cloudflare Workers documentation: https://developers.cloudflare.com/workers/
- Review worker logs with `wrangler tail`
- Test endpoints individually with curl

---

**Deployment complete! 🚀**

Your LYRĪON automation system is now live and ready to process orders.
