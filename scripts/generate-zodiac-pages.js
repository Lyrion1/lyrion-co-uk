/**
 * Generate zodiac sign detail pages
 */

const fs = require('fs');
const path = require('path');

const signs = [
    {
        name: 'Aries',
        symbol: '♈',
        dates: 'March 21 - April 19',
        essence: 'Bold, pioneering, and fiercely independent — the warrior spirit of initiation and courage.'
    },
    {
        name: 'Taurus',
        symbol: '♉',
        dates: 'April 20 - May 20',
        essence: 'Grounded, sensual, and steadfast — the embodiment of earthly beauty and unwavering determination.'
    },
    {
        name: 'Gemini',
        symbol: '♊',
        dates: 'May 21 - June 20',
        essence: 'Curious, adaptable, and intellectually vibrant — the cosmic messenger dancing between worlds.'
    },
    {
        name: 'Cancer',
        symbol: '♋',
        dates: 'June 21 - July 22',
        essence: 'Intuitive, nurturing, and deeply emotional — the lunar guardian of home and heart.'
    },
    {
        name: 'Leo',
        symbol: '♌',
        dates: 'July 23 - August 22',
        essence: 'Radiant, confident, and magnanimous — the solar sovereign commanding center stage with grace.'
    },
    {
        name: 'Virgo',
        symbol: '♍',
        dates: 'August 23 - September 22',
        essence: 'Analytical, meticulous, and service-oriented — the celestial perfectionist weaving order from chaos.'
    },
    {
        name: 'Libra',
        symbol: '♎',
        dates: 'September 23 - October 22',
        essence: 'Harmonious, diplomatic, and aesthetically refined — the scales of justice seeking cosmic balance.'
    },
    {
        name: 'Scorpio',
        symbol: '♏',
        dates: 'October 23 - November 21',
        essence: 'Intense, transformative, and powerfully magnetic — the phoenix rising from depths of shadow.'
    },
    {
        name: 'Sagittarius',
        symbol: '♐',
        dates: 'November 22 - December 21',
        essence: 'Adventurous, philosophical, and boundlessly optimistic — the archer aiming arrows at distant horizons.'
    },
    {
        name: 'Capricorn',
        symbol: '♑',
        dates: 'December 22 - January 19',
        essence: 'Ambitious, disciplined, and timelessly wise — the mountain goat ascending peaks with patient mastery.'
    },
    {
        name: 'Aquarius',
        symbol: '♒',
        dates: 'January 20 - February 18',
        essence: 'Innovative, humanitarian, and visionary — the water-bearer pouring wisdom for collective awakening.'
    },
    {
        name: 'Pisces',
        symbol: '♓',
        dates: 'February 19 - March 20',
        essence: 'Mystical, compassionate, and boundlessly creative — the dreamer swimming in oceans of cosmic consciousness.'
    }
];

// Read the template
const templatePath = '/tmp/zodiac-sign-template.html';
const template = fs.readFileSync(templatePath, 'utf8');

signs.forEach(sign => {
    // Replace placeholders in template
    let content = template;
    
    // Replace all instances of Aries with the current sign
    content = content.replace(/Aries Constellation/g, `${sign.name} Constellation`);
    content = content.replace(/Aries zodiac/g, `${sign.name} zodiac`);
    content = content.replace(/Aries spirit/g, `${sign.name} spirit`);
    content = content.replace(/Aries soul/g, `${sign.name} soul`);
    
    // Replace the symbol
    content = content.replace(/<div class="zodiac-icon">♈<\/div>/g, `<div class="zodiac-icon">${sign.symbol}</div>`);
    
    // Replace title and essence
    content = content.replace(/<h1>Aries<\/h1>/g, `<h1>${sign.name}</h1>`);
    content = content.replace(/Bold, pioneering, and fiercely independent — the warrior spirit of initiation and courage\./g, sign.essence);
    
    // Replace SIGN constant
    content = content.replace(/const SIGN = 'Aries';/g, `const SIGN = '${sign.name}';`);
    
    // Update active zodiac button
    content = content.replace(/href="aries\.html" class="zodiac-btn active"/g, `href="${sign.name.toLowerCase()}.html" class="zodiac-btn active"`);
    
    // Remove active from Aries button if not Aries
    if (sign.name !== 'Aries') {
        content = content.replace(/href="aries\.html" class="zodiac-btn"/g, `href="aries.html" class="zodiac-btn"`);
    }
    
    // Write the file
    const outputPath = path.join(__dirname, '../zodiac', `${sign.name.toLowerCase()}.html`);
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated ${sign.name.toLowerCase()}.html`);
});

console.log('\n🎉 All zodiac sign pages generated successfully!');
