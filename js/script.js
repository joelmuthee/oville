document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else if (!navMenu.classList.contains('active')) {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';

            // Force solid navbar background when menu is open on mobile
            if (navMenu.classList.contains('active')) {
                navbar.classList.add('scrolled');
            } else if (window.scrollY <= 20) {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Dropdown Toggle
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 968) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Dynamic Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }



    // Scroll Animations (Intersection Observer - Bidirectional)
    const observerOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -5% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Bidirectional: Remove class when element is out of view
                // Only remove if it's below the viewport to avoid flickering at the top
                const rect = entry.target.getBoundingClientRect();
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, observerOptions);

    // Observe all animateable elements
    const observeAll = () => {
        const animatedElements = document.querySelectorAll('.fade-in-up, .accreditations .logo-item, .service-card, .philosophy-item, .team-member-card, .client-item, .compliance-card, .feature-item');
        animatedElements.forEach(el => {
            observer.observe(el);
            // Check immediately if it's already in view
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    };
    observeAll();

    // Gallery Lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        const lightboxCaption = document.getElementById('lightbox-caption');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');

        let currentIndex = 0;

        const showImage = (index) => {
            if (index >= 0 && index < galleryItems.length) {
                const item = galleryItems[index];
                const img = item.querySelector('img');
                const overlay = item.querySelector('.gallery-overlay');

                if (img) {
                    const imgSrc = img.getAttribute('src');
                    lightboxImg.setAttribute('src', imgSrc);

                    // Capture caption
                    if (overlay && lightboxCaption) {
                        const title = overlay.querySelector('h5') ? overlay.querySelector('h5').innerText : '';
                        const desc = overlay.querySelector('p') ? overlay.querySelector('p').innerText : '';
                        lightboxCaption.innerHTML = `<h5>${title}</h5><p>${desc}</p>`;
                    } else if (lightboxCaption) {
                        lightboxCaption.innerHTML = '';
                    }

                    currentIndex = index;
                }
            }
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                showImage(index);
                lightbox.classList.add('active');
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Keyboard navigation (Escape Only)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            }
        });
    }

    // View All Projects Button
    const viewAllBtn = document.getElementById('view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.hidden-item');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden-item');
            });
            viewAllBtn.style.display = 'none';
        });
    }

    // View All Clients Button
    const viewAllClientsBtn = document.getElementById('view-all-clients-btn');
    if (viewAllClientsBtn) {
        viewAllClientsBtn.addEventListener('click', () => {
            const hiddenClients = document.querySelectorAll('.hidden-client-item');
            hiddenClients.forEach(item => {
                item.classList.remove('hidden-client-item');
            });
            viewAllClientsBtn.style.display = 'none';
        });
    }

    // Team Read More Toggle
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const bio = btn.previousElementSibling;

            if (bio.classList.contains('expanded')) {
                bio.classList.remove('expanded');
                btn.textContent = 'Read More';
            } else {
                bio.classList.add('expanded');
                btn.textContent = 'Read Less';
            }
        });

    });

    // Profile Modal Background Close Handling
    const profileModal = document.getElementById('custom-ghl-modal');

    // Close on clicking outside the content
    if (profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Simple Slider
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slider-slide');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        const dots = slider.querySelectorAll('.dot');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextIndex = (currentSlide + 1) % slides.length;
                showSlide(nextIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(prevIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Auto slide
        setInterval(() => {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }, 6000);
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const duration = 2000; // Total duration in ms

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    counter.innerText = Math.floor(progress * target);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        counter.innerText = target;
                    }
                };
                window.requestAnimationFrame(step);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });

    // Mobile Scroll Focus (Bidirectional)
    const cardsToFocus = document.querySelectorAll('.service-card, .philosophy-item, .team-member-card, .compliance-card, .client-item');

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            let closestCard = null;
            let minDistance = Infinity;

            cardsToFocus.forEach(card => {
                const box = card.getBoundingClientRect();
                const viewportCenter = window.innerHeight / 2;
                const cardCenter = box.top + box.height / 2;
                const distance = Math.abs(cardCenter - viewportCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

            cardsToFocus.forEach(card => {
                // Only focus cards that are already visible in the viewport flow
                const isVisible = card.classList.contains('visible') || window.getComputedStyle(card).opacity > 0;
                if (card === closestCard && minDistance < window.innerHeight * 0.3 && isVisible) {
                    card.classList.add('focused');
                } else {
                    card.classList.remove('focused');
                }
            });
        }
    });

    // Open Profile Widget via URL Hash (#request-profile)
    const openProfileWidget = () => {
        if (window.location.hash === '#request-profile') {
            const targetSection = document.getElementById('request-profile');
            if (targetSection) {
                // Ensure browser scrolls to target section first
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Wait for smooth scroll to complete before popping modal
                setTimeout(() => {
                    if (profileModal) {
                        profileModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        
                        // Send tracking event if gtag is defined
                        if (typeof gtag === 'function') {
                            gtag('event', 'request_profile_hash_open', { 
                                'event_category': 'engagement', 
                                'event_label': 'Direct Hash Link' 
                            });
                        }
                    }
                }, 800);
            }
        }
    };

    // Check on load
    openProfileWidget();

    // Check on hash change
    window.addEventListener('hashchange', openProfileWidget);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

});

// Handle Profile Widget Opening (Moved outside DOMContentLoaded to wait for images)
window.addEventListener('load', () => {
    const profileModal = document.getElementById('custom-ghl-modal');

    const openProfileWidget = () => {
        if (window.location.hash === '#request-profile') {
            const targetSection = document.getElementById('request-profile');
            if (targetSection) {
                // Smooth scroll to fixed section
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Open Modal after scroll
                setTimeout(() => {
                    if (profileModal) {
                        profileModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        if (typeof gtag === 'function') {
                            gtag('event', 'request_profile_hash_open', { 'event_category': 'engagement', 'event_label': 'Direct Hash Link' });
                        }
                    }
                }, 1000);
            }
        }
    };

    openProfileWidget();
    window.addEventListener('hashchange', openProfileWidget);
});
