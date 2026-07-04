/* ============================================
   NOIR ÉLITE - Premium Interactions & Animations
   ============================================ */

// ============================================
// Navbar Scroll Effect
// ============================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

// Throttle scroll event for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = requestAnimationFrame(() => {
            handleNavbarScroll();
            scrollTimeout = null;
        });
    }
}, { passive: true });

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Active Navigation Link on Scroll
// ============================================
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveNavLink);
}, { passive: true });

// ============================================
// Scroll Reveal Engine (Intersection Observer)
// ============================================
const revealElements = document.querySelectorAll('.reveal-element');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay based on element position
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, index * 100); // 100ms stagger between elements
            
            // Stop observing once revealed
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all reveal elements
revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ============================================
// Image Loading Handler
// ============================================
const productImages = document.querySelectorAll('.product-image');

productImages.forEach(img => {
    // If image is already loaded
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        // Add loaded class when image finishes loading
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        // Handle loading errors
        img.addEventListener('error', () => {
            img.classList.add('loaded');
            console.warn(`Failed to load image: ${img.src}`);
        });
    }
});

// ============================================
// Shopping Cart Functionality
// ============================================
let cartCount = 0;
const cartBadge = document.getElementById('cartBadge');
const quickAddButtons = document.querySelectorAll('.quick-add-btn');

function updateCartBadge() {
    cartBadge.textContent = cartCount;
    
    // Add pulse animation
    cartBadge.classList.add('pulse');
    setTimeout(() => {
        cartBadge.classList.remove('pulse');
    }, 400);
}

quickAddButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productName = button.getAttribute('data-product');
        const btnText = button.querySelector('.btn-text');
        
        // Prevent multiple clicks
        if (button.classList.contains('added')) {
            return;
        }
        
        // Change button state
        button.classList.add('added');
        btnText.textContent = 'ADDED TO CART ✓';
        
        // Increment cart count
        cartCount++;
        updateCartBadge();
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.classList.remove('added');
            btnText.textContent = 'QUICK ADD +';
        }, 2000);
    });
});

// ============================================
// Contact Form Handler
// ============================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (name && email && message) {
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { name, email, message });
        
        // Show success feedback
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'MESSAGE SENT ✓';
        submitBtn.style.background = 'var(--color-accent-cyan)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    }
});

// ============================================
// Parallax Effect for Hero Section (Optional Enhancement)
// ============================================
const hero = document.querySelector('.hero');
let parallaxTimeout;

function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    
    if (scrolled < heroHeight) {
        const parallaxValue = scrolled * 0.5;
        hero.style.backgroundPositionY = `${parallaxValue}px`;
    }
}

window.addEventListener('scroll', () => {
    if (!parallaxTimeout) {
        parallaxTimeout = requestAnimationFrame(() => {
            handleParallax();
            parallaxTimeout = null;
        });
    }
}, { passive: true });

// ============================================
// Cursor Glow Effect (Premium Touch)
// ============================================
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
`;

document.body.appendChild(cursorGlow);

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// Smooth cursor follow animation
function animateCursor() {
    const speed = 0.1;
    currentX += (mouseX - currentX) * speed;
    currentY += (mouseY - currentY) * speed;
    
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Hide cursor glow on mobile devices
if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
}

// ============================================
// Performance Optimization: Debounce Resize
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any size-dependent values here if needed
        handleNavbarScroll();
    }, 250);
}, { passive: true });

// ============================================
// Initialize on Page Load
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    // Initial navbar state check
    handleNavbarScroll();
    
    // Trigger initial reveal check for elements already in view
    revealElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            element.classList.add('revealed');
            revealObserver.unobserve(element);
        }
    });
    
    console.log('%c NOIR ÉLITE ', 'background: #0052ff; color: #fff; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Luxury Men\'s Fashion ', 'color: #00d2ff; font-size: 12px;');
});

// ============================================
// Keyboard Navigation Enhancement
// ============================================
document.addEventListener('keydown', (e) => {
    // ESC key to close any modals or reset states
    if (e.key === 'Escape') {
        // Reset all quick add buttons
        quickAddButtons.forEach(button => {
            button.classList.remove('added');
            const btnText = button.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = 'QUICK ADD +';
            }
        });
    }
});

// ============================================
// Preload Critical Images
// ============================================
const criticalImages = [
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1920'
];

criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

// ============================================
// Service Worker Registration (For PWA - Optional)
// ============================================
if ('serviceWorker' in navigator) {
    // Uncomment below to enable service worker
    // navigator.serviceWorker.register('/sw.js').catch(err => {
    //     console.log('Service Worker registration failed:', err);
    // });
}

// ============================================
// Analytics Tracking (Placeholder)
// ============================================
function trackEvent(category, action, label) {
    // Google Analytics or other analytics implementation would go here
    console.log('Event tracked:', { category, action, label });
}

// Track quick add clicks
quickAddButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.getAttribute('data-product');
        trackEvent('Product', 'Quick Add', productName);
    });
});

// Track CTA button clicks
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        trackEvent('CTA', 'Click', 'Explore Collection');
    });
}

// ============================================
// Accessibility Enhancements
// ============================================

// Add focus styles for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
}, true);

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ============================================
// Export for testing (if using modules)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateCartBadge,
        cartCount
    };
}