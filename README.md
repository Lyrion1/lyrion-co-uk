# LYRĪON Celestial Couture - Automated Multi-POD E-Commerce

A sophisticated static site with full automation for multi-provider print-on-demand routing, Stripe checkout, and catalog management.

## 🌙 Overview

LYRĪON is a celestial-themed luxury brand offering zodiac apparel, kids collections, home & altar items, digital products, and curated bundles. This repository includes:

- **Static front-end** (HTML/CSS/JS) hosted on GitHub Pages or Netlify
- **Automated catalog system** with CSV master file and JSON generation
- **Multi-POD routing** supporting Printful, Printify, Gelato, and more
- **Serverless order broker** for Stripe checkout and fulfillment
- **GitHub Actions** for automated catalog synchronization

## 📦 Product Categories

- **Men's Apparel**: 12 zodiac hoodies (Printful)
- **Women's Apparel**: 12 zodiac tees (Gelato)
- **Moon Girls**: Kids apparel for girls (Printify)
- **Star Boys**: Kids apparel for boys (Printify)
- **Home & Altar**: Ritual items, art prints, tapestries (Printify/Gelato/Manual)
- **Hats**: Celestial beanies and caps (Inkthreadable)
- **Socks**: Cosmic-themed socks (Inkthreadable)
- **Digital**: Birth chart readings, lunar guides, meditations
- **Bundles**: Curated sets combining multiple items

Total: **70 products** across **9 categories**

## 🛠️ System Architecture

### 1. Catalog Management

The product catalog is managed via a single CSV file that generates two JSON files:

```
data/
├── products-master.csv    # Master product list (edit this)
├── products.json          # Front-end catalog (auto-generated)
└── routing.json           # Backend routing (auto-generated)
```

**To add/edit products:**

1. Edit `data/products-master.csv`
2. Commit and push to main branch
3. GitHub Actions automatically regenerates JSON files

**CSV Columns:**
- `sku`: Unique product identifier
- `title`: Product name
- `subtitle`: Short description
- `price`: Price in GBP
- `compare_at_price`: Original price (for sales)
- `currency`: GBP, USD, EUR
- `category`: Men, Women, Moon Girls, Star Boys, Home & Altar, Digital, Bundles
- `sign`: Zodiac sign (Aries-Pisces) or blank
- `type`: apparel, kids, home, digital, bundle
- `provider`: printful, printify, gelato, digital, manual, mixed
- `provider_sku`: POD service product ID
- `image`: Filename in assets/products/
- `tags`: Comma-separated tags
- `bundle_items`: Comma-separated SKUs (for bundles)

### 2. Provider Mappings

| Provider | Used For | API Documentation |
|----------|----------|-------------------|
| **Printful** | Adult hoodies, premium apparel | [docs.printful.com](https://developers.printful.com) |
| **Printify** | Kids items, altar cloths, specialty | [developers.printify.com](https://developers.printify.com) |
| **Gelato** | T-shirts, art prints, framed art | [gelato.com/api](https://api.gelato.com) |
| **Inkthreadable** | Hats, socks, embroidered items | [inkthreadable.co.uk](https://inkthreadable.co.uk) |
| **Digital** | PDFs, readings, audio files | Email delivery |
| **Manual** | Hand-crafted items (candle holders) | Email notification |
| **Mixed** | Bundles with multiple providers | Recursive routing |

### 3. Order Flow

```
Customer → Stripe Checkout → Webhook → Order Broker → POD Provider
                                                    → Email (digital/manual)
                                                    → Multiple Providers (bundles)
```

1. Customer clicks "Buy" button with SKU
2. Front-end calls `/checkout` endpoint
3. Order broker fetches routing.json
4. Creates Stripe Checkout Session
5. Customer completes payment
6. Stripe webhook triggers fulfillment
7. Order broker routes to appropriate provider(s)

## 🚀 Deployment Guide

### Prerequisites

- Node.js 18+ (for local testing)
- Cloudflare Workers account (or similar serverless platform)
- Stripe account
- API keys for Printful, Printify, Gelato

### Step 1: Deploy Order Broker

The order broker is a Cloudflare Worker that handles checkout and fulfillment.

```bash
cd automation/order-broker

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Set environment variables
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put PRINTFUL_API_KEY
wrangler secret put PRINTIFY_API_KEY
wrangler secret put GELATO_API_KEY
wrangler secret put INKTHREADABLE_API_KEY
wrangler secret put ORDER_NOTIFICATION_EMAIL
wrangler secret put BASE_URL
wrangler secret put ROUTING_JSON_URL

# Deploy
wrangler publish
```

**Environment Variables:**

- `STRIPE_SECRET_KEY`: Your Stripe secret key (sk_live_... or sk_test_...)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret (whsec_...)
- `PRINTFUL_API_KEY`: Printful API key
- `PRINTIFY_API_KEY`: Printify API token
- `GELATO_API_KEY`: Gelato API key
- `INKTHREADABLE_API_KEY`: Inkthreadable API key
- `ORDER_NOTIFICATION_EMAIL`: Email for manual/error notifications
- `BASE_URL`: Your website URL (e.g., https://lyrion.co.uk)
- `ROUTING_JSON_URL`: Public URL to routing.json (e.g., https://raw.githubusercontent.com/Lyrion1/lyrion-co-uk/main/data/routing.json)

### Step 2: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-worker-url.workers.dev/webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook signing secret and add to worker

### Step 3: Update Front-End Configuration

Edit `js/checkout.js` and update the worker URL:

```javascript
const WORKER_URL = 'https://lyrion-order-broker.yourworker.workers.dev';
```

### Step 4: Enable GitHub Actions

The catalog sync workflow runs automatically when you push changes to `data/products-master.csv`.

**To manually trigger:**
1. Go to GitHub → Actions → Catalog Sync
2. Click "Run workflow"

### Step 5: Deploy Front-End

**Option A: GitHub Pages**
```bash
# Enable in repository settings
# Site will be at https://yourusername.github.io/lyrion-co-uk/
```

**Option B: Netlify**
```bash
# Already configured with netlify.toml
# Connect repository in Netlify dashboard
```

## 🧪 Testing

### Test Catalog Generation Locally

```bash
node scripts/generate-catalog.js
```

### Test Order Broker Locally

```bash
cd automation/order-broker
wrangler dev
```

Then test endpoints:
```bash
# Test checkout
curl -X POST http://localhost:8787/checkout \
  -H "Content-Type: application/json" \
  -d '{"sku":"A-HOOD-ARIES"}'

# Test webhook (use Stripe CLI)
stripe listen --forward-to localhost:8787/webhook
```

## 📝 How to Add Products

1. **Add product to CSV:**
   ```csv
   A-HOOD-LIBRA,Libra Zodiac Hoodie,Balance and harmony,110.00,0,GBP,Men,Libra,apparel,printful,PRF-HOOD-007,A-HOOD-LIBRA-image.webp,"zodiac,hoodie",
   ```

2. **Add product image:**
   - Place image in `assets/products/`
   - Use WebP format for best performance
   - Recommended size: 800x800px

3. **Commit and push:**
   ```bash
   git add data/products-master.csv assets/products/
   git commit -m "Add Libra hoodie"
   git push
   ```

4. **GitHub Actions will automatically:**
   - Validate CSV
   - Generate products.json
   - Generate routing.json
   - Commit changes

## 🎨 Design System

**Colors:**
- Gold: `#C4A449`
- Ink: `#151311`
- Cream: `#F4EFE8`

**Typography:**
- Headers: Playfair Display
- Body: System fonts

**Styling preserved:** All existing CSS and layouts maintained. New automation layer adds zero visual changes.

## 🔒 Security

- Stripe webhook signature verification
- Environment variables for all API keys
- CORS headers properly configured
- No secrets in repository
- Rate limiting on worker endpoints

## 📊 Monitoring

**Order Fulfillment:**
- Check Cloudflare Workers logs
- Monitor Stripe dashboard for payments
- Check POD provider dashboards for orders

**Catalog Updates:**
- GitHub Actions tab shows workflow runs
- Email notifications for workflow failures

## 🐛 Troubleshooting

**Products not showing:**
- Check `data/products.json` was generated correctly
- Verify image paths in `assets/products/`
- Check browser console for fetch errors

**Checkout not working:**
- Verify WORKER_URL in `js/checkout.js`
- Check Cloudflare Workers logs
- Ensure all environment variables are set

**Orders not fulfilling:**
- Check Stripe webhook is configured
- Verify provider API keys
- Check worker logs for errors

**CSV validation errors:**
- Ensure all required columns present
- Check for valid categories and providers
- Verify prices are numeric

## 📄 License

Proprietary - LYRĪON Celestial Couture

## 🤝 Support

For technical issues, check the repository issues or contact the development team.

---

**Built with intention. 🌙✨**