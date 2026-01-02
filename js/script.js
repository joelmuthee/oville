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

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Gallery Lightbox
    const lightbox = document.getElementById('lightbox');
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

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

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

    // View All Projects Button
    const viewAllBtn = document.getElementById('view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.hidden-item');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden-item');
                // Trigger animation if observer has already run? 
                // Since they were hidden, observer might not have caught them or they might need manual trigger.
                // But generally removing display:none should trigger layout and intersection observer if applicable.
            });
            viewAllBtn.style.display = 'none';
        });
    }
});
