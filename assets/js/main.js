/**
 * Gloucester City Council - Main JavaScript
 * Mobile menu and accessibility enhancements includes feedback
 */

(function() {
    'use strict';
    
    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (!menuToggle || !navList) return;
        
        // Toggle menu on button click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navList.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            
            // Update button text
            menuToggle.textContent = isOpen ? 'Close' : 'Menu';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-nav')) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navList.classList.contains('is-open')) {
                closeMenu();
                menuToggle.focus();
            }
        });
        
        // Close menu when clicking nav links
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        
        function closeMenu() {
            navList.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = 'Menu';
        }
    }
    
    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    // Scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Focus target for accessibility
                    target.focus();
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    /**
     * Add feedback functions
     */
    function initFeedbackWidget() {
        // Expecting markup like:
        // <section class="feedback-panel"> ... </section>
        const panel = document.querySelector('.feedback-panel');
        if (!panel) return; // no widget on this page
        
        const buttons = panel.querySelectorAll('.feedback-btn');
        const form = panel.querySelector('#feedback-form');
        const thanks = panel.querySelector('#feedback-thanks');
        const prompt = panel.querySelector('#feedback-prompt');
        const commentsField = panel.querySelector('#feedback-comments');
        const emailField = panel.querySelector('#feedback-email');
        
        form.hidden = true;   // <-- force hide on load
        thanks.hidden = true;
        
        if (!buttons.length || !form || !thanks || !prompt || !commentsField || !emailField) {
            return; // widget not fully present, fail safely
        }
        
        let selectedRating = null;
        let selectedUI = null;
        
        // Handle thumb clicks
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                selectedRating = btn.getAttribute('data-rating');   // "positive" | "negative"
                selectedUI = selectedRating === 'positive' ? 'thumbs_up' : 'thumbs_down';
                
                // Update prompt text based on rating
                if (selectedRating === 'positive') {
                    prompt.textContent = 'What worked well? (optional)';
                } else {
                    prompt.textContent = 'What didn't work or could be improved? (optional)';
                }
                
                // Show form and focus comments
                form.hidden = false;
                commentsField.focus();
            });
        });
        
        // Handle submit
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!selectedRating) {
                console.warn('Feedback submitted without a rating – ignoring.');
                return;
            }
            
            const comments = commentsField.value.trim() || null;
            const email = emailField.value.trim() || null;
            
            const feedbackPayload = {
                pageUrl: window.location.href,
                serviceId: document.body.dataset.serviceId || 'unknown',
                rating: selectedRating,            // "positive" | "negative"
                uiChoice: selectedUI,             // "thumbs_up" | "thumbs_down"
                comments: comments,
                email: email,
                journeyStage: 'after_attempt',
                userAgent: navigator.userAgent,
                referrer: document.referrer || null,
                source: 'static-site-v1',
                createdAt: new Date().toISOString()
            };
            
            // Keep logging to console for debugging
            console.log('Feedback event:', feedbackPayload);
            
            try {
                const response = await fetch('https://mango-water-07ff4bd03.3.azurestaticapps.net/api/submit-feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-token': 'oije8u23984uoriwfjowei2398470'  // Replace with your actual token
                    },
                    body: JSON.stringify(feedbackPayload)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to submit feedback');
                }
                
                const result = await response.json();
                console.log('Feedback submitted successfully:', result);
                
                // Reset UI and show thanks
                form.hidden = true;
                thanks.hidden = false;
                
                // Reset form fields
                commentsField.value = '';
                emailField.value = '';
                selectedRating = null;
                selectedUI = null;
                
            } catch (error) {
                console.error('Error submitting feedback:', error);
                // Still show thanks message to user even if API fails
                form.hidden = true;
                thanks.hidden = false;
            }
        });
    }
    
    /**
     * External Link Warning (Optional)
     * Marks external links for screen readers
     */
    function markExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        
        links.forEach(function(link) {
            const hostname = link.hostname;
            
            // Check if link is external
            if (hostname && hostname !== window.location.hostname) {
                // Add visual indicator
                link.setAttribute('rel', 'external noopener');
                link.setAttribute('target', '_blank');
                
                // Add screen reader text
                const srText = document.createElement('span');
                srText.className = 'sr-only';
                srText.textContent = ' (opens in new window)';
                link.appendChild(srText);
            }
        });
    }
    
    /**
     * Add screen reader only class to CSS if not present
     */
    function addScreenReaderStyles() {
        if (document.querySelector('.sr-only')) return;
        
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Initialize all functions when DOM is ready
     */
    function init() {
        initMobileMenu();
        initSmoothScroll();
        initFeedbackWidget();
        // Uncomment if you want external link warnings
        // addScreenReaderStyles();
        // markExternalLinks();
        
        console.log('Gloucester City Council - Site initialized');
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
