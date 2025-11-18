/* --- LYRĪON Zero-Input Asset & Path Injector --- */

// NOTE: The paths must be absolutely correct for GitHub Pages
const ROOT_PATH = '/lyrion-co-uk/';

// Function to correct the stylesheet path on every page
function fixStylesheetPath() {
    const link = document.querySelector('link[rel="stylesheet"]');
    if (link && link.href.includes('assets/css/style.css')) {
        // Only fix if the path hasn't been fixed yet
        if (!link.href.includes(ROOT_PATH)) {
            link.href = ROOT_PATH + 'assets/css/style.css';
        }
    }
}

// Function to inject essential feature images (as provided by the user)
function injectEssentialAssets() {
    // Logo (Image 3) - Find the logo text and insert the image
    const logoDiv = document.querySelector('.logo a');
    if (logoDiv && !logoDiv.querySelector('img')) {
        const logoImg = new Image();
        logoImg.src = ROOT_PATH + 'assets/img/logo-circle.jpg';
        logoImg.alt = 'LYRĪON Logo';
        logoImg.style.height = '40px'; 
        logoImg.style.verticalAlign = 'middle';
        logoDiv.innerHTML = `<img src="${logoImg.src}" alt="${logoImg.alt}" style="${logoImg.style.cssText}"> ${logoDiv.textContent}`;
    }

    // Feature Images for Homepage (index.html)
    // Adult & Home (Image 4) - po.jpg
    const adultFeature = document.querySelector('img[alt="Adult Zodiac Apparel and Homeware"]');
    if (adultFeature) {
        adultFeature.src = ROOT_PATH + 'assets/img/po.jpg';
    }

    // Celestial Youth (Image 5) - kids-feature.jpg
    const kidsFeature = document.querySelector('img[alt="Celestial Youth Apparel (Moon Girls and Star Boys)"]');
    if (kidsFeature) {
        kidsFeature.src = ROOT_PATH + 'assets/img/kids-feature.jpg';
    }

    // Placeholder for Oracle art (Reusing Image 1 for mystic feel)
    const oracleArt = document.querySelector('img[alt="A celestial, mystical artwork representation"]');
    if (oracleArt) {
        oracleArt.src = ROOT_PATH + 'assets/img/blog-icon.jpg';
    }
}

// Function to ensure all image paths across the site are corrected after page load
function correctAllImagePaths() {
    document.querySelectorAll('img[src^="assets/img/"]').forEach(img => {
        // Correct path if it starts with the relative path
        if (!img.src.includes(ROOT_PATH)) {
            img.src = ROOT_PATH + img.getAttribute('src');
        }
    });
}

// Run fixes on load
document.addEventListener('DOMContentLoaded', () => {
    fixStylesheetPath();
    injectEssentialAssets();
    correctAllImagePaths();
    
    // Also correct the favicon path
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        favicon.href = ROOT_PATH + 'assets/img/favicon-sun.png';
    }
});
Final zero-input path and asset injector.
