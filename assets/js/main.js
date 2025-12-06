/**
 * Gloucester City Council - Main JavaScript
 * Mobile menu and accessibility enhancements
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
