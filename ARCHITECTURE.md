# LYRION Automation System Architecture

This document provides a comprehensive overview of the LYRION automation system architecture.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LYRION E-Commerce System                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   GitHub     │      │  Cloudflare  │      │    Stripe    │
│  Repository  │──────│    Worker    │──────│   Checkout   │
│              │      │ Order Broker │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │
       │                      │
       ├──────────────────────┴───────────────────┐
       │                                           │
       ▼                                           ▼
┌──────────────┐                          ┌──────────────┐
│   Static     │                          │  POD         │
│   Website    │                          │  Providers   │
│  (Netlify/   │                          │              │
│   GitHub     │                          │ • Printful   │
│   Pages)     │                          │ • Printify   │
│              │                          │ • Gelato     │
└──────────────┘                          │ • Digital    │
                                          │ • Manual     │
                                          └──────────────┘
```

## Data Flow

### 1. Catalog Management Flow

```
products-master.csv
        │
        ▼
   [GitHub Action Triggered]
        │
        ▼
  generate-catalog.js
        │
        ├──→ products.json (Front-end)
        │
        └──→ routing.json (Backend)
        │
        ▼
  [Auto-commit & Push]
```

**Key Points:**
- Single source of truth: `products-master.csv`
- Automated generation prevents manual errors
- GitHub Actions ensures consistency
- Changes trigger automatic updates

### 2. Purchase Flow

```
Customer
   │
   ▼
[Clicks "Buy" Button]
   │
   ▼
buy(sku) in checkout.js
   │
   ▼
POST /checkout to Worker
   │
   ▼
Worker fetches routing.json
   │
   ▼
Creates Stripe Checkout Session
   │
   ▼
Returns checkout URL
   │
   ▼
Customer redirected to Stripe
   │
   ▼
Customer completes payment
   │
   ▼
Stripe webhook → POST /webhook
   │
   ▼
Worker processes fulfillment
   │
   ├──→ Printful (hoodies)
   ├──→ Printify (kids, home)
   ├──→ Gelato (tees, art)
   ├──→ Digital (email delivery)
   ├──→ Manual (email notification)
   └──→ Mixed (recursive bundle processing)
```

## Component Details

### Front-End Components

#### 1. shop.html
- Displays category selection grid
- Loads when visiting /shop.html
- Links to filtered product views

#### 2. collections.html
- Shows permanent collections
- Links to category-filtered shop pages
- Includes Digital and Bundles sections

#### 3. js/checkout.js
- Handles buy() function
- Creates loading overlay
- Manages success/error states
- Communicates with order broker

#### 4. js/shop-dynamic.js
- Loads products.json
- Filters by category
- Renders product cards
- Handles bundle display

### Back-End Components

#### 1. Order Broker (worker.js)

**Endpoints:**
- `POST /checkout` - Creates Stripe session
- `POST /webhook` - Handles fulfillment

**Key Functions:**
- `handleCheckout()` - Session creation
- `handleWebhook()` - Webhook processing
- `processFulfillment()` - Provider routing
- `fulfillPrintful()` - Printful integration
- `fulfillPrintify()` - Printify integration
- `fulfillGelato()` - Gelato integration
- `fulfillDigital()` - Email delivery
- `fulfillManual()` - Notification email
- `fulfillBundle()` - Recursive processing

#### 2. Catalog Generator (generate-catalog.js)

**Functions:**
- CSV parsing with quote handling
- Product validation
- JSON generation
- Error reporting

**Validation Rules:**
- Required fields check
- Category validation
- Provider validation
- Type validation
- Price format validation

### Data Models

#### products.json Structure
```json
{
  "sku": "A-HOOD-ARIES",
  "title": "Aries Zodiac Hoodie",
  "subtitle": "Premium celestial hoodie",
  "price": 110.00,
  "compareAtPrice": 0,
  "currency": "GBP",
  "category": "Men",
  "sign": "Aries",
  "type": "apparel",
  "image": "A-HOOD-ARIES-image.webp",
  "tags": ["zodiac", "apparel", "hoodie", "fire"],
  "bundleItems": [],
  "isSale": false
}
```

#### routing.json Structure
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

#### Bundle Structure
```json
{
  "B-ARIES-COMPLETE": {
    "provider": "mixed",
    "type": "bundle",
    "bundleItems": [
      "A-HOOD-ARIES",
      "H-ALTAR-CLOTH-ARIES",
      "D-MINI-BIRTH-READING"
    ],
    "price": 169,
    "currency": "GBP"
  }
}
```

## Provider Integration Details

### Printful
- **Use Case**: Adult hoodies, premium apparel
- **API**: REST API with Bearer token
- **Endpoint**: POST https://api.printful.com/orders
- **Fulfillment**: Automatic order creation

### Printify
- **Use Case**: Kids items, altar cloths, specialty
- **API**: REST API with Bearer token
- **Endpoint**: POST https://api.printify.com/v1/shops/{SHOP_ID}/orders.json
- **Fulfillment**: Automatic order creation

### Gelato
- **Use Case**: T-shirts, art prints, framed art
- **API**: REST API with X-API-KEY header
- **Endpoint**: POST https://order.gelatoapis.com/v4/orders
- **Fulfillment**: Automatic order creation

### Digital
- **Use Case**: PDFs, readings, meditation audio
- **Fulfillment**: Email delivery (placeholder)
- **Notes**: Integrate with email service (Resend/SendGrid)

### Manual
- **Use Case**: Hand-crafted items
- **Fulfillment**: Email notification to brand
- **Notes**: Brand fulfills manually

### Mixed (Bundles)
- **Use Case**: Multi-item bundles
- **Fulfillment**: Recursive - processes each bundle item
- **Notes**: Automatically routes to appropriate provider

## Security Architecture

### Authentication & Secrets
- All API keys stored as Cloudflare Worker secrets
- No credentials in code or repository
- Environment variable access via event.env
- Stripe webhook signature verification

### CORS Configuration
- Configured for front-end domains
- Allows POST requests from site
- Proper headers for security

### Payment Security
- PCI compliance via Stripe
- No payment data stored
- Checkout handled by Stripe
- Webhook verification prevents spoofing

## Scalability Considerations

### Current Limits (Cloudflare Free Tier)
- 100,000 requests/day
- Sufficient for ~200-500 orders/day
- Automatic scaling

### Upgrade Path
- Paid tier: $5/month for 10M requests
- Custom domains supported
- Multiple workers for load distribution

### Performance Optimizations
- Routing data cached
- Minimal external API calls
- Async fulfillment processing
- Efficient JSON parsing

## Maintenance & Operations

### Regular Tasks
1. **Weekly**: Check Cloudflare logs for errors
2. **Weekly**: Review POD provider dashboards
3. **Monthly**: Verify catalog data accuracy
4. **Monthly**: Test checkout flow end-to-end

### Product Updates
1. Edit `data/products-master.csv`
2. Commit and push
3. GitHub Actions auto-generates JSON
4. Changes live immediately

### Provider Updates
1. Update API keys in Cloudflare secrets
2. No code changes required
3. Redeploy if endpoints change

### Version Control
- All code in GitHub
- Automated deployments
- Easy rollback capability
- Full change history

## Error Handling

### Catalog Generation Errors
- Validation catches issues before commit
- Clear error messages with line numbers
- GitHub Actions fails if validation fails

### Checkout Errors
- User-friendly error messages
- Loading states prevent double-submission
- Logging for debugging

### Fulfillment Errors
- Email notifications to brand
- Logged in Cloudflare dashboard
- Webhook returns 200 to prevent retries
- Manual intervention for failures

## Monitoring & Alerts

### Key Metrics
- Checkout success rate
- Fulfillment success rate
- Average response time
- Error rate by provider

### Recommended Monitoring
- Cloudflare Workers dashboard
- Stripe dashboard for payments
- POD provider dashboards for orders
- GitHub Actions for catalog updates

## Future Enhancements

### Possible Additions
1. **Inventory Management**: Track stock levels
2. **Analytics**: Customer behavior tracking
3. **Email Service**: Automated digital delivery
4. **Customer Portal**: Order history and tracking
5. **Variant Support**: Size/color options
6. **Discount Codes**: Stripe coupon integration
7. **Subscription Products**: Recurring billing
8. **Multi-Currency**: Dynamic pricing
9. **Shipping Zones**: Region-specific pricing
10. **Admin Dashboard**: Product management UI

## Tech Stack Summary

**Front-End:**
- Pure HTML/CSS/JavaScript (no framework)
- Vanilla JS for simplicity and performance
- Responsive design with CSS Grid

**Back-End:**
- Cloudflare Workers (serverless)
- No server management required
- Instant global deployment

**Data Management:**
- CSV for human-readable catalog
- JSON for programmatic access
- GitHub for version control

**Payment Processing:**
- Stripe Checkout
- PCI compliant
- Secure by design

**Fulfillment:**
- Multi-provider POD integration
- API-driven automation
- Email notifications

**Automation:**
- GitHub Actions
- Automated catalog generation
- Zero-manual-work updates

---

**This architecture provides a robust, scalable, and maintainable e-commerce system for LYRION while preserving the elegant celestial aesthetic of the brand. 🌙✨**
