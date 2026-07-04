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
        const targetId = link.getAttribute('href');
        
        // Check if it's an anchor link (starts with #)
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        // If it's a regular link (like index.html), let it navigate normally
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
let cart = [];
let cartCount = 0;
const cartBadge = document.getElementById('cartBadge');
const quickAddButtons = document.querySelectorAll('.quick-add-btn');

// Product data for cart
const products = {
    'Premium Wool Suit': {
        name: 'Premium Wool Suit',
        category: 'Formal Collection',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600'
    },
    'Italian Linen Blazer': {
        name: 'Italian Linen Blazer',
        category: 'Smart Casual',
        price: 1899,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600'
    },
    'Leather Bomber Jacket': {
        name: 'Leather Bomber Jacket',
        category: 'Outerwear',
        price: 3299,
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600'
    },
    'Cashmere Overcoat': {
        name: 'Cashmere Overcoat',
        category: 'Winter Collection',
        price: 4199,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
    }
};

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('noirEliteCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        updateCartBadge();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('noirEliteCart', JSON.stringify(cart));
}

// Update cart badge
function updateCartBadge() {
    cartBadge.textContent = cartCount;
    
    // Add pulse animation
    cartBadge.classList.add('pulse');
    setTimeout(() => {
        cartBadge.classList.remove('pulse');
    }, 400);
}

// Add item to cart
function addToCart(productName) {
    const product = products[productName];
    if (!product) return;
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    cartCount++;
    saveCart();
    updateCartBadge();
}

// Remove item from cart
function removeFromCart(productName) {
    const index = cart.findIndex(item => item.name === productName);
    if (index > -1) {
        cartCount -= cart[index].quantity;
        cart.splice(index, 1);
        saveCart();
        updateCartBadge();
    }
}

// Update item quantity
function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productName);
    } else {
        item.quantity = newQuantity;
        cartCount += change;
        saveCart();
        updateCartBadge();
        renderCart(); // Re-render cart to show updated quantities
    }
}

// Calculate cart totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

// Render cart page
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                </div>
                <h2 class="empty-cart-title">YOUR CART IS EMPTY</h2>
                <p class="empty-cart-text">Looks like you haven't added any items to your cart yet.</p>
                <a href="index.html#shop" class="back-to-shop">
                    CONTINUE SHOPPING
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        `;
        return;
    }
    
    const { subtotal, shipping, tax, total } = calculateTotals();
    
    let cartItemsHTML = '<div class="cart-items">';
    
    cart.forEach((item, index) => {
        cartItemsHTML += `
            <div class="cart-item reveal-element" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <p class="cart-item-price">$${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItemsHTML += '</div>';
    
    const summaryHTML = `
        <div class="cart-summary">
            <h2 class="summary-title">ORDER SUMMARY</h2>
            <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">$${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Shipping</span>
                <span class="summary-value">${shipping === 0 ? 'FREE' : '$' + shipping}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Tax (8%)</span>
                <span class="summary-value">$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-total">
                <span class="summary-total-label">TOTAL</span>
                <span class="summary-total-value">$${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="checkout-btn">
                PROCEED TO CHECKOUT
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
            <a href="index.html#shop" class="continue-shopping">← Continue Shopping</a>
        </div>
    `;
    
    cartContent.innerHTML = cartItemsHTML + summaryHTML;
    
    // Re-observe new reveal elements
    const newRevealElements = cartContent.querySelectorAll('.reveal-element');
    newRevealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) return;
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Render checkout page
function renderCheckout() {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) return;
    
    if (cart.length === 0) {
        checkoutContent.innerHTML = `
            <div class="empty-checkout">
                <div class="empty-checkout-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="16" y1="10" x2="16" y2="14"></line>
                        <line x1="12" y1="10" x2="12" y2="14"></line>
                        <line x1="8" y1="10" x2="8" y2="14"></line>
                    </svg>
                </div>
                <h2 class="empty-checkout-title">YOUR CART IS EMPTY</h2>
                <p class="empty-checkout-text">Add some items to your cart before checking out.</p>
                <a href="index.html#shop" class="back-to-shop">
                    CONTINUE SHOPPING
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        `;
        return;
    }
    
    const { subtotal, shipping, tax, total } = calculateTotals();
    
    const formSectionHTML = `
        <div class="checkout-form-section">
            <h2 class="form-section-title">SHIPPING INFORMATION</h2>
            <form id="checkoutForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" placeholder="John" required>
                        <span class="error-message">Please enter your first name</span>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" placeholder="Doe" required>
                        <span class="error-message">Please enter your last name</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="john@example.com" required>
                    <span class="error-message">Please enter a valid email</span>
                </div>
                
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" placeholder="123 Luxury Street" required>
                    <span class="error-message">Please enter your address</span>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" placeholder="New York" required>
                        <span class="error-message">Please enter your city</span>
                    </div>
                    <div class="form-group">
                        <label for="zip">ZIP Code</label>
                        <input type="text" id="zip" placeholder="10001" required>
                        <span class="error-message">Please enter your ZIP code</span>
                    </div>
                </div>
                
                <h2 class="form-section-title" style="margin-top: var(--spacing-lg);">PAYMENT METHOD</h2>
                
                <div class="payment-methods">
                    <div class="payment-option">
                        <input type="radio" id="creditCard" name="paymentMethod" value="creditCard" checked>
                        <label for="creditCard" class="payment-label">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                            <span>Credit Card</span>
                        </label>
                    </div>
                    
                    <div class="payment-option">
                        <input type="radio" id="cashOnDelivery" name="paymentMethod" value="cashOnDelivery">
                        <label for="cashOnDelivery" class="payment-label">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <span>Cash on Delivery</span>
                        </label>
                    </div>
                </div>
                
                <div id="creditCardFields">
                    <div class="form-group">
                        <label for="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                        <span class="error-message">Please enter a valid card number</span>
                        <div class="card-icons">
                            <div class="card-icon">VISA</div>
                            <div class="card-icon">MC</div>
                            <div class="card-icon">AMEX</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry">Expiry Date</label>
                            <input type="text" id="expiry" placeholder="MM/YY" maxlength="5">
                            <span class="error-message">Please enter expiry date</span>
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <input type="text" id="cvv" placeholder="123" maxlength="3">
                            <span class="error-message">Please enter CVV</span>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="purchase-btn">
                    COMPLETE PURCHASE
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </form>
        </div>
    `;
    
    const summaryHTML = `
        <div class="order-summary">
            <h2 class="summary-title">ORDER SUMMARY</h2>
            <div class="summary-items">
                ${cart.map(item => `
                    <div class="summary-item">
                        <span class="summary-item-name">${item.name}</span>
                        <span class="summary-item-quantity">x${item.quantity}</span>
                        <span class="summary-item-price">$${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
            <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">$${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Shipping</span>
                <span class="summary-value">${shipping === 0 ? 'FREE' : '$' + shipping}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Tax (8%)</span>
                <span class="summary-value">$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-total">
                <span class="summary-total-label">TOTAL</span>
                <span class="summary-total-value">$${total.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    checkoutContent.innerHTML = formSectionHTML + summaryHTML;
    
    // Add form validation and submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            if (validateForm()) {
                completePurchase();
            }
        });
    }
    
    // Payment method switching
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardFields = document.getElementById('creditCardFields');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'cashOnDelivery') {
                creditCardFields.classList.add('hidden');
                // Remove required attribute from credit card fields
                const cardFields = creditCardFields.querySelectorAll('input');
                cardFields.forEach(field => field.removeAttribute('required'));
            } else {
                creditCardFields.classList.remove('hidden');
                // Add required attribute back to credit card fields
                const cardFields = creditCardFields.querySelectorAll('input');
                cardFields.forEach(field => field.setAttribute('required', 'required'));
            }
        });
    });
}

// Form validation
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('#checkoutForm input[required]');
    
    requiredFields.forEach(field => {
        const errorMessage = field.nextElementSibling;
        
        if (!field.value.trim()) {
            field.classList.add('error');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.add('show');
            }
            isValid = false;
        } else {
            field.classList.remove('error');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.remove('show');
            }
        }
    });
    
    return isValid;
}

// Complete purchase
function completePurchase() {
    // Clear cart
    cart = [];
    cartCount = 0;
    saveCart();
    updateCartBadge();
    
    // Show success message
    showSuccessMessage();
    
    // Redirect to home page after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (!successMessage) return;
    
    successMessage.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

// Quick add button handlers
quickAddButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productName = button.getAttribute('data-product');
        const btnText = button.querySelector('.btn-text');
        
        // Prevent multiple clicks
        if (button.classList.contains('added')) {
            return;
        }
        
        // Add to cart
        addToCart(productName);
        
        // Change button state
        button.classList.add('added');
        btnText.textContent = 'ADDED TO CART ✓';
        
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
    // Load cart from localStorage
    loadCart();
    
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