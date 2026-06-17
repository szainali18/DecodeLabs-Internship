

// ========== Navigation Menu Toggle ==========
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Toggle menu visibility
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when link is clicked
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// ========== CTA Button Interactions ==========
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 600);
            
            // Show user feedback
            const originalText = button.textContent;
            button.textContent = '✓ Loaded!';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1000);
        });

        // Keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
});

// ========== Scroll-Triggered Animations ==========
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToObserve = document.querySelectorAll(
        '.vision-card, .standard-card, .toolkit-card, .feature-item, .section-container'
    );
    
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: rippleAnimation 0.6s ease-out;
    }
    
    @keyframes rippleAnimation {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== Smooth Scroll Offset for Fixed Nav ==========
document.addEventListener('DOMContentLoaded', () => {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - navHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ========== Accessibility: Focus Management ==========
document.addEventListener('DOMContentLoaded', () => {
    // Ensure keyboard users see focus indicators
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    };

    const handleMouseDown = () => {
        document.body.classList.remove('keyboard-nav');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Add visual feedback for keyboard navigation
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        body.keyboard-nav a:focus,
        body.keyboard-nav button:focus,
        body.keyboard-nav .nav-link:focus {
            outline: 2px solid #A0D4E0;
            outline-offset: 4px;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(focusStyle);
});

// ========== Analytics & Performance ==========
document.addEventListener('DOMContentLoaded', () => {
    // Log page performance metrics
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
            
            // Report Web Vitals
            if ('web-vital' in window) {
                console.log('Web Vitals tracking enabled');
            }
        });
    }
});

// ========== Responsive Image Loading ==========
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images if supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// ========== Local Storage for User Preferences ==========
document.addEventListener('DOMContentLoaded', () => {
    // Save user's theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme() {
        localStorage.setItem('theme-preference', 
            prefersDark.matches ? 'dark' : 'light');
    }

    updateTheme();
    prefersDark.addEventListener('change', updateTheme);

    // Restore user preferences on page load
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
        console.log(`User theme preference: ${savedTheme}`);
    }
});

// ========== Form State Management (if needed) ==========
class FormManager {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.initializeForm();
        }
    }

    initializeForm() {
        // Reset form on page load
        this.form.reset();

        // Validate on submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim() && input.required) {
                input.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else {
                input.setAttribute('aria-invalid', 'false');
            }
        });

        return isValid;
    }

    submitForm() {
        console.log('Form submitted successfully');
        // Add form submission logic here
    }
}

// ========== Service Worker Registration (PWA Support) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    });
}

// ========== Utility: Debounce Function ==========
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ========== Utility: Throttle Function ==========
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// ========== Window Resize Handler ==========
window.addEventListener('resize', debounce(() => {
    console.log(`Window resized to ${window.innerWidth}x${window.innerHeight}`);
}, 250));

// ========== Export for Module Usage ==========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        FormManager
    };
}

console.log('✓ Project 1: Responsive Frontend initialized');
