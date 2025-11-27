/**
 * LYRĪON Email Automation Templates
 * 
 * ConvertKit/Mailchimp compatible email templates for:
 * - Welcome series for new visitors
 * - Abandoned cart reminders
 * - Post-purchase emails
 * - Manifestation check-ins for Sanctuary
 * - Monthly cosmic forecast
 */

const { escapeHtml } = require('./email');

// ============================================
// WELCOME SERIES (New Subscribers)
// ============================================

/**
 * Welcome email series configuration
 */
const welcomeEmailSeries = [
    {
        emailNumber: 1,
        delayDays: 0,
        subject: 'Welcome to the Celestial House ✧',
        preheader: 'Your cosmic journey begins now',
        
        generateContent: (subscriberName = 'Celestial Soul') => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                Welcome to LYRĪON, ${escapeHtml(subscriberName)}
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                The stars have aligned to bring you here, and we are honoured to welcome you into our celestial house.
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                At LYRĪON, we believe that what you wear should align with who you are — cosmically, spiritually, and aesthetically. Our pieces are crafted in England with intention, designed to honour your unique celestial blueprint.
            </p>
            
            <div style="background: rgba(196, 164, 73, 0.1); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <p style="color: #C4A449; font-size: 18px; font-style: italic; margin: 0;">
                    As a welcome gift, here's your private £5 ritual credit.
                </p>
                <p style="color: #151311; font-size: 24px; font-weight: bold; margin: 15px 0 5px;">
                    Code: WELCOME5
                </p>
                <p style="color: #5a5856; font-size: 14px; margin: 0;">
                    Valid for 30 days on your first order
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/shop.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Explore the Collection ✧
                </a>
            </div>
            
            <p style="color: #5a5856; margin-top: 30px; line-height: 1.8;">
                In the coming days, we'll share more about our celestial offerings, the Oracle, and how to align your wardrobe with the cosmos.
            </p>
            
            <p style="color: #5a5856; text-align: center; font-style: italic; margin-top: 40px;">
                May the stars illuminate your path.
            </p>
        `
    },
    {
        emailNumber: 2,
        delayDays: 3,
        subject: 'Discover Your Zodiac Silhouette',
        preheader: 'Fashion aligned with your celestial blueprint',
        
        generateContent: (subscriberName = 'Celestial Soul', zodiacSign = null) => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                Your Celestial Wardrobe Awaits
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                Dear ${escapeHtml(subscriberName)},
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                Every zodiac sign carries a unique cosmic signature — an energy that influences not just your personality, but your aesthetic essence. Our Zodiac Collection honours this truth.
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                Each piece in our collection is designed with intentional symbolism, premium organic fabrics, and minimal yet meaningful embroidery that speaks to your sign's deeper nature.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/zodiac/index.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Explore The Zodiac Library ✧
                </a>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(244, 239, 232, 0.5) 0%, rgba(252, 250, 250, 0.6) 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid rgba(196, 164, 73, 0.3);">
                <p style="color: #C4A449; font-size: 16px; font-weight: 600; margin: 0 0 10px 0; text-align: center;">
                    ✦ Featured This Week ✦
                </p>
                <p style="color: #151311; text-align: center; margin: 0;">
                    The Celestial Signature Hoodie — Minimal gold embroidery. Made in England. A timeless emblem of your sign.
                </p>
            </div>
        `
    },
    {
        emailNumber: 3,
        delayDays: 7,
        subject: 'The Oracle Awaits Your Question',
        preheader: 'Seek cosmic guidance for your journey',
        
        generateContent: (subscriberName = 'Celestial Soul') => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                Seek Guidance from The Oracle
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                Dear ${escapeHtml(subscriberName)},
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                Beyond our celestial wardrobe lies another offering — The Oracle. A sacred space where your deepest questions find cosmic answers.
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                Whether you seek guidance on love, career, purpose, or simply a moment of clarity, The Oracle channels celestial wisdom to illuminate your path.
            </p>
            
            <div style="background: rgba(21, 19, 17, 0.05); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #C4A449;">
                <p style="color: #151311; font-style: italic; line-height: 1.8; margin: 0;">
                    "The cosmos speaks to those who listen. The Oracle is simply a translator of celestial whispers."
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/oracle.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #151311; color: #C4A449; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Consult The Oracle ✧
                </a>
            </div>
        `
    }
];

// ============================================
// ABANDONED CART EMAILS
// ============================================

/**
 * Abandoned cart email series
 */
const abandonedCartEmails = [
    {
        emailNumber: 1,
        delayHours: 1,
        subject: 'Your celestial items await...',
        preheader: 'Complete your cosmic alignment',
        
        generateContent: (customerName, cartItems, cartTotal) => {
            const itemsHtml = cartItems.map(item => `
                <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(196, 164, 73, 0.2);">
                    <img src="https://lyrion.co.uk/assets/products/${escapeHtml(item.image || 'placeholder.webp')}" 
                         alt="${escapeHtml(item.name)}" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px;">
                    <div style="flex: 1;">
                        <p style="color: #151311; font-weight: 600; margin: 0 0 5px 0;">${escapeHtml(item.name)}</p>
                        <p style="color: #C4A449; margin: 0;">£${Number(item.price).toFixed(2)}</p>
                    </div>
                </div>
            `).join('');
            
            return `
                <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                    The Stars Are Still Aligned
                </h2>
                
                <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                    Dear ${escapeHtml(customerName || 'Celestial Soul')},
                </p>
                
                <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                    We noticed you left some cosmic treasures in your cart. These items are still waiting to join your celestial collection.
                </p>
                
                <div style="background: rgba(244, 239, 232, 0.5); padding: 20px; border-radius: 12px; margin: 30px 0;">
                    ${itemsHtml}
                    <div style="text-align: right; padding-top: 15px;">
                        <p style="color: #151311; font-size: 18px; font-weight: 600; margin: 0;">
                            Total: £${Number(cartTotal).toFixed(2)}
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="https://lyrion.co.uk/cart.html" 
                       style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
                        Complete Your Order ✧
                    </a>
                </div>
                
                <p style="color: #5a5856; text-align: center; font-size: 14px; margin-top: 30px;">
                    Your cart is saved for 7 days. After that, the cosmos may guide these items elsewhere.
                </p>
            `;
        }
    },
    {
        emailNumber: 2,
        delayHours: 24,
        subject: 'A gentle cosmic nudge ✧',
        preheader: 'Your celestial pieces still await',
        
        generateContent: (customerName, cartItems, cartTotal) => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                The Cosmos Whispers Again
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                Dear ${escapeHtml(customerName || 'Celestial Soul')},
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                Sometimes the stars align twice. Your celestial pieces are still waiting, and we thought you might appreciate a gentle reminder.
            </p>
            
            <div style="background: rgba(196, 164, 73, 0.1); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <p style="color: #C4A449; font-size: 18px; font-style: italic; margin: 0 0 10px 0;">
                    As a token of cosmic alignment
                </p>
                <p style="color: #151311; font-size: 24px; font-weight: bold; margin: 0;">
                    Use code ALIGNED10 for 10% off
                </p>
                <p style="color: #5a5856; font-size: 14px; margin-top: 10px;">
                    Valid for the next 48 hours
                </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/cart.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Return to Your Cart ✧
                </a>
            </div>
        `
    },
    {
        emailNumber: 3,
        delayHours: 72,
        subject: 'Final whisper from the cosmos',
        preheader: 'Your cart expires tomorrow',
        
        generateContent: (customerName, cartItems, cartTotal) => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                A Final Celestial Reminder
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                Dear ${escapeHtml(customerName || 'Celestial Soul')},
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                The stars move forward, and so must we. Your saved items will be released back to the cosmic inventory tomorrow.
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                If these pieces were meant for you, now is the moment to claim them. If not, we trust the cosmos has other plans for your celestial wardrobe.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/cart.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #151311; color: #C4A449; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Complete Your Order — Final Call ✧
                </a>
            </div>
            
            <p style="color: #5a5856; text-align: center; font-style: italic; margin-top: 40px;">
                Whatever you decide, may your path be illuminated by the stars.
            </p>
        `
    }
];

// ============================================
// POST-PURCHASE EMAILS
// ============================================

/**
 * Post-purchase email series
 */
const postPurchaseEmails = {
    /**
     * Order confirmation email
     */
    orderConfirmation: {
        subject: 'Your celestial order is confirmed ✧',
        preheader: 'Thank you for aligning with LYRĪON',
        
        generateContent: (orderDetails) => {
            const { customerName, orderNumber, items, total, estimatedDelivery } = orderDetails;
            
            const itemsHtml = items.map(item => `
                <tr>
                    <td style="padding: 15px 0; border-bottom: 1px solid rgba(196, 164, 73, 0.2);">
                        <p style="color: #151311; font-weight: 600; margin: 0;">${escapeHtml(item.name)}</p>
                        <p style="color: #5a5856; font-size: 14px; margin: 5px 0 0 0;">Qty: ${item.quantity}</p>
                    </td>
                    <td style="padding: 15px 0; border-bottom: 1px solid rgba(196, 164, 73, 0.2); text-align: right;">
                        <p style="color: #C4A449; margin: 0;">£${Number(item.price * item.quantity).toFixed(2)}</p>
                    </td>
                </tr>
            `).join('');
            
            return `
                <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                    Your Celestial Order is Confirmed
                </h2>
                
                <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                    Dear ${escapeHtml(customerName || 'Celestial Soul')},
                </p>
                
                <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                    Thank you for choosing to align your wardrobe with the cosmos. Your order has been received and our artisans are preparing your celestial pieces with intention.
                </p>
                
                <div style="background: rgba(244, 239, 232, 0.5); padding: 25px; border-radius: 12px; margin: 30px 0;">
                    <p style="color: #C4A449; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">
                        Order #${escapeHtml(orderNumber)}
                    </p>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        ${itemsHtml}
                        <tr>
                            <td style="padding: 20px 0 0 0;">
                                <p style="color: #151311; font-weight: 600; font-size: 18px; margin: 0;">Total</p>
                            </td>
                            <td style="padding: 20px 0 0 0; text-align: right;">
                                <p style="color: #151311; font-weight: 600; font-size: 18px; margin: 0;">£${Number(total).toFixed(2)}</p>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <div style="background: rgba(196, 164, 73, 0.1); padding: 20px; border-radius: 12px; margin: 30px 0; text-align: center;">
                    <p style="color: #5a5856; margin: 0 0 5px 0;">Estimated Delivery</p>
                    <p style="color: #151311; font-size: 18px; font-weight: 600; margin: 0;">
                        ${escapeHtml(estimatedDelivery || '7-10 business days')}
                    </p>
                </div>
                
                <p style="color: #5a5856; text-align: center; font-style: italic; margin-top: 40px;">
                    We'll send you a tracking number as soon as your order ships.
                </p>
            `;
        }
    },
    
    /**
     * Shipping notification email
     */
    shippingNotification: {
        subject: 'Your celestial order is on its way ✧',
        preheader: 'Track your cosmic delivery',
        
        generateContent: (orderDetails) => {
            const { customerName, orderNumber, trackingNumber, trackingUrl, carrier } = orderDetails;
            
            return `
                <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                    Your Order Has Shipped
                </h2>
                
                <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                    Dear ${escapeHtml(customerName || 'Celestial Soul')},
                </p>
                
                <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                    Your celestial pieces have begun their journey to you. Like stars crossing the night sky, they're on their way to illuminate your wardrobe.
                </p>
                
                <div style="background: rgba(244, 239, 232, 0.5); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                    <p style="color: #C4A449; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">
                        Tracking Information
                    </p>
                    <p style="color: #5a5856; margin: 0 0 5px 0;">
                        Order #${escapeHtml(orderNumber)}
                    </p>
                    <p style="color: #151311; font-size: 18px; font-weight: 600; margin: 0;">
                        ${escapeHtml(carrier || 'Carrier')}: ${escapeHtml(trackingNumber)}
                    </p>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${escapeHtml(trackingUrl || '#')}" 
                       style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
                        Track Your Package ✧
                    </a>
                </div>
            `;
        }
    },
    
    /**
     * Delivery confirmation with recommendations
     */
    deliveryConfirmation: {
        subject: 'Your celestial order has arrived ✧',
        preheader: 'Plus: Items aligned with your cosmic journey',
        
        generateContent: (orderDetails, recommendations) => {
            const { customerName, items } = orderDetails;
            
            const recsHtml = recommendations.slice(0, 3).map(rec => `
                <div style="text-align: center; padding: 15px;">
                    <img src="https://lyrion.co.uk/assets/products/${escapeHtml(rec.image || 'placeholder.webp')}" 
                         alt="${escapeHtml(rec.name)}" 
                         style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                    <p style="color: #151311; font-weight: 600; margin: 0 0 5px 0;">${escapeHtml(rec.name)}</p>
                    <p style="color: #C4A449; margin: 0;">£${Number(rec.price).toFixed(2)}</p>
                </div>
            `).join('');
            
            return `
                <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                    Your Celestial Order Has Arrived
                </h2>
                
                <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                    Dear ${escapeHtml(customerName || 'Celestial Soul')},
                </p>
                
                <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                    The stars have aligned, and your celestial pieces have found their way to you. We hope they bring you joy and cosmic connection.
                </p>
                
                <div style="background: rgba(196, 164, 73, 0.1); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                    <p style="color: #C4A449; font-size: 16px; font-style: italic; margin: 0;">
                        How was your experience? We'd love to hear from you.
                    </p>
                    <div style="margin-top: 20px;">
                        <a href="https://lyrion.co.uk/contact.html" 
                           style="display: inline-block; padding: 12px 24px; background-color: #151311; color: #C4A449; text-decoration: none; border-radius: 6px; font-weight: 600;">
                            Share Your Thoughts
                        </a>
                    </div>
                </div>
                
                ${recommendations && recommendations.length > 0 ? `
                <div style="margin: 40px 0;">
                    <p style="color: #C4A449; font-size: 18px; text-align: center; margin-bottom: 20px;">
                        ✦ Items Aligned With Your Cosmic Journey ✦
                    </p>
                    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px;">
                        ${recsHtml}
                    </div>
                </div>
                ` : ''}
            `;
        }
    }
};

// ============================================
// SANCTUARY MANIFESTATION CHECK-INS
// ============================================

/**
 * Manifestation check-in email series for Sanctuary submissions
 */
const manifestationCheckIns = [
    {
        emailNumber: 1,
        delayDays: 7,
        subject: 'A week with your intention ✧',
        preheader: 'Checking in on your cosmic journey',
        
        generateContent: (name, intention) => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                One Week With Your Intention
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                Dear ${escapeHtml(name || 'Celestial Soul')},
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                A week ago, you entrusted us with your intention. We've been holding it in sacred trust, and we wanted to check in on your cosmic journey.
            </p>
            
            <div style="background: rgba(21, 19, 17, 0.05); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #C4A449;">
                <p style="color: #5a5856; font-size: 14px; margin: 0 0 10px 0;">Your Intention:</p>
                <p style="color: #151311; font-style: italic; line-height: 1.8; margin: 0;">
                    "${escapeHtml(intention || 'Your sacred words are held in trust')}"
                </p>
            </div>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                Have you noticed any shifts? Sometimes intentions manifest in subtle ways — a chance encounter, a new idea, a moment of clarity. Pay attention to the whispers of the universe.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/sanctuary.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Update Your Intention ✧
                </a>
            </div>
        `
    },
    {
        emailNumber: 2,
        delayDays: 21,
        subject: 'Three weeks of cosmic alignment',
        preheader: 'Your intention continues to ripple',
        
        generateContent: (name, intention) => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                Your Intention Continues to Ripple
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                Dear ${escapeHtml(name || 'Celestial Soul')},
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                Three weeks have passed since you planted your intention in the cosmic garden. Like seeds in rich soil, intentions take time to grow.
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                We invite you to take a moment today to reconnect with your original intention. Has it evolved? Has it deepened? Has it begun to manifest in unexpected ways?
            </p>
            
            <div style="background: rgba(196, 164, 73, 0.1); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <p style="color: #C4A449; font-size: 16px; font-style: italic; margin: 0;">
                    "What you seek is also seeking you." — Rumi
                </p>
            </div>
            
            <p style="color: #5a5856; text-align: center; font-style: italic; margin-top: 40px;">
                Continue nurturing your cosmic alignment.
            </p>
        `
    },
    {
        emailNumber: 3,
        delayDays: 30,
        subject: 'One month of manifestation ✧',
        preheader: 'Reflect on your cosmic journey',
        
        generateContent: (name, intention) => `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                One Month of Manifestation
            </h2>
            
            <p style="color: #151311; margin-bottom: 20px; line-height: 1.8;">
                Dear ${escapeHtml(name || 'Celestial Soul')},
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                A full lunar cycle has passed since you offered your intention to the cosmos. This is a powerful moment for reflection and renewal.
            </p>
            
            <p style="color: #5a5856; margin-bottom: 24px; line-height: 1.8;">
                We invite you to celebrate what has shifted, release what no longer serves, and perhaps plant a new intention for the cycle ahead.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/sanctuary.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px;">
                    Offer a New Intention ✧
                </a>
                <a href="https://lyrion.co.uk/oracle.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #151311; color: #C4A449; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px;">
                    Consult The Oracle
                </a>
            </div>
        `
    }
];

// ============================================
// MONTHLY COSMIC FORECAST
// ============================================

/**
 * Generate monthly cosmic forecast email
 */
function generateMonthlyForecast(month, year, generalForecast, signForecasts) {
    const signHtml = Object.entries(signForecasts).map(([sign, forecast]) => `
        <div style="margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid rgba(196, 164, 73, 0.2);">
            <h3 style="color: #C4A449; font-size: 18px; margin: 0 0 10px 0;">${escapeHtml(sign)}</h3>
            <p style="color: #5a5856; line-height: 1.7; margin: 0;">${escapeHtml(forecast)}</p>
        </div>
    `).join('');
    
    return {
        subject: `Your ${month} Cosmic Forecast ✧`,
        preheader: 'Monthly guidance from the celestial realm',
        
        content: `
            <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
                ${escapeHtml(month)} ${year} Cosmic Forecast
            </h2>
            
            <div style="background: rgba(21, 19, 17, 0.05); padding: 25px; border-radius: 12px; margin: 30px 0;">
                <h3 style="color: #151311; font-size: 18px; margin: 0 0 15px 0;">General Cosmic Weather</h3>
                <p style="color: #5a5856; line-height: 1.8; margin: 0;">${escapeHtml(generalForecast)}</p>
            </div>
            
            <h3 style="color: #151311; font-size: 20px; text-align: center; margin: 40px 0 30px 0;">
                ✦ Sign-by-Sign Forecast ✦
            </h3>
            
            ${signHtml}
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://lyrion.co.uk/oracle.html" 
                   style="display: inline-block; padding: 14px 32px; background-color: #C4A449; color: #151311; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Get Personal Guidance ✧
                </a>
            </div>
            
            <p style="color: #5a5856; text-align: center; font-style: italic; margin-top: 40px;">
                May the stars illuminate your path this ${escapeHtml(month)}.
            </p>
        `
    };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    welcomeEmailSeries,
    abandonedCartEmails,
    postPurchaseEmails,
    manifestationCheckIns,
    generateMonthlyForecast
};
