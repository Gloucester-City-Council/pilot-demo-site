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
        const panel = document.querySelector('.feedback-panel');
        if (!panel) return;
