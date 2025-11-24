# LYRĪON Marketing Features Documentation

This document provides an overview of all marketing features, automation, and content templates added to the LYRĪON website.

## Table of Contents
1. [Marketing Content](#marketing-content)
2. [Homepage Features](#homepage-features)
3. [Automation & Utilities](#automation--utilities)
4. [Cart & Pricing Features](#cart--pricing-features)
5. [Referral System](#referral-system)
6. [Oracle Cross-Sell](#oracle-cross-sell)
7. [Usage Examples](#usage-examples)

---

## Marketing Content

### 1. First Sale Campaign (`/marketing/first-sale.md`)
- **Purpose:** 7-day campaign script for Zodiac Hoodie launch
- **Content:** 
  - Day-by-day campaign timeline
  - 12 zodiac sign micro-posts (with and without emoji)
  - 3 launch story sequences
  - "Made in England" story content
  - Final call messaging with Lunar Guide bonus
- **Usage:** Use this as a script for social media posts during launch week

### 2. Social Templates (`/marketing/social-templates.js`)
- **Purpose:** 12 micro social captions for zodiac hoodies
- **Functions:**
  - `getSocialCaption(sign, includeEmoji)` - Get caption for specific sign
  - `getAllCaptions(includeEmoji)` - Get all 12 captions
- **Format:** Cosmic hook + desire statement + CTA
- **Example:**
  ```javascript
  const ariesCaption = getSocialCaption('Aries', true);
  // Returns: "The pioneer spirit wears courage like a second skin..."
  ```

### 3. DM Script (`/marketing/dm-script.md`)
- **Purpose:** Elegant outreach scripts for warm contacts
- **Includes:**
  - 4 different DM templates for various scenarios
  - Follow-up protocols
  - Personalization guidelines
  - Success metrics to track
- **Private Code:** CELESTIAL10 (10% off for early buyers)

### 4. Daily Micro Posts (`/marketing/daily-short.js`)
- **Purpose:** 30 daily cosmic intention posts
- **Functions:**
  - `getDailyPost(dayNumber)` - Get specific day's post
  - `getTodaysPost()` - Get today's post automatically
  - `formatDailyPost(post, includeEmoji)` - Format with CTA
- **Usage:** Rotate through 30 posts for consistent daily content

### 5. Email Templates

#### Launch Sequence (`/marketing/emails/launch.js`)
- **4-email sequence:**
  1. Announcement (Day 1)
  2. Made in England story (Day 3)
  3. Ecosystem overview (Day 5)
  4. Final call with urgency (Day 7)
- **Functions:**
  - `getLaunchEmail(emailNumber)` - Get specific email
  - `formatEmailBody(email, recipientName)` - Personalize email

#### Testimonial Request (`/marketing/emails/testimonial-request.js`)
- **Purpose:** Request customer photos for showcase
- **Incentive:** £5 celestial credit
- **Functions:**
  - `formatTestimonialRequest(name, sign)` - Generate request email
  - `formatTestimonialFollowUp(name, sign)` - Generate follow-up
  - `getTestimonialGuidelines()` - Get best practices

#### Weekly Sign Email (`/marketing/emails/weekly-sign.js`)
- **Purpose:** Automated weekly email featuring rotating sign
- **Functions:**
  - `generateWeeklySignEmail(sign, details, products)` - Create email
  - `generateCurrentWeeklyEmail()` - Auto-generate for current week
  - `getSignProducts(sign)` - Get product recommendations

---

## Homepage Features

### 1. First Buyer Incentive Banner
- **Location:** Top of homepage (after header)
- **Message:** "First 3 buyers receive a complimentary digital Lunar Guide ✧"
- **Style:** Muted gold background with black text

### 2. Email Capture Popup
- **Trigger:** 15 seconds after page load (first visit only)
- **Title:** "Align With Your Sign"
- **Subtitle:** "Join the cosmic list for early access + a private £5 ritual credit"
- **Button:** "Enter the Constellation"
- **Tracking:** Uses localStorage to prevent repeat popups

### 3. This Week's Sign Feature
- **Location:** Homepage, before bestseller section
- **Content:** Auto-rotates through 12 zodiac signs weekly
- **Displays:**
  - Sign icon, name, dates, element
  - Sign traits description
  - 3 product recommendations (hoodie, candle, home item)
  - CTA: "Explore Your Cycle"

### 4. Sign Selector Modal
- **Trigger:** When user scrolls to 40% of page
- **Content:** Grid of all 12 zodiac signs
- **Action:** Clicking redirects to that sign's page
- **Tracking:** Uses localStorage to show once per session

---

## Automation & Utilities

### Weekly Sign Rotator (`/lib/marketing.js`)

Core automation function that rotates featured zodiac sign weekly.

**Key Functions:**
```javascript
// Get current week's featured sign
const currentSign = getWeeklySign();
// Returns: 'Aries', 'Taurus', etc. (rotates every 7 days)

// Get full details for weekly sign
const details = getWeeklySignDetails();
// Returns: { sign, traits, dates, element, color, icon }

// Check if a specific sign is featured this week
const isFeatured = isSignFeaturedThisWeek('Leo');

// Get yearly rotation schedule
const schedule = getYearlyRotationSchedule();
// Returns array of 52 weeks with assigned signs
```

**How It Works:**
- Calculates week number from start of year
- Uses modulo 12 to cycle through zodiac signs
- Consistent rotation: Week 1 = Aries, Week 2 = Taurus, etc.
- Resets each year for predictable scheduling

---

## Cart & Pricing Features

### 1. Cart Upsell (`/js/cart-upsell.js`)

**"Complete the Ritual" Upsell System**

Recommends complementary products based on cart contents.

**Functions:**
```javascript
// Get upsell recommendations
const upsells = getCompleteTheRitualUpsells(cartItems);

// Display upsells in cart
displayCompleteTheRitualUpsell(container, cartItems);
```

**Logic:**
- Detects zodiac sign in cart
- Recommends: Hat, Socks, Candle (if not already in cart)
- Max 3 recommendations
- Sign-specific products prioritized

### 2. Bundle Discount (`/js/pricing-discounts.js`)

**Constellation Pair Discount Automation**

Automatically applies £5 discount for 2+ products from same sign.

**Functions:**
```javascript
// Calculate discount
const discount = calculateConstellationPairDiscount(cartItems);
// Returns: { hasDiscount, amount, message, eligibleSigns }

// Display discount message
displayConstellationDiscountMessage(container, discountInfo);

// Calculate total with discount
const totals = calculateCartTotalWithDiscount(cartItems);
// Returns: { subtotal, discount, total, discountInfo }
```

**Discount Rules:**
- 2+ products from same sign = £5 off
- Multiple signs with 2+ products = £5 per sign
- Message: "Your [Sign] alignment is recognised ✧"

**Progress Indicator:**
```javascript
// Show "almost there" message
displayDiscountProgress(container, cartItems);
// "Add one more [Sign] item to unlock £5 discount"
```

---

## Referral System

### Overview (`/js/referral-system.js`)

Simple referral system with celestial credits.

### Key Features

**1. Referral Link Generation**
```javascript
const link = getReferralLink(userId);
// Returns: "https://lyrion.co.uk/?ref=STAR[CODE]"

const code = generateReferralCode(userId);
// Returns: "STAR" + 8-character hash
```

**2. Tracking & Attribution**
```javascript
// Track referral from URL
trackReferralFromUrl(); // Auto-runs on page load

// Get stored referral
const referrerCode = getStoredReferralCode();
// Returns code if user came via referral link (30-day expiry)
```

**3. Display Referral Section**
```javascript
displayReferralSection(container, userId);
```

Displays:
- Unique referral link with copy button
- Referral code
- Stats: successful referrals, credits earned, available balance
- How it works explanation

**4. Credit Management**
```javascript
// Award credit to referrer
awardReferralCredit(referrerUserId, 5.00);

// Get stats
const stats = getReferralStats(userId);
// Returns: { referrals, creditsEarned, creditsAvailable, creditsUsed }
```

### How It Works

1. **User shares link:** Friend visits via `?ref=STARCODE`
2. **Tracking:** Code stored in localStorage for 30 days
3. **Purchase:** When friend buys, referrer gets £5 credit
4. **Benefit:** Friend also gets £5 off first purchase

### Account Page (`/account.html`)

Demo account page showcasing:
- Account overview
- Referral section with working link generator
- Quick action cards
- Available credits display

---

## Oracle Cross-Sell

### Overview (`/js/oracle-product-crosssell.js`)

Displays product recommendations after oracle reading.

### Features

**Auto-Detection:**
- Watches for oracle result to appear
- Automatically shows cross-sell section

**Content:**
- Title: "Items Aligned With Your Current Cosmic Rhythm"
- 3 product cards (hoodie, candle, home item)
- Sign-based recommendations
- CTA to sign's collection page

**Functions:**
```javascript
// Manually trigger cross-sell
showOracleProductCrossSell(userSign);

// Auto-initialize (runs on oracle.html)
initOracleCrossSell();
```

**Integration:**
- Added to `oracle.html` via script tag
- Uses MutationObserver to detect result display
- Respects user's sign or uses weekly sign

---

## Usage Examples

### Example 1: Using Weekly Sign on Any Page

```javascript
// Load marketing library
<script src="lib/marketing.js"></script>

// Get current featured sign
const weeklySign = getWeeklySign();
console.log(`This week's sign: ${weeklySign}`);

// Get full details
const details = getWeeklySignDetails();
document.getElementById('sign-name').textContent = details.sign;
document.getElementById('sign-icon').textContent = details.icon;
document.getElementById('sign-traits').textContent = details.traits;
```

### Example 2: Implementing Cart Upsells

```javascript
// Load upsell library
<script src="js/cart-upsell.js"></script>

// Your cart items
const cartItems = [
  { sku: 'aries-hoodie', title: 'Aries Zodiac Hoodie', category: 'Apparel' }
];

// Display upsells in cart
const upsellContainer = document.getElementById('cart-upsells');
displayCompleteTheRitualUpsell(upsellContainer, cartItems);
```

### Example 3: Calculating Cart Total with Discount

```javascript
// Load pricing library
<script src="js/pricing-discounts.js"></script>

// Cart items (2 Aries products)
const cartItems = [
  { sku: 'aries-hoodie', title: 'Aries Hoodie', price: 65, quantity: 1 },
  { sku: 'aries-candle', title: 'Aries Candle', price: 28, quantity: 1 }
];

// Calculate with discount
const totals = calculateCartTotalWithDiscount(cartItems);
console.log(`Subtotal: £${totals.subtotal}`);
console.log(`Discount: £${totals.discount}`); // £5.00
console.log(`Total: £${totals.total}`); // £88.00

// Display in UI
const totalContainer = document.getElementById('cart-total');
displayCartTotalWithDiscount(totalContainer, totals);
```

### Example 4: Setting Up Referral System

```javascript
// Load referral library
<script src="js/referral-system.js"></script>

// On account page
const userId = 'user@example.com';
const container = document.getElementById('referral-section');
displayReferralSection(container, userId);

// On any page - track referrals automatically
// Library auto-initializes and tracks ?ref= parameter
```

---

## File Structure

```
/marketing/
  ├── first-sale.md              # 7-day campaign script
  ├── social-templates.js        # 12 zodiac social captions
  ├── dm-script.md              # DM outreach templates
  ├── daily-short.js            # 30 daily micro posts
  └── emails/
      ├── launch.js             # 4-email launch sequence
      ├── testimonial-request.js # Photo request email
      └── weekly-sign.js        # Automated weekly emails

/lib/
  └── marketing.js              # Weekly sign rotator utility

/js/
  ├── cart-upsell.js           # "Complete the Ritual" upsells
  ├── pricing-discounts.js     # Bundle discount automation
  ├── referral-system.js       # Referral link & credit system
  └── oracle-product-crosssell.js # Oracle page product recs

/
  ├── index.html               # Homepage with all features
  ├── oracle.html             # Oracle with cross-sell
  └── account.html            # Account page with referrals
```

---

## Implementation Checklist

- [x] Marketing content files created
- [x] Homepage banner added
- [x] Email capture popup implemented
- [x] Weekly sign feature automated
- [x] Sign selector modal working
- [x] Cart upsell logic created
- [x] Bundle discount automation built
- [x] Referral system functional
- [x] Oracle cross-sell integrated
- [x] Account page with referrals
- [x] All JavaScript syntax validated
- [x] Documentation complete

---

## Notes

- **Static Site:** All features work client-side with localStorage
- **Production:** Replace localStorage with backend API calls
- **Analytics:** Add tracking pixels for conversions
- **A/B Testing:** Test popup timing, discount amounts, etc.
- **Localization:** All copy uses British English (£, "organised", etc.)

---

## Support

For questions or customization needs, refer to individual file comments or contact the development team.

**May your marketing align with the cosmos.** ✧
