// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Debounce utility for scroll performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Consolidated scroll handler for all scroll-based functionality
function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(255, 0, 255, 0.2)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    // Active navigation link highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Parallax effect for hero section
    const heroContent = document.querySelector('.hero-container');
    if (heroContent) {
        const rate = scrollY * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }

    // Show/hide scroll-to-top button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        if (scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }
}

// Apply debounced scroll handler
const debouncedScrollHandler = debounce(handleScroll, 10);
window.addEventListener('scroll', debouncedScrollHandler);
// Also run immediately for initial state
handleScroll();

// Contact form handling with null check
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Submit form to Formspree
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again or email us directly.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .about-text, .contact-info');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Parallax effect moved to consolidated scroll handler above

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Typing animation disabled - title displays immediately
// document.addEventListener('DOMContentLoaded', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         typeWriter(heroTitle, originalText, 20);
//     }
// });

// Portfolio item hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Service card click effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-10px)';
        }, 150);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Remove any loading screens if they exist
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h4');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + (counter.textContent.includes('%') ? '%' : '+');
        }, 20);
    });
}

// Trigger counter animation when stats section is visible (with null check)
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// Add scroll-to-top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0d1117 100%);
    color: #ff00ff;
    border: 2px solid rgba(255, 0, 255, 0.4);
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 5px 15px rgba(255, 0, 255, 0.4), 0 0 20px rgba(255, 0, 255, 0.3);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll-to-top button moved to consolidated scroll handler above

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll-to-top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// Debounce utility and scroll handler defined at top of file

// Add CSS for scroll-to-top button
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top:hover {
        transform: scale(1.1) !important;
    }
    
    .loaded {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
