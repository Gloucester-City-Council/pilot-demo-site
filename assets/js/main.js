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

// Handle form submission
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
                rating: selectedRating,
                uiChoice: selectedUI,
                comments: comments,
                email: email,
                journeyStage: 'after_attempt',
                userAgent: navigator.userAgent,
                referrer: document.referrer || null,
                source: 'static-site-v1',
                createdAt: new Date().toISOString()
            };

            console.log('Feedback event:', feedbackPayload);

            try {
                const response = await fetch('https://gcc-api-pilot.azurewebsites.net/api/submitFeedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-token': 'oije8u23984uoriwfjowei2398470' // Use your actual API token here
                    },
                    body: JSON.stringify(feedbackPayload)
                });

                if (!response.ok) {
                    throw new Error('Failed to submit feedback');
                }

                const result = await response.json();
                console.log('Feedback submitted successfully:', result);

                form.hidden = true;
                thanks.hidden = false;

                commentsField.value = '';
                emailField.value = '';
                selectedRating = null;
                selectedUI = null;

            } catch (error) {
                console.error('Error submitting feedback:', error);
                form.hidden = true;
                thanks.hidden = false;
            }
        });
    }

    
    /**
     * External Link Warning (Optional)
     */
    function markExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        
        links.forEach(function(link) {
            const hostname = link.hostname;
            
            if (hostname && hostname !== window.location.hostname) {
                link.setAttribute('rel', 'external noopener');
                link.setAttribute('target', '_blank');
                
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
        
        console.log('Gloucester City Council - Site initialized');
        console.log('Feedback widget initialized');
}
    

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
    
})();
