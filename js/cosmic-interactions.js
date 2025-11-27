/**
 * LYRĪON Cosmic Interactions
 * 
 * JavaScript for smooth page transitions, micro-animations,
 * and cosmic-themed loading states.
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const COSMIC_CONFIG = {
        loadingMessages: [
            'Aligning the stars...',
            'Consulting the cosmos...',
            'Reading the celestial map...',
            'Tuning into cosmic frequencies...',
            'Gathering stardust...',
            'Channeling lunar energy...',
            'Decoding constellation patterns...',
            'Harmonizing with the universe...'
        ],
        transitionDuration: 400,
        revealThreshold: 0.15,
        enablePageTransitions: true,
        enableScrollReveal: true,
        enableLoadingStates: true
    };

    // ============================================
    // LOADING STATE MANAGER
    // ============================================
    
    const CosmicLoader = {
        overlay: null,
        textElement: null,
        messageInterval: null,

        /**
         * Initialize the cosmic loading overlay
         */
        init: function() {
            this.createOverlay();
        },

        /**
         * Create the loading overlay element
         */
        createOverlay: function() {
            if (document.getElementById('cosmic-loading-overlay')) return;

            const overlay = document.createElement('div');
            overlay.id = 'cosmic-loading-overlay';
            overlay.className = 'cosmic-loading-overlay';
            overlay.innerHTML = `
                <div class="cosmic-loading-container">
                    <div class="cosmic-loader">
                        <div class="cosmic-loader-center"></div>
                    </div>
                    <p class="cosmic-loading-text" id="cosmic-loading-text">Aligning the stars...</p>
                </div>
            `;
            document.body.appendChild(overlay);
            
            this.overlay = overlay;
            this.textElement = document.getElementById('cosmic-loading-text');
        },

        /**
         * Show the loading overlay with rotating messages
         * @param {string} customMessage - Optional custom loading message
         */
        show: function(customMessage) {
            if (!this.overlay) this.init();
            
            if (customMessage) {
                this.textElement.textContent = customMessage;
            } else {
                this.rotateMessages();
            }
            
            this.overlay.classList.add('active');
        },

        /**
         * Hide the loading overlay
         */
        hide: function() {
            if (!this.overlay) return;
            
            this.overlay.classList.remove('active');
            this.stopMessageRotation();
        },

        /**
         * Rotate through loading messages
         */
        rotateMessages: function() {
            let index = 0;
            const messages = COSMIC_CONFIG.loadingMessages;
            
            this.textElement.textContent = messages[0];
            
            this.messageInterval = setInterval(() => {
                index = (index + 1) % messages.length;
                this.textElement.textContent = messages[index];
            }, 2000);
        },

        /**
         * Stop the message rotation
         */
        stopMessageRotation: function() {
            if (this.messageInterval) {
                clearInterval(this.messageInterval);
                this.messageInterval = null;
            }
        },

        /**
         * Get a random loading message
         * @returns {string} Random cosmic loading message
         */
        getRandomMessage: function() {
            const messages = COSMIC_CONFIG.loadingMessages;
            return messages[Math.floor(Math.random() * messages.length)];
        }
    };

    // ============================================
    // PAGE TRANSITIONS
    // ============================================
    
    const PageTransitions = {
        wipeOverlay: null,

        /**
         * Initialize page transitions
         */
        init: function() {
            if (!COSMIC_CONFIG.enablePageTransitions) return;
            
            this.createWipeOverlay();
            this.bindLinkHandlers();
        },

        /**
         * Create the celestial wipe overlay
         */
        createWipeOverlay: function() {
            if (document.getElementById('celestial-wipe-overlay')) return;

            const overlay = document.createElement('div');
            overlay.id = 'celestial-wipe-overlay';
            overlay.className = 'celestial-wipe-overlay';
            document.body.appendChild(overlay);
            
            this.wipeOverlay = overlay;
        },

        /**
         * Bind click handlers to internal links
         */
        bindLinkHandlers: function() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                
                if (!link) return;
                
                const href = link.getAttribute('href');
                
                // Skip external links, hash links, and potentially dangerous/special links
                if (!href || 
                    href.startsWith('http') || 
                    href.startsWith('#') || 
                    href.startsWith('mailto:') ||
                    href.startsWith('tel:') ||
                    href.startsWith('javascript:') ||
                    href.startsWith('data:') ||
                    href.startsWith('vbscript:') ||
                    link.hasAttribute('download') ||
                    link.getAttribute('target') === '_blank') {
                    return;
                }
                
                e.preventDefault();
                this.navigateTo(href);
            });
        },

        /**
         * Navigate to a new page with transition
         * @param {string} url - The URL to navigate to
         */
        navigateTo: function(url) {
            if (!this.wipeOverlay) this.createWipeOverlay();
            
            // Start transition
            this.wipeOverlay.classList.add('active');
            
            // Navigate after transition
            setTimeout(() => {
                window.location.href = url;
            }, COSMIC_CONFIG.transitionDuration);
        }
    };

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    
    const ScrollReveal = {
        observer: null,

        /**
         * Initialize scroll reveal animations
         */
        init: function() {
            if (!COSMIC_CONFIG.enableScrollReveal) return;
            
            // Create intersection observer
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    threshold: COSMIC_CONFIG.revealThreshold,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            // Observe all reveal elements
            this.observeElements();
        },

        /**
         * Handle intersection events
         * @param {IntersectionObserverEntry[]} entries - Intersection entries
         */
        handleIntersection: function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    this.observer.unobserve(entry.target);
                }
            });
        },

        /**
         * Observe elements with reveal classes
         */
        observeElements: function() {
            const revealElements = document.querySelectorAll('.cosmic-reveal, .cosmic-reveal-stagger');
            revealElements.forEach(el => this.observer.observe(el));
        },

        /**
         * Manually add an element to observe
         * @param {HTMLElement} element - Element to observe
         */
        observe: function(element) {
            if (this.observer && element) {
                this.observer.observe(element);
            }
        }
    };

    // ============================================
    // MICRO ANIMATIONS
    // ============================================
    
    const MicroAnimations = {
        /**
         * Initialize micro animations
         */
        init: function() {
            this.initStarTwinkle();
            this.initButtonEffects();
        },

        /**
         * Initialize star twinkle effects
         */
        initStarTwinkle: function() {
            const stars = document.querySelectorAll('.star-twinkle');
            stars.forEach((star, index) => {
                // Add random delay for natural effect
                star.style.animationDelay = (Math.random() * 2) + 's';
            });
        },

        /**
         * Initialize button click effects
         */
        initButtonEffects: function() {
            document.addEventListener('click', (e) => {
                const button = e.target.closest('button, .button-primary, .button-gold, .button-secondary');
                if (button) {
                    button.classList.add('cosmic-click-effect');
                    setTimeout(() => {
                        button.classList.remove('cosmic-click-effect');
                    }, 300);
                }
            });
        },

        /**
         * Create a star burst effect at a position
         * @param {number} x - X coordinate
         * @param {number} y - Y coordinate
         */
        createStarBurst: function(x, y) {
            const stars = ['✦', '✧', '⋆', '★'];
            
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('span');
                star.textContent = stars[Math.floor(Math.random() * stars.length)];
                
                // Calculate angle and distance using JavaScript for browser compatibility
                const angle = ((i * 72) + Math.random() * 30) * (Math.PI / 180);
                const distance = 50 + Math.random() * 30;
                const translateX = Math.cos(angle) * distance;
                const translateY = Math.sin(angle) * distance;
                
                star.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    color: #C4A449;
                    font-size: ${12 + Math.random() * 10}px;
                    pointer-events: none;
                    z-index: 99999;
                    animation: starBurstFly${i} 0.6s ease-out forwards;
                `;
                
                // Create unique keyframe for each star with pre-calculated values
                const keyframeId = `starBurstFly${i}`;
                if (!document.getElementById(keyframeId)) {
                    const style = document.createElement('style');
                    style.id = keyframeId;
                    style.textContent = `
                        @keyframes ${keyframeId} {
                            0% { opacity: 1; transform: translate(0, 0) scale(1); }
                            100% { opacity: 0; transform: translate(${translateX}px, ${translateY}px) scale(0.5); }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                document.body.appendChild(star);
                
                setTimeout(() => star.remove(), 600);
            }
        }
    };

    // ============================================
    // BUTTON LOADING STATES
    // ============================================
    
    const ButtonLoader = {
        /**
         * Set a button to loading state
         * @param {HTMLElement} button - Button element
         * @param {string} loadingText - Optional loading text
         */
        start: function(button, loadingText) {
            if (!button) return;
            
            button.dataset.originalText = button.textContent;
            button.classList.add('button-loading');
            button.disabled = true;
            
            if (loadingText) {
                button.textContent = loadingText;
            }
        },

        /**
         * Remove loading state from button
         * @param {HTMLElement} button - Button element
         */
        stop: function(button) {
            if (!button) return;
            
            button.classList.remove('button-loading');
            button.disabled = false;
            
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
                delete button.dataset.originalText;
            }
        }
    };

    // ============================================
    // CONSTELLATION DRAWING
    // ============================================
    
    const ConstellationDrawer = {
        /**
         * Draw a constellation from points
         * @param {HTMLElement} container - Container for the SVG
         * @param {Array<{x: number, y: number}>} points - Array of point coordinates
         * @param {Object} options - Drawing options
         */
        draw: function(container, points, options = {}) {
            const defaults = {
                width: 200,
                height: 200,
                starSize: 4,
                lineColor: 'rgba(196, 164, 73, 0.4)',
                starColor: '#C4A449',
                animated: true
            };
            
            const settings = { ...defaults, ...options };
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', settings.width);
            svg.setAttribute('height', settings.height);
            svg.setAttribute('viewBox', `0 0 ${settings.width} ${settings.height}`);
            svg.classList.add('constellation-interactive');
            
            // Draw lines
            for (let i = 0; i < points.length - 1; i++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', points[i].x);
                line.setAttribute('y1', points[i].y);
                line.setAttribute('x2', points[i + 1].x);
                line.setAttribute('y2', points[i + 1].y);
                line.setAttribute('stroke', settings.lineColor);
                line.setAttribute('stroke-width', '1.5');
                
                if (settings.animated) {
                    line.classList.add('constellation-line');
                }
                
                svg.appendChild(line);
            }
            
            // Draw stars
            points.forEach(point => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', point.x);
                circle.setAttribute('cy', point.y);
                circle.setAttribute('r', settings.starSize);
                circle.setAttribute('fill', settings.starColor);
                
                if (settings.animated) {
                    circle.classList.add('constellation-star');
                }
                
                svg.appendChild(circle);
            });
            
            container.appendChild(svg);
            return svg;
        }
    };

    // ============================================
    // PUBLIC API
    // ============================================
    
    window.LyrionCosmic = {
        // Loading states
        showLoading: function(message) {
            CosmicLoader.show(message);
        },
        
        hideLoading: function() {
            CosmicLoader.hide();
        },
        
        getLoadingMessage: function() {
            return CosmicLoader.getRandomMessage();
        },
        
        // Button loading
        setButtonLoading: function(button, loadingText) {
            ButtonLoader.start(button, loadingText);
        },
        
        clearButtonLoading: function(button) {
            ButtonLoader.stop(button);
        },
        
        // Page transitions
        navigateTo: function(url) {
            PageTransitions.navigateTo(url);
        },
        
        // Scroll reveal
        observeElement: function(element) {
            ScrollReveal.observe(element);
        },
        
        // Animations
        createStarBurst: function(x, y) {
            MicroAnimations.createStarBurst(x, y);
        },
        
        // Constellation drawing
        drawConstellation: function(container, points, options) {
            return ConstellationDrawer.draw(container, points, options);
        },
        
        // Configuration
        config: COSMIC_CONFIG
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        // Initialize all modules
        CosmicLoader.init();
        PageTransitions.init();
        ScrollReveal.init();
        MicroAnimations.init();
        
        console.log('✦ LYRĪON Cosmic Interactions initialized');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
