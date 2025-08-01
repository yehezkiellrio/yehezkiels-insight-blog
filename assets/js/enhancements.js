/**
 * Enhancements for Yehezkiel's Insight Blog
 * Dark mode and back-to-top functionality
 */

(function() {
    'use strict';

    /**
     * Initialize dark mode functionality
     */
    function initDarkMode() {
        try {
            const toggleButton = document.getElementById('darkModeToggle');
            if (!toggleButton) return;

            // Load preference from localStorage
            const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
            if (darkModeEnabled) {
                document.documentElement.classList.add('dark-mode');
                toggleButton.textContent = 'Dark Mode On';
            } else {
                toggleButton.textContent = 'Dark Mode Off';
            }

            toggleButton.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark-mode');
                const isDark = document.documentElement.classList.contains('dark-mode');
                toggleButton.textContent = isDark ? 'Dark Mode On' : 'Dark Mode Off';
                localStorage.setItem('darkMode', isDark);
            });
        } catch (error) {
            console.error('Error initializing dark mode:', error);
        }
    }

    /**
     * Initialize back-to-top button
     */
    function initBackToTop() {
        try {
            const btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.textContent = '↑ Top';
            btn.setAttribute('aria-label', 'Back to top');
            
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            document.body.appendChild(btn);

            // Show/hide button based on scroll position
            function toggleBackToTop() {
                if (window.pageYOffset > 300) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
            }

            // Throttle scroll events for better performance
            let ticking = false;
            function throttledToggle() {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        toggleBackToTop();
                        ticking = false;
                    });
                    ticking = true;
                }
            }

            window.addEventListener('scroll', throttledToggle, { passive: true });
        } catch (error) {
            console.error('Error initializing back-to-top button:', error);
        }
    }

    /**
     * Initialize load more posts functionality
     */
    function initLoadMore() {
        try {
            const loadMoreBtn = document.getElementById('loadMorePosts');
            if (!loadMoreBtn) return;

            loadMoreBtn.addEventListener('click', () => {
                // Simulate loading more posts
                loadMoreBtn.textContent = 'Loading...';
                loadMoreBtn.disabled = true;

                setTimeout(() => {
                    loadMoreBtn.textContent = 'No more posts to load';
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.style.opacity = '0.6';
                }, 1500);
            });
        } catch (error) {
            console.error('Error initializing load more:', error);
        }
    }

    /**
     * Initialize all enhancements
     */
    function init() {
        try {
            initDarkMode();
            initBackToTop();
            initLoadMore();
            console.log('Blog enhancements initialized successfully');
        } catch (error) {
            console.error('Error initializing enhancements:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
