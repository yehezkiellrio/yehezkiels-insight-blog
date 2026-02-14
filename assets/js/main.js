/**
 * Main JavaScript file for Yehezkiel's Insight Blog
 * Handles interactivity, search functionality, and user experience enhancements
 */

(function() {
    'use strict';

    // DOM elements
    let header = null;
    let searchInput = null;
    let postCards = null;
    let subscriptionForm = null;
    let emailInput = null;

    // State
    let isScrolled = false;
    let searchTimeout = null;

    /**
     * Initialize the application when DOM is loaded
     */
    function init() {
        try {
            // Get DOM elements
            header = document.getElementById('header');
            searchInput = document.getElementById('searchInput');
            postCards = document.querySelectorAll('.post-card');
            subscriptionForm = document.getElementById('subscriptionForm');
            emailInput = document.getElementById('emailInput');

            // Initialize features
            initStickyHeader();
            initSearch();
            initSubscriptionForm();
            initSmoothScrolling();
            initAnimations();

            console.log('Yehezkiel\'s Insight Blog initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }

    /**
     * Initialize sticky header functionality
     */
    function initStickyHeader() {
        try {
            if (!header) return;

            function handleScroll() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const shouldBeScrolled = scrollTop > 50;

                if (shouldBeScrolled !== isScrolled) {
                    isScrolled = shouldBeScrolled;
                    header.classList.toggle('scrolled', isScrolled);
                }
            }

            // Throttle scroll events for better performance
            let ticking = false;
            function throttledScroll() {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            }

            window.addEventListener('scroll', throttledScroll, { passive: true });
        } catch (error) {
            console.error('Error initializing sticky header:', error);
        }
    }

    /**
     * Initialize search functionality
     */
    function initSearch() {
        try {
            if (!searchInput || !postCards.length) return;

            function performSearch(query) {
                const searchTerm = query.toLowerCase().trim();
                let visibleCount = 0;

                postCards.forEach(card => {
                    const title = card.querySelector('.post-title a');
                    const excerpt = card.querySelector('.post-excerpt');
                    
                    if (!title) return;

                    const titleText = title.textContent.toLowerCase();
                    const excerptText = excerpt ? excerpt.textContent.toLowerCase() : '';
                    
                    const isMatch = searchTerm === '' || 
                                  titleText.includes(searchTerm) || 
                                  excerptText.includes(searchTerm);

                    if (isMatch) {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-in');
                    }
                });

                // Show/hide no results message
                updateSearchResults(visibleCount, searchTerm);
            }

            function updateSearchResults(count, searchTerm) {
                // Remove existing no results message
                const existingMessage = document.querySelector('.no-results-message');
                if (existingMessage) {
                    existingMessage.remove();
                }

                // Add no results message if needed
                if (count === 0 && searchTerm !== '') {
                    const message = document.createElement('div');
                    message.className = 'no-results-message';
                    message.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                            <h3>No posts found</h3>
                            <p>Try searching with different keywords.</p>
                        </div>
                    `;
                    
                    const postsSection = document.querySelector('.posts-section');
                    if (postsSection) {
                        postsSection.appendChild(message);
                    }
                }
            }

            // Handle search input with debouncing
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(e.target.value);
                }, 300);
            });

            // Handle search input focus
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });

        } catch (error) {
            console.error('Error initializing search:', error);
        }
    }

    /**
     * Initialize subscription form
     */
    function initSubscriptionForm() {
        try {
            if (!subscriptionForm || !emailInput) return;

            subscriptionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                
                if (!isValidEmail(email)) {
                    showMessage('Please enter a valid email address.', 'error');
                    return;
                }

                // Simulate subscription process
                const submitButton = subscriptionForm.querySelector('.subscribe-btn');
                const originalText = submitButton.textContent;
                
                submitButton.textContent = 'Subscribing...';
                submitButton.disabled = true;

                setTimeout(() => {
                    showMessage('Thank you for subscribing! You\'ll receive updates soon.', 'success');
                    emailInput.value = '';
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 1500);
            });

        } catch (error) {
            console.error('Error initializing subscription form:', error);
        }
    }

    /**
     * Validate email address
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show message to user
     */
    function showMessage(message, type = 'info') {
        try {
            // Remove existing messages
            const existingMessages = document.querySelectorAll('.user-message');
            existingMessages.forEach(msg => msg.remove());

            // Create new message
            const messageEl = document.createElement('div');
            messageEl.className = `user-message user-message--${type}`;
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                font-size: 0.9rem;
            `;
            messageEl.textContent = message;

            // Add animation styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(messageEl);

            // Auto remove after 5 seconds
            setTimeout(() => {
                messageEl.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            }, 5000);

        } catch (error) {
            console.error('Error showing message:', error);
        }
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        try {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link) return;

                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        } catch (error) {
            console.error('Error initializing smooth scrolling:', error);
        }
    }

    /**
     * Initialize animations and intersection observer
     */
    function initAnimations() {
        try {
            // Intersection Observer for fade-in animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe post cards
            postCards.forEach(card => {
                observer.observe(card);
            });

            // Observe sidebar widgets
            const sidebarWidgets = document.querySelectorAll('.sidebar-widget');
            sidebarWidgets.forEach(widget => {
                observer.observe(widget);
            });

        } catch (error) {
            console.error('Error initializing animations:', error);
        }
    }

    /**
     * Handle keyboard navigation
     */
    function initKeyboardNavigation() {
        try {
            document.addEventListener('keydown', (e) => {
                // ESC key to clear search
                if (e.key === 'Escape' && searchInput && document.activeElement === searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input'));
                    searchInput.blur();
                }

                // Ctrl/Cmd + K to focus search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    if (searchInput) {
                        searchInput.focus();
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing keyboard navigation:', error);
        }
    }

    /**
     * Handle errors gracefully
     */
    function handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // In production, you might want to send errors to a logging service
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'exception', {
                description: `${context}: ${error.message}`,
                fatal: false
            });
        }
    }

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Initialize keyboard navigation
    initKeyboardNavigation();

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, pause any animations or timers if needed
        } else {
            // Page is visible again
        }
    });

    // Expose some functions globally for debugging (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.YHZBlog = {
            showMessage,
            handleError
        };
    }
// --- KODE AMPUH DARK MODE (Start) ---
    function initGlobalDarkMode() {
        // 1. Cek memori browser: Apakah user pilih Dark Mode?
        const isDark = localStorage.getItem('darkMode') === 'true';
        
        // 2. Langsung terapkan gelap/terang ke HTML (tanpa nunggu tombol)
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }

        // 3. Kalau ada tombolnya, kita update teksnya (biar sinkron)
        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = isDark ? 'Dark Mode On' : 'Dark Mode Off';
            
            // Tambahkan fungsi klik
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault(); // Mencegah loncat ke atas
                document.documentElement.classList.toggle('dark-mode');
                const isNowDark = document.documentElement.classList.contains('dark-mode');
                
                // Simpan pilihan baru ke memori
                localStorage.setItem('darkMode', isNowDark);
                
                // Update teks tombol
                this.textContent = isNowDark ? 'Dark Mode On' : 'Dark Mode Off';
            });
        }
    }

    // Jalankan fungsi ini segera
    initGlobalDarkMode();
    // --- KODE AMPUH DARK MODE (End) ---
})();
