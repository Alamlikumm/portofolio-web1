document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // INTERACTIVE GLOW EFFECT (Desktop Only)
    // ==========================================================================
    const interactiveGlow = document.getElementById('interactiveGlow');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (interactiveGlow && !isMobile) {
        document.addEventListener('mousemove', (e) => {
            // Make glow visible when mouse moves
            interactiveGlow.style.opacity = '1';
            
            // Set coordinates
            const x = e.clientX;
            const y = e.clientY;
            
            // Apply coordinates with offset (centered)
            interactiveGlow.style.left = `${x}px`;
            interactiveGlow.style.top = `${y}px`;
        });

        // Hide glow when mouse leaves the viewport
        document.addEventListener('mouseleave', () => {
            interactiveGlow.style.opacity = '0';
        });
    }

    // ==========================================================================
    // MOBILE MENU NAVIGATION
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is active
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ==========================================================================
    // SCROLLED HEADER EFFECT
    // ==========================================================================
    const header = document.querySelector('.main-header');
    
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Run initially in case page is loaded scrolled

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Unobserve after showing to prevent repeat trigger
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // SKILLS PROGRESS BAR ANIMATION ON SCROLL
    // ==========================================================================
    const skillsSection = document.getElementById('keahlian');
    const skillBarFills = document.querySelectorAll('.skill-bar-fill');

    if (skillsSection && skillBarFills.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger the animation for progress bars by copying the inline style set in HTML
                    skillBarFills.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        skillsObserver.observe(skillsSection);
    }

    // ==========================================================================
    // CONTACT FORM INTERACTIVITY
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Mengirim...</span>
                <div class="spinner-loader"></div>
            `;
            
            // Add custom spinner style inline if needed
            if (!document.getElementById('spinnerStyle')) {
                const style = document.createElement('style');
                style.id = 'spinnerStyle';
                style.innerHTML = `
                    .spinner-loader {
                        width: 16px;
                        height: 16px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-top-color: #fff;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Simulate form submission (e.g., API call)
            setTimeout(() => {
                // Hide form and show success message
                contactForm.style.opacity = '0';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    formSuccess.classList.add('active');
                }, 400);
            }, 1800);
        });
    }

    // ==========================================================================
    // SMOOTH SCROLL FOR INTERNAL NAV LINKS
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
