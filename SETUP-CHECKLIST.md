# LYRION Setup Checklist

Use this checklist to ensure your LYRION automation system is fully configured and operational.

## ✅ Pre-Deployment Checklist

### 1. POD Provider Accounts
- [ ] Printful account created
- [ ] Printful API key obtained
- [ ] Products designed and synced in Printful
- [ ] Printify account created
- [ ] Printify API token obtained
- [ ] Printify shop ID noted (find in dashboard URL)
- [ ] Products designed in Printify
- [ ] Gelato account created
- [ ] Gelato API key obtained
- [ ] Products configured in Gelato

### 2. Stripe Setup
- [ ] Stripe account created
- [ ] Test mode enabled for initial testing
- [ ] Secret key obtained (sk_test_... for testing)
- [ ] Products tested in Stripe test mode

### 3. Update Product SKUs
- [ ] Open `data/products-master.csv`
- [ ] Update `provider_sku` column with actual POD provider product IDs
- [ ] Verify image filenames match actual images
- [ ] Commit changes to trigger catalog regeneration

## 🚀 Deployment Steps

### Step 1: Deploy Order Broker
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Login to Cloudflare: `wrangler login`
- [ ] Set all environment variables (see DEPLOYMENT.md)
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] PRINTFUL_API_KEY
  - [ ] PRINTIFY_API_KEY
  - [ ] PRINTIFY_SHOP_ID
  - [ ] GELATO_API_KEY
  - [ ] ORDER_NOTIFICATION_EMAIL
  - [ ] BASE_URL
  - [ ] ROUTING_JSON_URL
- [ ] Deploy: `wrangler publish`
- [ ] Copy your worker URL

### Step 2: Configure Stripe Webhook
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://your-worker-url/webhook`
- [ ] Select event: `checkout.session.completed`
- [ ] Copy webhook signing secret
- [ ] Update STRIPE_WEBHOOK_SECRET in Cloudflare

### Step 3: Update Front-End
- [ ] Edit `js/checkout.js`
- [ ] Replace `YOURWORKER` with your actual worker subdomain
- [ ] Commit and push changes
- [ ] Deploy to GitHub Pages or Netlify

### Step 4: Test the System

#### Test Catalog Generation
- [ ] Run: `node scripts/generate-catalog.js`
- [ ] Verify no errors
- [ ] Check `data/products.json` and `data/routing.json` exist

#### Test Checkout Endpoint
```bash
curl -X POST https://your-worker-url/checkout \
  -H "Content-Type: application/json" \
  -d '{"sku":"A-HOOD-ARIES"}'
```
- [ ] Returns Stripe checkout URL
- [ ] No errors in response

#### Test End-to-End Purchase
- [ ] Visit your website
- [ ] Click on a product
- [ ] Click "Add to Cart"
- [ ] Complete Stripe checkout with test card: 4242 4242 4242 4242
- [ ] Verify order received message
- [ ] Check Cloudflare logs: `wrangler tail`
- [ ] Verify order in POD provider dashboard

## 🔍 Post-Deployment Verification

### Catalog System
- [ ] Products display correctly on shop page
- [ ] Category filtering works (Men, Women, etc.)
- [ ] Moon Girls category shows kids products
- [ ] Star Boys category shows kids products
- [ ] Digital category displays properly
- [ ] Bundles show included items
- [ ] Sale badges appear for discounted items

### Checkout Flow
- [ ] Buy button triggers checkout
- [ ] Stripe checkout page loads
- [ ] Payment processes successfully
- [ ] Success message displays after purchase
- [ ] Cancel returns to shop correctly

### Order Fulfillment
- [ ] Webhook triggers after payment
- [ ] Order sent to correct POD provider
- [ ] Digital orders send email notification
- [ ] Manual orders send notification to brand
- [ ] Bundle orders process all items

### GitHub Actions
- [ ] Edit `data/products-master.csv`
- [ ] Commit and push
- [ ] Actions tab shows workflow running
- [ ] Workflow completes successfully
- [ ] JSON files auto-updated

## 🎨 Image Assets

Ensure all product images are in place:
- [ ] Create `assets/products/` directory if needed
- [ ] Add images for all 56 products
- [ ] Images are WebP format (recommended)
- [ ] Images are 800x800px or similar square ratio
- [ ] Filenames match those in products-master.csv

## 📧 Email Configuration (Optional)

For production-quality email delivery:
- [ ] Choose email service (Resend, SendGrid, Mailgun)
- [ ] Obtain API key
- [ ] Add to worker environment variables
- [ ] Update `sendEmail()` function in worker.js
- [ ] Test digital product delivery
- [ ] Test manual order notifications

## 🔐 Production Readiness

Before going live:
- [ ] Switch Stripe to live mode
- [ ] Update STRIPE_SECRET_KEY to live key (sk_live_...)
- [ ] Update STRIPE_WEBHOOK_SECRET to live webhook secret
- [ ] Test live checkout with real payment method
- [ ] Set up error monitoring (Sentry, Cloudflare alerts)
- [ ] Configure backup notification emails
- [ ] Document any custom provider configurations
- [ ] Train team on catalog updates

## 📊 Monitoring Setup

- [ ] Cloudflare Workers dashboard bookmarked
- [ ] Stripe dashboard bookmarked
- [ ] POD provider dashboards bookmarked
- [ ] Set up email alerts for failed fulfillments
- [ ] Monitor GitHub Actions for failed workflows
- [ ] Check logs weekly for errors

## 🆘 Support Resources

- **Deployment Issues**: See `automation/order-broker/DEPLOYMENT.md`
- **Product Updates**: See `README.md` → "How to Add Products"
- **Troubleshooting**: See `README.md` → "Troubleshooting"
- **Provider APIs**:
  - Printful: https://developers.printful.com
  - Printify: https://developers.printify.com
  - Gelato: https://api.gelato.com
  - Stripe: https://stripe.com/docs

## ✨ Launch Checklist

When everything above is complete:
- [ ] Final end-to-end test
- [ ] All products displaying correctly
- [ ] Checkout flow working smoothly
- [ ] Orders fulfilling successfully
- [ ] Documentation reviewed
- [ ] Team trained on system
- [ ] **Go live! 🚀**

---

**Questions or issues?** Check the troubleshooting guide in README.md or review the code review comments in the PR.

**Congratulations on setting up your LYRION automation system! 🌙✨**
