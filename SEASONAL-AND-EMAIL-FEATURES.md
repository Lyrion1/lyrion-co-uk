# LYRĪON Seasonal Engine & Email Automation Features

This document describes the newly implemented seasonal engine and email automation features for the LYRĪON Celestial Couture website.

## Overview

The implementation includes:
1. **Seasonal Engine** - Determines the current celestial season
2. **Product Filtering** - Filters products by season
3. **Homepage Integration** - Displays seasonal badge and products
4. **Email Utilities** - Centralized email sending
5. **Oracle Email Automation** - Automated emails for oracle readings
6. **Seasonal Marketing** - Email templates for seasonal campaigns

---

## 1. Seasonal Engine (`lib/season.js`)

### Features
- Maps calendar dates to four celestial seasons
- Provides poetic descriptions for each season
- Includes moon phase calculation (placeholder)

### Seasons
- **Ascendant** (Spring): March, April, May - New Moon period
- **Apex** (Summer): June, July, August - Full Moon period
- **Veil** (Autumn): September, October, November - Waning Moon period
- **Return** (Winter): December, January, February - Dark Moon period

### Usage
```javascript
const { getCurrentSeason, getSeasonDescription } = require('./lib/season');

const season = getCurrentSeason();
console.log(season); // e.g., "Veil"

const description = getSeasonDescription(season);
console.log(description); // Poetic description
```

---

## 2. Product Helpers (`lib/product-helpers.js`)

### Features
- Filter products by season
- Fetch products from products.json
- Limit products for display

### Usage
```javascript
const { getProductsForSeason, getSeasonalProductsForDisplay } = require('./lib/product-helpers');

// Filter products for a season
const seasonalProducts = getProductsForSeason(allProducts, 'Veil');

// Get limited products for display (default 6)
const displayProducts = getSeasonalProductsForDisplay(allProducts, 'Apex', 4);
```

### Product Season Attribute
To mark products as seasonal, add a `season` field to product objects:
```json
{
  "id": "product-123",
  "name": "Autumn Ritual Hoodie",
  "season": "Veil",
  ...
}
```

Use `"season": "all"` for products available all seasons.

---

## 3. Homepage Seasonal Features

### Seasonal Badge
A badge displaying the current season appears below the header:
```html
<div id="seasonal-badge">
  <span>Current Cycle: The Veil</span>
</div>
```

### Seasonal Products Section
The "Season's Celestial Flow" section automatically loads products for the current season.

Implementation in `js/seasonal-homepage.js`:
- Updates seasonal badge on page load
- Fetches and filters products by current season
- Displays first 6 seasonal products
- Updates section subtitle with season description

---

## 4. Email Utilities (`lib/email.js`)

### Features
- Centralized email sending function
- Beautiful HTML email template wrapper
- Placeholder for email provider integration

### Email Provider Integration
Currently set up as placeholder. To activate, uncomment and configure one of:
- **SendGrid**: Add API key to environment variables
- **Resend**: Add API key to environment variables
- **EmailJS**: Configure EmailJS settings

### Usage
```javascript
const { sendEmail, createEmailTemplate } = require('./lib/email');

// Send an email
await sendEmail({
  to: 'customer@example.com',
  subject: 'Your Oracle Reading',
  html: '<p>Your reading content...</p>',
  from: 'oracle@lyrion.co.uk' // optional
});

// Create beautiful HTML email
const html = createEmailTemplate(
  '<h2>Your Content</h2><p>Email body...</p>',
  'Preview text'
);
```

---

## 5. Oracle Email Automation

### Complimentary Oracle (`netlify/functions/send-complimentary-oracle.js`)

Sends email after complimentary oracle reading generation.

**Endpoint**: `/.netlify/functions/send-complimentary-oracle`

**Request**:
```json
{
  "email": "user@example.com",
  "reading": "The cosmos reveals...",
  "zodiacSign": "Aries"
}
```

**Integration Example**:
```javascript
// After generating complimentary reading
const response = await fetch('/.netlify/functions/send-complimentary-oracle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userEmail,
    reading: oracleReadingText,
    zodiacSign: userZodiacSign
  })
});
```

### Premium Oracle (`netlify/functions/send-premium-oracle.js`)

Sends email after successful Stripe checkout for premium reading.

**Endpoint**: `/.netlify/functions/send-premium-oracle`

**Request**:
```json
{
  "email": "user@example.com",
  "reading": {
    "themes": "Celestial themes text...",
    "mantra": "Your sacred mantra...",
    "alignmentPath": "Alignment guidance..."
  },
  "zodiacSign": "Taurus",
  "bundleUrl": "https://lyrion.co.uk/bundles/..."
}
```

---

## 6. Automated Email Reminders

### Testimony Reminder (`netlify/functions/testimony-reminder-cron.js`)

Scheduled function that runs daily to remind users to share their experience.

**Schedule**: Daily at 10 AM UTC (configurable in `netlify.toml`)

**Triggers**: 7 days after premium oracle purchase

**Action**: Sends invitation to Chamber of Echoes

**Activation**: Uncomment scheduled function in `netlify.toml`

### Abandoned Oracle Reminder (`netlify/functions/abandoned-oracle-reminder.js`)

Scheduled function for users who viewed complimentary oracle but didn't purchase premium.

**Schedule**: Every 6 hours (configurable in `netlify.toml`)

**Triggers**: 24 hours after complimentary oracle interaction

**Action**: Sends £2 discount offer for premium oracle

**Discount Code**: `DEEPER2` (hardcoded, integrate with Stripe for dynamic codes)

**Activation**: Uncomment scheduled function in `netlify.toml`

---

## 7. Seasonal Email Broadcasts (`lib/seasonal-email-template.js`)

### Features
- Beautiful seasonal announcement emails
- Poetic season introductions
- Product showcases (top 3)
- Seasonal ritual suggestions

### Usage
```javascript
const { seasonalUpdateEmail } = require('./lib/seasonal-email-template');

// Generate seasonal email
const email = seasonalUpdateEmail('Veil', topProducts);

// Send to mailing list
await sendEmail({
  to: 'subscriber@example.com',
  subject: email.subject,
  html: email.html
});
```

### Seasonal Rituals Included
Each season has a unique ritual suggestion:
- **Ascendant**: Dawn candle ritual with intentions
- **Apex**: Noon manifestation with citrine
- **Veil**: Twilight release ceremony
- **Return**: Night rest and regeneration practice

---

## Integration Checklist

### To Complete Implementation

1. **Email Provider Setup**
   - [ ] Choose email provider (SendGrid/Resend/EmailJS)
   - [ ] Add API keys to environment variables
   - [ ] Uncomment provider code in `lib/email.js`
   - [ ] Test email sending

2. **Database Setup** (for tracking)
   - [ ] Set up database for oracle interactions
   - [ ] Implement `getUsersForReminder()` in cron functions
   - [ ] Implement `getAbandonedOracleUsers()` function
   - [ ] Store oracle purchase records

3. **Oracle Forms**
   - [ ] Build complimentary oracle form
   - [ ] Integrate with `send-complimentary-oracle` function
   - [ ] Build premium oracle checkout flow
   - [ ] Integrate with `send-premium-oracle` function
   - [ ] Add abandoned cart tracking

4. **Scheduled Functions**
   - [ ] Uncomment scheduled functions in `netlify.toml`
   - [ ] Verify Netlify scheduled functions are enabled
   - [ ] Test cron job execution

5. **Product Season Tags**
   - [ ] Add `season` field to products in `products.json`
   - [ ] Tag products appropriately (Ascendant/Apex/Veil/Return/all)

6. **Testing**
   - [ ] Test seasonal badge on homepage
   - [ ] Test seasonal product filtering
   - [ ] Test email sending
   - [ ] Test oracle email automation
   - [ ] Test scheduled reminders

---

## Environment Variables

Add these to your Netlify environment:

```bash
# Email Provider (choose one)
SENDGRID_API_KEY=your_sendgrid_key
# OR
RESEND_API_KEY=your_resend_key
# OR
EMAILJS_USER_ID=your_emailjs_user_id
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id

# Database (if using)
DATABASE_URL=your_database_connection_string
```

---

## File Structure

```
lyrion-co-uk/
├── assets/css/
│   ├── style.css                      # Main styles
│   └── cosmic-animations.css          # Smooth interactions & animations
├── lib/
│   ├── season.js                      # Seasonal engine
│   ├── product-helpers.js             # Product filtering
│   ├── email.js                       # Email utilities
│   ├── seasonal-email-template.js     # Seasonal email templates
│   └── email-automation-templates.js  # Complete email automation templates
├── js/
│   ├── seasonal-homepage.js           # Homepage seasonal features
│   ├── oracle-integration.js          # Oracle email integration helpers
│   └── cosmic-interactions.js         # Page transitions & micro-animations
├── netlify/functions/
│   ├── send-complimentary-oracle.js   # Complimentary oracle email
│   ├── send-premium-oracle.js         # Premium oracle email
│   ├── send-welcome-email.js          # Welcome series emails
│   ├── send-abandoned-cart-email.js   # Abandoned cart reminders
│   ├── send-post-purchase-email.js    # Order confirmation & delivery emails
│   ├── send-manifestation-checkin.js  # Sanctuary intention check-ins
│   ├── send-monthly-forecast.js       # Monthly cosmic forecast
│   ├── testimony-reminder-cron.js     # 7-day testimony reminder
│   └── abandoned-oracle-reminder.js   # 24-hour abandoned cart email
└── netlify.toml                       # Netlify configuration
```

---

## Smooth Interactions & Animations

### CSS Animations (`assets/css/cosmic-animations.css`)

The cosmic animations CSS provides:
- **Page Transitions**: Subtle fade-in and celestial wipe effects
- **Star Twinkle**: Multiple animation speeds for twinkling star effects
- **Moon Phases**: Animated moon glow and phase transitions
- **Constellation Connections**: Line drawing and pulse animations
- **Loading States**: Cosmic-themed loading overlays
- **Scroll Reveal**: Fade-in animations on scroll
- **Hover Effects**: Cosmic glow effects on interactive elements
- **Zodiac Animations**: Float and scale effects for zodiac icons

### JavaScript Interactions (`js/cosmic-interactions.js`)

The cosmic interactions JavaScript provides:
- **Loading State Manager**: Show/hide cosmic loading overlays
- **Page Transitions**: Smooth transitions between pages
- **Scroll Reveal**: Intersection Observer-based animations
- **Button Loading States**: Loading spinners for buttons
- **Constellation Drawing**: SVG-based constellation generation

#### Usage Examples

```javascript
// Show loading overlay
LyrionCosmic.showLoading('Aligning the stars...');

// Hide loading overlay
LyrionCosmic.hideLoading();

// Set button to loading state
LyrionCosmic.setButtonLoading(buttonElement, 'Processing...');

// Clear button loading state
LyrionCosmic.clearButtonLoading(buttonElement);

// Create star burst effect at coordinates
LyrionCosmic.createStarBurst(100, 200);

// Draw a constellation
const points = [
  { x: 50, y: 50 },
  { x: 100, y: 30 },
  { x: 150, y: 60 }
];
LyrionCosmic.drawConstellation(container, points);
```

#### CSS Classes

| Class | Description |
|-------|-------------|
| `.cosmic-reveal` | Fade-in on scroll |
| `.cosmic-reveal-stagger` | Staggered fade-in for child elements |
| `.star-twinkle` | Twinkling star animation |
| `.star-twinkle-slow` | Slower twinkle (4s) |
| `.star-twinkle-fast` | Faster twinkle (1.5s) |
| `.moon-phase` | Moon phase and glow animation |
| `.zodiac-float` | Gentle floating animation |
| `.cosmic-glow-hover` | Glow effect on hover |
| `.button-loading` | Loading state for buttons |

---

## Email Automation System

### Overview

The email automation system integrates with ConvertKit or Mailchimp and provides templates for:

1. **Welcome Series** - 3-email sequence for new subscribers
2. **Abandoned Cart** - 3-email reminder sequence
3. **Post-Purchase** - Order confirmation, shipping, and delivery emails
4. **Manifestation Check-ins** - 3 check-ins for Sanctuary submissions
5. **Monthly Cosmic Forecast** - Sign-by-sign monthly newsletter

### Email Automation Templates (`lib/email-automation-templates.js`)

#### Welcome Series
- **Email 1** (Day 0): Welcome + £5 credit code
- **Email 2** (Day 3): Zodiac collection introduction
- **Email 3** (Day 7): Oracle introduction

#### Abandoned Cart
- **Email 1** (1 hour): Items waiting reminder
- **Email 2** (24 hours): 10% discount offer
- **Email 3** (72 hours): Final reminder before cart expiry

#### Post-Purchase
- **Order Confirmation**: Order details + estimated delivery
- **Shipping Notification**: Tracking information
- **Delivery Confirmation**: Arrived + product recommendations

#### Manifestation Check-ins
- **Week 1**: First check-in on intention
- **Week 3**: Progress reflection
- **Month 1**: Full lunar cycle celebration

### Netlify Functions

#### send-welcome-email
```javascript
POST /.netlify/functions/send-welcome-email
Body: {
  "email": "user@example.com",
  "name": "John",
  "emailNumber": 1  // 1, 2, or 3
}
```

#### send-abandoned-cart-email
```javascript
POST /.netlify/functions/send-abandoned-cart-email
Body: {
  "email": "user@example.com",
  "customerName": "John",
  "cartItems": [
    { "name": "Leo Hoodie", "price": 65, "image": "leo-hoodie.webp" }
  ],
  "cartTotal": 65,
  "emailNumber": 1  // 1, 2, or 3
}
```

#### send-post-purchase-email
```javascript
POST /.netlify/functions/send-post-purchase-email
Body: {
  "email": "user@example.com",
  "emailType": "orderConfirmation",  // or shippingNotification, deliveryConfirmation
  "orderDetails": {
    "customerName": "John",
    "orderNumber": "LYR-123456",
    "items": [...],
    "total": 130,
    "estimatedDelivery": "Dec 5-10, 2024"
  },
  "recommendations": [...]  // For deliveryConfirmation only
}
```

#### send-manifestation-checkin
```javascript
POST /.netlify/functions/send-manifestation-checkin
Body: {
  "email": "user@example.com",
  "name": "John",
  "intention": "Find clarity in my career path",
  "emailNumber": 1  // 1, 2, or 3
}
```

#### send-monthly-forecast
```javascript
POST /.netlify/functions/send-monthly-forecast
Body: {
  "email": "user@example.com",
  "month": "December",
  "year": 2024,
  "generalForecast": "The cosmic energies this month...",
  "signForecasts": {
    "Aries": "Bold initiatives find support...",
    "Taurus": "Grounding energy flows...",
    // ... all 12 signs
  }
}
```

---

## Support

For questions or issues with these features, refer to:
- Individual file comments for detailed function documentation
- Netlify Functions documentation: https://docs.netlify.com/functions/overview/
- Scheduled Functions: https://docs.netlify.com/functions/scheduled-functions/

---

## Notes

- All email templates use LYRĪON brand colors (gold #C4A449, ink #151311)
- Email templates are mobile-responsive
- Season calculations are based on Northern Hemisphere months
- Moon phase calculation is simplified and should be enhanced for production
- Scheduled functions require Netlify Pro or higher plan
- Cosmic animations respect `prefers-reduced-motion` user preference
