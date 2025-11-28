# LYRĪON Infrastructure Architecture

This document provides a complete overview of the infrastructure architecture for the LYRĪON Celestial Couture e-commerce website.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [High-Level Architecture Overview](#high-level-architecture-overview)
3. [Infrastructure Components](#infrastructure-components)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Architecture](#data-architecture)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Payment & Fulfillment Flow](#payment--fulfillment-flow)
9. [Email Automation System](#email-automation-system)
10. [Security Architecture](#security-architecture)
11. [Deployment Architecture](#deployment-architecture)
12. [Monitoring & Observability](#monitoring--observability)
13. [Technology Stack Summary](#technology-stack-summary)
14. [Cost Structure](#cost-structure)
15. [Scalability & Future Considerations](#scalability--future-considerations)

---

## Executive Summary

LYRĪON is a serverless e-commerce platform built on JAMstack principles. The architecture leverages:

- **Static site hosting** on Netlify (with GitHub Pages as fallback)
- **Serverless functions** via Netlify Functions and Cloudflare Workers
- **Print-on-Demand routing** to multiple providers (Printful, Printify, Gelato, Inkthreadable)
- **Stripe** for payment processing
- **GitHub Actions** for CI/CD and catalog automation

The system is designed for low operational overhead, automatic scaling, and zero-server management.

---

## High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LYRĪON E-Commerce Platform                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│                 │          │                 │          │                 │
│   End Users     │──HTTPS──▶│   CDN / Edge    │──────────│   Origin        │
│   (Browsers)    │          │   (Netlify)     │          │   (Static)      │
│                 │          │                 │          │                 │
└─────────────────┘          └────────┬────────┘          └─────────────────┘
                                      │
                                      │ API Requests (/api/*)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Serverless Backend Layer                               │
├──────────────────────────────┬──────────────────────────────────────────────────┤
│   Netlify Functions          │   Cloudflare Workers (Order Broker)              │
│   ├── create-checkout.js     │   ├── /checkout                                  │
│   ├── stripe-webhook.js      │   ├── /webhook                                   │
│   ├── send-welcome-email.js  │   └── Multi-POD Routing                          │
│   ├── codex.js (Blog API)    │                                                  │
│   └── ... (15 functions)     │                                                  │
└──────────────────────────────┴──────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │     Stripe      │ │  POD Providers  │ │  Email Service  │
          │   (Payments)    │ │  (Fulfillment)  │ │  (Notifications)│
          └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Infrastructure Components

### 1. Static Site Hosting (Netlify)

**Primary hosting platform** for the static website.

| Aspect | Details |
|--------|---------|
| **Platform** | Netlify |
| **CDN** | Netlify Edge (Global) |
| **SSL/TLS** | Automatic via Let's Encrypt |
| **Build Command** | `npm install` (Static site - no build step required) |
| **Publish Directory** | `.` (Root) |
| **Functions Directory** | `netlify/functions` |

**Configuration** (`netlify.toml`):
```toml
[build]
command = "npm install"
functions = "netlify/functions"
publish = "."

[functions]
node_bundler = "esbuild"

[[redirects]]
from = "/api/*"
to = "/.netlify/functions/:splat"
status = 200
```

### 2. Serverless Functions (Netlify Functions)

**15 serverless functions** handle API requests:

| Function | Purpose | Trigger |
|----------|---------|---------|
| `create-checkout.js` | Create Stripe embedded checkout sessions | HTTP POST |
| `stripe-webhook.js` | Handle Stripe payment webhooks | HTTP POST (Stripe) |
| `get-products.js` | Fetch product catalog | HTTP GET |
| `handle-fulfillment.js` | Route orders to POD providers | HTTP POST |
| `codex.js` | Blog/content API with caching | HTTP GET |
| `send-welcome-email.js` | Welcome series emails | HTTP POST |
| `send-abandoned-cart-email.js` | Cart abandonment emails | HTTP POST |
| `send-post-purchase-email.js` | Order confirmation emails | HTTP POST |
| `send-manifestation-checkin.js` | Sanctuary check-ins | HTTP POST |
| `send-monthly-forecast.js` | Cosmic forecast emails | HTTP POST |
| `send-complimentary-oracle.js` | Free oracle readings | HTTP POST |
| `send-premium-oracle.js` | Paid oracle readings | HTTP POST |
| `abandoned-oracle-reminder.js` | Oracle follow-up reminders | Scheduled |
| `testimony-reminder-cron.js` | Testimony request cron | Scheduled |

### 3. Order Broker (Cloudflare Workers)

**Multi-POD routing system** deployed on Cloudflare Workers edge network.

| Aspect | Details |
|--------|---------|
| **Platform** | Cloudflare Workers |
| **Runtime** | V8 Isolates |
| **Endpoints** | `/checkout`, `/webhook` |
| **Location** | Global Edge (200+ data centers) |

**Supported Providers:**
- Printful (Hoodies, Premium Apparel)
- Printify (Kids Items, Altar Cloths)
- Gelato (T-shirts, Art Prints)
- Inkthreadable (Hats, Socks - UK)
- Digital (Email Delivery)
- Manual (Handcrafted Items)
- Mixed (Bundles - Recursive)

### 4. GitHub Repository & Actions

**Source control and automation:**

| Aspect | Details |
|--------|---------|
| **Repository** | `Lyrion1/lyrion-co-uk` |
| **Branch Strategy** | `main` (production) |
| **Workflows** | Catalog Sync |

**Catalog Sync Workflow** (`.github/workflows/catalog-sync.yml`):
```yaml
Trigger: Push to main (data/products-master.csv)
Steps:
  1. Checkout repository
  2. Setup Node.js 18
  3. Run catalog generator script
  4. Commit & push generated JSON files
```

---

## Frontend Architecture

### Technology Stack

| Component | Technology |
|-----------|------------|
| **Markup** | Pure HTML5 |
| **Styling** | CSS3 (Custom, No Framework) |
| **JavaScript** | Vanilla ES6+ |
| **Build Tools** | None (Static) |
| **Bundler** | None |

### Page Structure

```
/
├── index.html              # Homepage with seasonal content
├── shop.html               # Dynamic product catalog
├── collections.html        # Category collections
├── product.html            # Product detail template
├── cart.html               # Shopping cart
├── checkout.html           # Checkout page
├── success.html            # Order success page
├── blog.html               # Codex (blog) feed
├── article-template.html   # Blog article template
├── oracle/                 # Oracle reading pages
│   ├── complimentary.html
│   ├── premium.html
│   └── chamber-of-echoes.html
├── sanctuary.html          # Manifestation sanctuary
├── gatherings/             # Events pages
├── houses/                 # Astrology houses
├── zodiac/                 # Zodiac sign pages
├── about.html
├── contact.html
├── account.html
├── privacy.html
├── terms.html
├── disclaimer.html
├── shipping.html
├── returns.html
└── intercession.html
```

### JavaScript Modules

```
js/
├── checkout.js              # Stripe checkout integration
├── shop-dynamic.js          # Dynamic product loading
├── shopping-cart.js         # Cart management
├── store.js                 # State management
├── product-detail.js        # Product page logic
├── product-schema.js        # Structured data
├── bundle-schema.js         # Bundle structured data
├── event-schema.js          # Event structured data
├── upsell.js                # Upselling logic
├── cart-upsell.js           # Cart upsell recommendations
├── pricing-discounts.js     # Discount calculations
├── referral-system.js       # Referral tracking
├── seasonal-homepage.js     # Seasonal content
├── oracle-integration.js    # Oracle API integration
├── oracle-product-crosssell.js
├── oracle-zodiac-selector.js
├── cosmic-interactions.js   # UI animations
├── zodiac-icons.js          # Zodiac SVG icons
└── zodiac-page.js           # Zodiac page logic
```

### Asset Structure

```
assets/
├── css/                     # Stylesheets
├── img/                     # Images
├── js/                      # Additional scripts
├── downloads/               # Digital product files
└── zodiac-icons/            # Zodiac icon assets
```

---

## Backend Architecture

### API Endpoints

#### Netlify Functions API (`/.netlify/functions/*` or `/api/*`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-checkout` | POST | Create Stripe checkout session |
| `/api/stripe-webhook` | POST | Handle Stripe webhooks |
| `/api/get-products` | GET | Fetch product catalog |
| `/api/codex` | GET | Fetch blog posts |
| `/api/send-welcome-email` | POST | Send welcome email |
| `/api/send-abandoned-cart-email` | POST | Send cart abandonment email |
| `/api/send-post-purchase-email` | POST | Send post-purchase email |

#### Cloudflare Worker API (`https://api.lyrion.co.uk/*` or Worker URL)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/checkout` | POST | Create checkout with POD routing |
| `/webhook` | POST | Handle fulfillment webhooks |

### Order Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Order Processing Flow                        │
└─────────────────────────────────────────────────────────────────┘

1. Customer clicks "Buy"
   │
   ▼
2. Frontend calls POST /checkout with SKU
   │
   ▼
3. Order Broker:
   ├── Fetches routing.json from GitHub
   ├── Looks up product by SKU
   ├── Determines provider and pricing
   └── Creates Stripe Checkout Session
   │
   ▼
4. Customer redirected to Stripe Checkout
   │
   ▼
5. Customer completes payment
   │
   ▼
6. Stripe sends webhook (checkout.session.completed)
   │
   ▼
7. Order Broker:
   ├── Verifies webhook signature
   ├── Fetches customer & shipping details
   └── Routes to provider based on type:
       │
       ├── printful  ──▶ POST https://api.printful.com/orders
       ├── printify  ──▶ POST https://api.printify.com/v1/shops/{id}/orders.json
       ├── gelato    ──▶ POST https://order.gelatoapis.com/v4/orders
       ├── inkthreadable ──▶ POST https://api.inkthreadable.co.uk/v1/orders
       ├── digital   ──▶ Send email with download link
       ├── manual    ──▶ Send notification email to brand
       └── mixed     ──▶ Recursively process each bundle item
   │
   ▼
8. Customer receives confirmation
```

---

## Data Architecture

### Data Sources

```
data/
├── products-master.csv     # Master product catalog (source of truth)
├── products.json           # Generated - Frontend catalog
├── routing.json            # Generated - Backend routing
├── bundles.json            # Bundle definitions
├── blog-feed.js            # Blog data helpers
├── codex.js                # Codex content
├── codexFallback.js        # Fallback content
├── gatheringsPreview.js    # Events preview data
├── mock-products.js        # Mock product data
├── mock-bundles.js         # Mock bundle data
├── mock-events.js          # Mock event data
└── MOCK-DATA-README.md     # Mock data documentation
```

### Data Flow

```
                    CSV Master File
                          │
                          ▼
              ┌───────────────────────┐
              │  GitHub Actions       │
              │  (Catalog Sync)       │
              └───────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│   products.json     │       │   routing.json      │
│   (Frontend View)   │       │   (Backend Route)   │
│                     │       │                     │
│ - SKU               │       │ - SKU → Provider    │
│ - Title             │       │ - Provider SKU      │
│ - Price             │       │ - Bundle Items      │
│ - Image             │       │ - Price/Currency    │
│ - Category          │       │ - Type              │
│ - Tags              │       │                     │
└─────────────────────┘       └─────────────────────┘
          │                               │
          ▼                               ▼
    Frontend Display               Order Fulfillment
```

### Product Schema

**products.json (Frontend)**:
```json
{
  "sku": "A-HOOD-ARIES",
  "title": "Aries Zodiac Hoodie",
  "subtitle": "Premium celestial hoodie",
  "description": "...",
  "price": 110.00,
  "compareAtPrice": 0,
  "currency": "GBP",
  "category": "Men",
  "sign": "Aries",
  "type": "apparel",
  "image": "A-HOOD-ARIES-image.webp",
  "tags": ["zodiac", "apparel", "hoodie"],
  "bundleItems": [],
  "isSale": false
}
```

**routing.json (Backend)**:
```json
{
  "A-HOOD-ARIES": {
    "provider": "printful",
    "provider_sku": "PRF-HOOD-001",
    "type": "apparel",
    "bundleItems": [],
    "price": 110,
    "currency": "GBP",
    "title": "Aries Zodiac Hoodie"
  }
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CI/CD Pipeline                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Push to   │───▶│  Catalog    │───▶│  Generate   │───▶│  Auto-Push  │
│   main      │    │  Sync       │    │  JSON       │    │  to main    │
│             │    │  (GA)       │    │  Files      │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                                                        │
       │                                                        │
       ▼                                                        ▼
┌─────────────┐                                         ┌─────────────┐
│  Netlify    │◀────────────────────────────────────────│  Deploy     │
│  Build      │                                         │  Trigger    │
│  & Deploy   │                                         │             │
└─────────────┘                                         └─────────────┘
```

### Deployment Triggers

| Trigger | Action |
|---------|--------|
| Push to `main` | Netlify auto-deploy |
| Push `products-master.csv` | Catalog sync + deploy |
| Manual workflow dispatch | Regenerate catalog |

---

## Payment & Fulfillment Flow

### Stripe Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                     Stripe Payment Flow                          │
└─────────────────────────────────────────────────────────────────┘

                        Customer
                            │
                            ▼
                  ┌─────────────────┐
                  │  Click "Buy"    │
                  └────────┬────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  POST /checkout        │
              │  { sku: "..." }        │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Create Stripe Session │
              │  - line_items          │
              │  - metadata (sku, etc) │
              │  - shipping_address    │
              │  - success/cancel URLs │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Redirect to Stripe    │
              │  Checkout              │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Customer Pays         │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Stripe Webhook        │
              │  checkout.session.     │
              │  completed             │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  Process Fulfillment   │
              │  Route to Provider     │
              └────────────────────────┘
```

### Provider Integration Matrix

| Provider | Products | API Type | Authentication |
|----------|----------|----------|----------------|
| **Printful** | Adult Hoodies | REST | Bearer Token |
| **Printify** | Kids Items, Altar | REST | Bearer Token |
| **Gelato** | T-shirts, Art | REST | X-API-KEY Header |
| **Inkthreadable** | Hats, Socks | REST | Bearer Token |
| **Digital** | PDFs, Readings | Email | N/A |
| **Manual** | Handcrafted | Email | N/A |

---

## Email Automation System

### Email Functions Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Email Automation                             │
└─────────────────────────────────────────────────────────────────┘

lib/
├── email.js                      # Core email utility
├── email-automation-templates.js  # Email templates
└── seasonal-email-template.js     # Seasonal templates

netlify/functions/
├── send-welcome-email.js          # Welcome series (1-3)
├── send-abandoned-cart-email.js   # Cart recovery (1-3)
├── send-post-purchase-email.js    # Post-purchase sequence
├── send-manifestation-checkin.js  # Sanctuary follow-ups
├── send-monthly-forecast.js       # Monthly cosmic forecast
├── send-complimentary-oracle.js   # Free oracle delivery
├── send-premium-oracle.js         # Paid oracle delivery
├── abandoned-oracle-reminder.js   # Oracle follow-up (scheduled)
└── testimony-reminder-cron.js     # Testimonial requests (scheduled)
```

### Email Sequences

| Sequence | Trigger | Emails |
|----------|---------|--------|
| **Welcome Series** | Newsletter signup | 3 emails over 7 days |
| **Abandoned Cart** | Cart abandonment | 3 emails over 48 hours |
| **Post-Purchase** | Order completion | Order confirmation, Shipping, Delivery |
| **Manifestation Check-in** | Sanctuary signup | 7 emails over 30 days |
| **Monthly Forecast** | 1st of month | 1 email/month |

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     Security Architecture                        │
└─────────────────────────────────────────────────────────────────┘

1. TRANSPORT SECURITY
   └── TLS 1.3 (HTTPS everywhere)

2. CDN/EDGE SECURITY
   ├── DDoS Protection (Netlify/Cloudflare)
   ├── WAF Rules
   └── Rate Limiting

3. API SECURITY
   ├── CORS Headers
   ├── Input Validation
   └── Webhook Signature Verification (Stripe)

4. SECRETS MANAGEMENT
   ├── Environment Variables (Netlify)
   ├── Wrangler Secrets (Cloudflare)
   └── No secrets in repository

5. PAYMENT SECURITY
   └── PCI DSS Compliance via Stripe (no card data handling)
```

### Environment Variables

**Netlify Environment Variables:**
```
STRIPE_SECRET_KEY          # Stripe API key
STRIPE_WEBHOOK_SECRET      # Webhook verification
PRINTFUL_API_KEY           # Printful integration
EMAIL_FROM                 # Sender email address
NASA_FEED_URL              # External content feed
ASTRO_FEED_URL             # Astrology content feed
URL                        # Site URL
```

**Cloudflare Worker Secrets:**
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PRINTFUL_API_KEY
PRINTIFY_API_KEY
PRINTIFY_SHOP_ID
GELATO_API_KEY
INKTHREADABLE_API_KEY
ORDER_NOTIFICATION_EMAIL
BASE_URL
ROUTING_JSON_URL
```

---

## Deployment Architecture

### Multi-Environment Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                     Deployment Architecture                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   Development    │   │    Staging       │   │   Production     │
│                  │   │   (Preview)      │   │                  │
├──────────────────┤   ├──────────────────┤   ├──────────────────┤
│ Local Dev        │   │ Netlify Preview  │   │ Netlify Prod     │
│ localhost:8888   │   │ (per-PR)         │   │ lyrion.co.uk     │
│                  │   │                  │   │                  │
│ netlify dev      │   │ Auto-deploy      │   │ main branch      │
└──────────────────┘   └──────────────────┘   └──────────────────┘
```

### Domain Configuration

| Domain | Purpose |
|--------|---------|
| `lyrion.co.uk` | Primary production domain |
| `*.netlify.app` | Netlify subdomain |
| `api.lyrion.co.uk` | Cloudflare Worker API |

---

## Monitoring & Observability

### Monitoring Points

| Platform | What to Monitor |
|----------|-----------------|
| **Netlify** | Deploys, Functions, Analytics |
| **Cloudflare** | Worker invocations, Errors, Latency |
| **Stripe** | Payments, Webhooks, Disputes |
| **GitHub Actions** | Workflow runs, Failures |
| **POD Providers** | Order status, Fulfillment |

### Logging

```
┌─────────────────────────────────────────────────────────────────┐
│                     Logging Architecture                         │
└─────────────────────────────────────────────────────────────────┘

Frontend (Browser)
    └── console.log → Browser DevTools

Netlify Functions
    └── console.log → Netlify Function Logs

Cloudflare Workers
    └── console.log → Workers Dashboard Logs

Stripe
    └── Event Logs → Stripe Dashboard
```

### Recommended Alerts

| Alert | Threshold | Action |
|-------|-----------|--------|
| Function Error Rate | > 5% | Investigate logs |
| Webhook Failures | Any | Check Stripe dashboard |
| Deploy Failures | Any | Check GitHub/Netlify |
| Payment Failures | > 2% | Review error codes |

---

## Technology Stack Summary

### Frontend

| Category | Technology |
|----------|------------|
| **Markup** | HTML5 |
| **Styling** | CSS3 (Custom) |
| **JavaScript** | Vanilla ES6+ |
| **Icons** | Custom SVG |
| **Fonts** | Playfair Display, System Fonts |

### Backend

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js 18+ |
| **Functions** | Netlify Functions |
| **Edge Workers** | Cloudflare Workers |
| **Package Manager** | npm |

### Infrastructure

| Category | Technology |
|----------|------------|
| **Hosting** | Netlify |
| **CDN** | Netlify Edge / Cloudflare |
| **DNS** | Domain provider |
| **SSL** | Let's Encrypt (Auto) |

### Third-Party Services

| Category | Service |
|----------|---------|
| **Payments** | Stripe |
| **POD** | Printful, Printify, Gelato, Inkthreadable |
| **Email** | Placeholder (SendGrid or Resend recommended for production) |
| **Source Control** | GitHub |
| **CI/CD** | GitHub Actions + Netlify |

---

## Cost Structure

### Estimated Monthly Costs

| Service | Tier | Cost (USD) |
|---------|------|------------|
| **Netlify** | Free/Starter | $0-19 |
| **Cloudflare Workers** | Free | $0 |
| **Stripe** | Pay-as-you-go | 2.9% + $0.30/transaction |
| **GitHub** | Free | $0 |
| **Email Service** | Free tier | $0 |
| **Domain** | Annual | ~$10-15/year |

### Scaling Costs

| Scale | Netlify | Cloudflare | Total Infrastructure |
|-------|---------|------------|----------------------|
| 0-100K visits/mo | Free | Free | ~$0 |
| 100K-1M visits/mo | $19-99 | Free-$5 | ~$24-104 |
| 1M+ visits/mo | $99+ | $5+ | ~$104+ |

---

## Scalability & Future Considerations

### Current Capacity

- **Netlify Functions**: 125K invocations/month (free tier)
- **Cloudflare Workers**: 100K requests/day (free tier)
- **Stripe**: No transaction limits

### Growth Recommendations

1. **Add Monitoring**: Implement proper APM (Sentry, LogRocket)
2. **Email Service**: Integrate production email (SendGrid, Resend)
3. **Analytics**: Add privacy-friendly analytics (Plausible, Fathom)
4. **CDN Optimization**: Implement image optimization (Cloudflare Images)
5. **Database**: Consider adding a database for customer data (PlanetScale, Supabase)

### Potential Enhancements

| Feature | Technology Recommendation |
|---------|---------------------------|
| Customer Accounts | Auth0, Netlify Identity |
| Order History | Supabase, PlanetScale |
| Inventory Sync | Webhooks from POD providers |
| Reviews | Stamped.io, Judge.me |
| Search | Algolia, Meilisearch |
| Internationalization | i18n libraries |

---

## Architecture Diagrams

### Complete System View

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          LYRĪON COMPLETE ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    CUSTOMERS
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  CDN LAYER                                       │
│                            (Netlify Edge Network)                                │
│                      Global Distribution, SSL, DDoS Protection                   │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
         ┌────────────────────┐                ┌────────────────────┐
         │   STATIC ASSETS    │                │   SERVERLESS API   │
         │                    │                │                    │
         │ • HTML Pages       │                │ • Netlify Functions│
         │ • CSS Stylesheets  │                │ • Cloudflare       │
         │ • JavaScript       │                │   Workers          │
         │ • Images           │                │ • Edge Functions   │
         │ • Digital Products │                │                    │
         └────────────────────┘                └──────────┬─────────┘
                                                          │
                          ┌───────────────────────────────┼───────────────────────┐
                          │                               │                       │
                          ▼                               ▼                       ▼
               ┌────────────────────┐         ┌────────────────────┐   ┌────────────────────┐
               │      STRIPE        │         │   POD PROVIDERS    │   │   EMAIL SERVICE    │
               │                    │         │                    │   │                    │
               │ • Checkout         │         │ • Printful         │   │ • Transactional    │
               │ • Payments         │         │ • Printify         │   │ • Marketing        │
               │ • Webhooks         │         │ • Gelato           │   │ • Automation       │
               │ • Subscriptions    │         │ • Inkthreadable    │   │                    │
               └────────────────────┘         └────────────────────┘   └────────────────────┘
                          │                               │                       │
                          │                               ▼                       │
                          │                    ┌────────────────────┐              │
                          │                    │   FULFILLMENT      │              │
                          │                    │                    │              │
                          │                    │ • Printing         │              │
                          │                    │ • Shipping         │              │
                          │                    │ • Tracking         │              │
                          │                    └────────────────────┘              │
                          │                               │                       │
                          └───────────────────────────────┴───────────────────────┘
                                                          │
                                                          ▼
                                                    CUSTOMER
                                               (Order Delivered)

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA & AUTOMATION                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐       │
│  │     GITHUB       │─────▶│  GITHUB ACTIONS  │─────▶│     NETLIFY      │       │
│  │   Repository     │      │  Catalog Sync    │      │   Auto-Deploy    │       │
│  │                  │      │                  │      │                  │       │
│  │ • Source Code    │      │ • CSV → JSON     │      │ • Build          │       │
│  │ • CSV Catalog    │      │ • Validation     │      │ • Deploy         │       │
│  │ • Documentation  │      │ • Auto-commit    │      │ • Functions      │       │
│  └──────────────────┘      └──────────────────┘      └──────────────────┘       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

The LYRĪON infrastructure is a modern, serverless e-commerce platform that:

1. **Minimizes operational overhead** with fully managed services
2. **Scales automatically** with traffic
3. **Maintains security** through industry best practices
4. **Enables rapid iteration** with automated deployments
5. **Supports multi-vendor fulfillment** through flexible routing

The architecture follows JAMstack principles, separating the frontend from backend services and leveraging the global edge network for performance.

---

**Last Updated:** November 28, 2024  
**Document Version:** 1.0  
**Maintained By:** LYRĪON Development Team

✧ *Built with intention, aligned with the stars.* ✧
