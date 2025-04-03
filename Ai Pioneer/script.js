document.addEventListener('DOMContentLoaded', () => {
    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const stickyNav = document.querySelector('.sticky-nav'); // Need this for offset calculation

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Change hamburger icon to 'X' and back
            mobileNavToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            mobileNavToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });

        // Close menu when a link is clicked (for single-page navigation)
        navLinks.querySelectorAll('a').forEach(link => {
            // Only add listener if the link points to a section on the same page
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileNavToggle.textContent = '☰';
                        mobileNavToggle.setAttribute('aria-expanded', 'false');
                    }
                    // Handle smooth scroll for mobile link clicks too
                    handleSmoothScroll(e, link.getAttribute('href'));
                });
            }
        });

        // Close menu if clicking outside the nav when it's open
        document.addEventListener('click', (event) => {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = mobileNavToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileNavToggle.textContent = '☰';
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Sticky Navigation Background on Scroll ---
    if (stickyNav) {
        let lastScrollY = window.pageYOffset; // Use pageYOffset for broader compatibility
        const navHeight = stickyNav.offsetHeight;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;

            // Add background effect based on scroll position
            if (currentScrollY > 50) {
                stickyNav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                stickyNav.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
            } else {
                stickyNav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'; // Initial semi-transparent
                stickyNav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        }, { passive: true }); // Use passive listener for performance
    }

    // --- Prompt Copy Button Functionality ---
    const copyButtons = document.querySelectorAll('.copy-prompt-button');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const promptText = button.getAttribute('data-prompt');
            if (!promptText) {
                console.error("No prompt text found in data-prompt attribute.");
                return;
            }

            navigator.clipboard.writeText(promptText).then(() => {
                // Success feedback
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                button.disabled = true; // Disable briefly

                // Revert after a short delay
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                    button.disabled = false; // Re-enable
                }, 1500); // Revert after 1.5 seconds

            }).catch(err => {
                // Error feedback
                console.error('Failed to copy prompt: ', err);
                const originalText = button.textContent;
                button.textContent = 'Error!';
                button.disabled = true;
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 1500);
            });
        });
    });

    // --- Basic Scroll Animation (Fade-in effect) ---
    const animatedElements = document.querySelectorAll('.value-item, .card, #cta-final .container > *, .footer-col'); // Select elements to animate

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observerInstance.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            root: null, // relative to the viewport
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(el => {
            el.classList.add('fade-in'); // Add initial state class
            observer.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        console.log("IntersectionObserver not supported, showing elements immediately.");
        animatedElements.forEach(el => {
            el.classList.add('visible'); // Add 'visible' class directly
            el.classList.remove('fade-in'); // Remove fade-in if no observer
        });
    }

    // --- Smooth Scroll Function ---
    function handleSmoothScroll(e, targetSelector) {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            e.preventDefault(); // Prevent default jump

            // Calculate position, considering sticky nav height
            const navHeight = stickyNav ? stickyNav.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            // Use pageYOffset for broader compatibility
            const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20; // Extra 20px padding

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth" // Smooth scroll
            });
        }
    }

    // --- Apply Smooth Scroll to Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Check if it's not just a placeholder '#'
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
            anchor.addEventListener('click', function (e) {
                handleSmoothScroll(e, href);
            });
        }
    });
});
