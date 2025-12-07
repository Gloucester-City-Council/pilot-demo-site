/**
 * Gloucester City Council - Main JavaScript
 * Mobile menu and accessibility enhancements includes feedback
 */
(function() {
    'use strict';

    /**
     * Initialize Feedback Widget
     */
    function initFeedbackWidget() {
        const panel = document.querySelector('.feedback-panel');
        if (!panel) return;

        const buttons = panel.querySelectorAll('.feedback-btn');
        const form = panel.querySelector('#feedback-form');
        const thanks = panel.querySelector('#feedback-thanks');
        const prompt = panel.querySelector('#feedback-prompt');
        const commentsField = panel.querySelector('#feedback-comments');
        const emailField = panel.querySelector('#feedback-email');

        form.hidden = true;
        thanks.hidden = true;

        if (!buttons.length || !form || !thanks || !prompt || !commentsField || !emailField) {
            return;
        }

        let selectedRating = null;
        let selectedUI = null;

        // Set up event listeners for the thumbs up and thumbs down buttons
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                selectedRating = btn.getAttribute('data-rating');
                selectedUI = selectedRating === 'positive' ? 'thumbs_up' : 'thumbs_down';

                if (selectedRating === 'positive') {
                    prompt.textContent = 'What worked well? (optional)';
                } else {
                    prompt.textContent = 'What didn\'t work or could be improved? (optional)';
                }

                form.hidden = false;
                commentsField.focus();
            });
        });

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
                const response = await fetch('https://mango-water-07ff4bd03.3.azurestaticapps.net/api/submit-feedback', {
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
     * Initialize all functions when DOM is ready
     */
    function init() {
        initFeedbackWidget();
        console.log('Feedback widget initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
