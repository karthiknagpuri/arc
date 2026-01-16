/**
 * ÂRC Montenegro - Luxury Royal Edition
 * Refined Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initMobileMenu();
    initFormHandling();
    initSmoothScroll();
    initParallax();
});

/**
 * Navigation scroll behavior
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Form handling with elegant feedback
 */
function initFormHandling() {
    const form = document.getElementById('subscribeForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button');
        const originalText = button.textContent;

        if (input.value) {
            button.textContent = 'Thank you';
            button.style.background = '#b8860b';
            button.style.color = '#fff';
            input.value = '';
            input.blur();

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.style.color = '';
            }, 3000);
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Subtle parallax effect on hero
 */
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                if (scrolled < window.innerHeight) {
                    heroImage.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Gallery lightbox
 */
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-image');
        const caption = item.querySelector('.gallery-caption');

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${img.alt}">
                ${caption ? `<p class="lightbox-caption">${caption.textContent}</p>` : ''}
                <button class="lightbox-close">&times;</button>
            </div>
        `;

        // Lightbox styles
        Object.assign(lightbox.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        });

        const content = lightbox.querySelector('.lightbox-content');
        Object.assign(content.style, {
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            transform: 'scale(0.95)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        });

        const lightboxImg = lightbox.querySelector('img');
        Object.assign(lightboxImg.style, {
            maxWidth: '100%',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: '16px'
        });

        const captionEl = lightbox.querySelector('.lightbox-caption');
        if (captionEl) {
            Object.assign(captionEl.style, {
                textAlign: 'center',
                fontFamily: "'League Spartan', sans-serif",
                fontSize: '0.875rem',
                fontWeight: '300',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '1.5rem',
                letterSpacing: '0.02em'
            });
        }

        const closeBtn = lightbox.querySelector('.lightbox-close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '-50px',
            right: '0',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '2rem',
            cursor: 'pointer',
            transition: 'color 0.2s'
        });

        closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#fff');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = 'rgba(255, 255, 255, 0.5)');

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            lightbox.style.opacity = '1';
            content.style.transform = 'scale(1)';
        });

        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 400);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        }, { once: true });
    });
});

// Mobile menu animation
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }
    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
`;
document.head.appendChild(style);
