/**
 * PIA Website - Interactive JavaScript
 * Vanilla JavaScript - No Frameworks/Libraries
 * Accessibility Compliant (WCAG 2.1 AA)
 */

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'success', 'error', or default
 */
function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toast.classList.remove('toast-success', 'toast-error');
    if (type === 'success') toast.classList.add('toast-success');
    if (type === 'error') toast.classList.add('toast-error');
    
    toastMessage.textContent = message;
    toast.hidden = false;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        toast.hidden = true;
    }, 4000);
}

/**
 * Close toast notification
 */
function closeToast() {
    const toast = document.getElementById('toast');
    toast.hidden = true;
}

// ===========================================
// HEADER & NAVIGATION
// ===========================================

/**
 * Initialize header scroll effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.setAttribute('aria-hidden', isExpanded);
        menu.classList.toggle('active', !isExpanded);
        
        // Update button label for accessibility
        toggle.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
    });
    
    // Initialize mobile submenu toggles
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isExpanded = link.getAttribute('aria-expanded') === 'true';
            link.setAttribute('aria-expanded', !isExpanded);
            
            const submenu = link.nextElementSibling;
            if (submenu && submenu.classList.contains('mobile-submenu')) {
                submenu.classList.toggle('active', !isExpanded);
            }
        });
    });
}

/**
 * Initialize desktop dropdown navigation
 */
function initDesktopNav() {
    const navItems = document.querySelectorAll('.nav-item.has-dropdown');
    
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown-menu');
        
        if (!link || !dropdown) return;
        
        // Keyboard navigation
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = link.getAttribute('aria-expanded') === 'true';
                link.setAttribute('aria-expanded', !isExpanded);
            }
            
            if (e.key === 'Escape') {
                link.setAttribute('aria-expanded', 'false');
                link.focus();
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!item.contains(e.target)) {
                link.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// ===========================================
// BOOKING WIDGET
// ===========================================

/**
 * Initialize booking tabs functionality
 */
function initBookingTabs() {
    const tabs = document.querySelectorAll('.booking-tab');
    const panels = document.querySelectorAll('.booking-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Update panels
            const targetId = tab.getAttribute('aria-controls');
            panels.forEach(panel => {
                const isTarget = panel.id === targetId;
                panel.classList.toggle('active', isTarget);
                panel.hidden = !isTarget;
            });
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', (e) => {
            const tabList = Array.from(tabs);
            const currentIndex = tabList.indexOf(tab);
            let newIndex;
            
            if (e.key === 'ArrowRight') {
                newIndex = (currentIndex + 1) % tabList.length;
            } else if (e.key === 'ArrowLeft') {
                newIndex = (currentIndex - 1 + tabList.length) % tabList.length;
            } else if (e.key === 'Home') {
                newIndex = 0;
            } else if (e.key === 'End') {
                newIndex = tabList.length - 1;
            }
            
            if (newIndex !== undefined) {
                e.preventDefault();
                tabList[newIndex].focus();
                tabList[newIndex].click();
            }
        });
    });
}

/**
 * Initialize trip type toggle (show/hide return date)
 */
function initTripTypeToggle() {
    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    const returnDateField = document.getElementById('return-date-field');
    
    if (!returnDateField) return;
    
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'roundtrip') {
                returnDateField.style.display = 'block';
            } else {
                returnDateField.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize airport swap functionality
 */
function initAirportSwap() {
    const swapBtn = document.getElementById('swap-airports');
    const fromSelect = document.getElementById('from-airport');
    const toSelect = document.getElementById('to-airport');
    
    if (!swapBtn || !fromSelect || !toSelect) return;
    
    swapBtn.addEventListener('click', () => {
        const tempValue = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = tempValue;
        
        // Announce swap for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = 'Airports swapped';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    });
}

/**
 * Initialize flight search form
 */
function initFlightForm() {
    const form = document.getElementById('flight-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fromAirport = document.getElementById('from-airport').value;
        const toAirport = document.getElementById('to-airport').value;
        const departDate = document.getElementById('depart-date').value;
        
        // Validation
        if (!fromAirport || !toAirport) {
            showToast('Please select departure and arrival airports', 'error');
            return;
        }
        
        if (!departDate) {
            showToast('Please select a departure date', 'error');
            return;
        }
        
        if (fromAirport === toAirport) {
            showToast('Departure and arrival airports cannot be the same', 'error');
            return;
        }
        
        // Success feedback
        const fromName = document.getElementById('from-airport').selectedOptions[0].text;
        const toName = document.getElementById('to-airport').selectedOptions[0].text;
        showToast(`Searching flights from ${fromName} to ${toName}...`, 'success');
    });
}

/**
 * Initialize check-in form
 */
function initCheckinForm() {
    const form = document.getElementById('checkin-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const bookingRef = document.getElementById('checkin-ref').value.trim();
        const lastName = document.getElementById('checkin-name').value.trim();
        
        if (!bookingRef || !lastName) {
            showToast('Please enter your booking reference and last name', 'error');
            return;
        }
        
        if (bookingRef.length !== 6) {
            showToast('Booking reference must be 6 characters', 'error');
            return;
        }
        
        showToast('Redirecting to web check-in...', 'success');
    });
}

/**
 * Initialize booking management form
 */
function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const bookingRef = document.getElementById('booking-ref').value.trim();
        const lastName = document.getElementById('booking-name').value.trim();
        
        if (!bookingRef || !lastName) {
            showToast('Please enter your booking reference and last name', 'error');
            return;
        }
        
        showToast('Loading your booking details...', 'success');
    });
}

/**
 * Initialize flight status form
 */
function initStatusForm() {
    const form = document.getElementById('status-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const flightNumber = document.getElementById('flight-number').value.trim();
        const flightDate = document.getElementById('flight-date').value;
        
        if (!flightNumber || !flightDate) {
            showToast('Please enter flight number and date', 'error');
            return;
        }
        
        showToast(`Checking status for flight PK${flightNumber}...`, 'success');
    });
}

// ===========================================
// NEWSLETTER
// ===========================================

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const successMessage = document.getElementById('newsletter-success');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show success message
        form.hidden = true;
        successMessage.hidden = false;
        showToast('Successfully subscribed!', 'success');
    });
}

// ===========================================
// DESTINATION CARDS
// ===========================================

/**
 * Initialize destination card buttons
 */
function initDestinationCards() {
    const bookButtons = document.querySelectorAll('.destination-card .btn');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.destination-card');
            const destination = card.querySelector('.destination-name')?.textContent || 'destination';
            showToast(`Booking flight to ${destination}...`, 'success');
        });
    });
}

// ===========================================
// SCROLL ANIMATIONS
// ===========================================

/**
 * Initialize scroll-based animations using Intersection Observer
 */
function initScrollAnimations() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// ===========================================
// TOAST CLOSE BUTTON
// ===========================================

/**
 * Initialize toast close button
 */
function initToastClose() {
    const closeBtn = document.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeToast);
    }
}

// ===========================================
// DATE INPUT DEFAULTS
// ===========================================

/**
 * Set minimum date for date inputs (today)
 */
function initDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

// ===========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===========================================

/**
 * Initialize smooth scrolling for internal links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                const menuToggle = document.getElementById('mobile-menu-toggle');
                if (mobileMenu?.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    menuToggle?.setAttribute('aria-expanded', 'false');
                }
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Set focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });
}

// ===========================================
// KEYBOARD ACCESSIBILITY
// ===========================================

/**
 * Enhance keyboard navigation
 */
function initKeyboardNav() {
    // Trap focus in mobile menu when open
    const mobileMenu = document.getElementById('mobile-menu');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    
    if (mobileMenu && menuToggle) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }
}

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    // Header & Navigation
    initHeaderScroll();
    initMobileMenu();
    initDesktopNav();
    
    // Booking Widget
    initBookingTabs();
    initTripTypeToggle();
    initAirportSwap();
    initFlightForm();
    initCheckinForm();
    initBookingForm();
    initStatusForm();
    
    // Other Components
    initNewsletterForm();
    initDestinationCards();
    initToastClose();
    initDateInputs();
    
    // Enhancements
    initScrollAnimations();
    initSmoothScroll();
    initKeyboardNav();
    
    console.log('PIA Website initialized successfully');
}

// Run when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
