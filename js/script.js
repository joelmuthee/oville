document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
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



    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .accreditations .logo-item');
    animatedElements.forEach(el => observer.observe(el));

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

        // Profile Modal Handling
        const profileModal = document.getElementById('custom-ghl-modal');
        const profileBtn = document.querySelector('.btn-ghl-popup');
        const closeProfileBtn = document.querySelector('.custom-ghl-modal-close');

        if (profileBtn && profileModal) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                profileModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeProfileBtn && profileModal) {
            closeProfileBtn.addEventListener('click', () => {
                profileModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });

            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    profileModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });

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
        }, 5000);
    });
});
