// Main Portfolio JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initFormValidation();
    initProjectCards();
    initThemeToggle();
    initSmoothScrolling();
    initIntersectionObserver();
    initPageTransitions();
    initDarkMode();
    
    // Add loaded class to prevent transition flashes
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        // Force visibility for critical elements
        forceElementVisibility();
    }, 100);
});

// Dark Mode Functionality
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Update icon
            const isDarkMode = body.classList.contains('dark-mode');
            darkModeToggle.innerHTML = isDarkMode ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
            
            // Save preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }
}

// Navigation Functions
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Optimized sticky navbar with throttling
    let navTicking = false;
    
    function updateNavbar() {
        if (!navTicking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                navTicking = false;
            });
            navTicking = true;
        }
    }
    
    window.addEventListener('scroll', updateNavbar, { passive: true });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Enhanced Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (!hamburger || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Toggle menu function
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        console.log('Menu toggled:', navMenu.classList.contains('active'));
    }

    // Close menu function
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 150); // Small delay for better UX
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    console.log('✅ Mobile menu initialized');
}

// Scroll-based Animations with Performance Optimization
function initScrollAnimations() {
    // Throttle scroll events for better performance
    let ticking = false;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger skill bar animations
                if (entry.target.closest('#about') || entry.target.closest('#skills')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.scroll-reveal, .skill-card, .project-card, .timeline-item');
    animateElements.forEach(el => observer.observe(el));

    // Optimized parallax effect for hero section
    function updateParallax() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                const hero = document.querySelector('.hero');
                if (hero) {
                    hero.style.transform = `translate3d(0, ${rate}px, 0)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }

    // Throttled scroll listener
    window.addEventListener('scroll', updateParallax, { passive: true });
    
    // Background parallax effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.backgroundPositionY = `${speed}px`;
        }
    }, { passive: true });
}

// Skill Bar Animations
function initSkillBars() {
    const skillProgressBars = document.querySelectorAll('.skill-progress, .level-fill');
    
    skillProgressBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0%';
        bar.style.width = '0%';
        
        // Store the target width for later animation
        bar.dataset.targetWidth = width;
    });
}

function animateSkillBars(container) {
    const progressBars = container.querySelectorAll('.skill-progress, .level-fill');
    
    progressBars.forEach((bar, index) => {
        setTimeout(() => {
            const targetWidth = bar.dataset.targetWidth || bar.parentElement.previousElementSibling?.textContent.match(/\d+/)?.[0] + '%' || '80%';
            bar.style.width = targetWidth;
            bar.classList.add('animated');
        }, index * 200);
    });
}

// Form Validation and Handling
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<div class="loading-spinner"></div> جاري الإرسال...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('تم إرسال رسالتك بنجاح!', 'success');
            contactForm.reset();
            
        } catch (error) {
            showNotification('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Validation rules
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'البريد الإلكتروني غير صحيح';
        }
    }

    // Show validation feedback
    if (!isValid) {
        showError(field, errorMessage);
    } else {
        clearError({ target: field });
    }
}

function showError(field, message) {
    clearError({ target: field });
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearError(e) {
    const field = e.target;
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Project Cards Interactions
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

// Theme Toggle Functionality
function initThemeToggle() {
    // This is now handled by initDarkMode()
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for Advanced Animations
function initIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add different animation classes based on element type
                if (element.classList.contains('project-card')) {
                    element.classList.add('intersect-scale-in');
                } else if (element.classList.contains('skill-card')) {
                    element.classList.add('intersect-fade-in');
                } else if (element.classList.contains('timeline-item')) {
                    element.classList.add('intersect-slide-in-left');
                } else {
                    element.classList.add('intersect-fade-in');
                }
                
                // Remove observer after animation
                observer.unobserve(element);
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);
    
    // Observe all animatable elements
    const elements = document.querySelectorAll(
        '.project-card, .skill-card, .timeline-item, .stat-card, .contact-item'
    );
    
    elements.forEach(el => observer.observe(el));
}

// Page Transitions
function initPageTransitions() {
    // Add page load animation
    document.body.classList.add('page-transition');
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.style.opacity = '0.8';
        } else {
            document.body.style.opacity = '1';
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function createRippleEffect(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation to stylesheet if not exists
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Force visibility function to fix display issues
function forceElementVisibility() {
    // Make hero elements visible
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons, .profile-image');
    heroElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'none';
        el.classList.add('force-visible');
    });
    
    // Make section titles visible
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.style.opacity = '1';
        title.style.visibility = 'visible';
        title.style.transform = 'none';
    });
    
    // Make social section visible
    const socialSection = document.querySelector('#social');
    if (socialSection) {
        socialSection.style.display = 'block';
        socialSection.style.opacity = '1';
    }
    
    // Make buttons clickable
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    });
    
    console.log('✅ Forced element visibility applied');
}

// Specific fix for hero image visibility
function fixHeroImage() {
    // Target the hero image specifically
    const heroImages = document.querySelectorAll('.hero-image, .hero-image img, .hero-image .profile-image');
    
    heroImages.forEach(img => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.display = 'block';
        img.style.transform = 'translateX(0)';
        img.classList.remove('fade-in-right');
        img.classList.add('force-visible');
    });
    
    // Also fix the container
    const heroContainers = document.querySelectorAll('.hero-image .profile-image-container');
    heroContainers.forEach(container => {
        container.style.opacity = '1';
        container.style.visibility = 'visible';
    });
    
    console.log('✅ Hero image visibility fix applied');
}

// Apply fixes with multiple attempts
setTimeout(fixHeroImage, 100);
setTimeout(fixHeroImage, 500);
setTimeout(fixHeroImage, 1000);

// Performance Optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced scroll handler with throttling
const handleScroll = throttle(() => {
    // Your scroll handling code here
}, 16); // ~60fps

window.addEventListener('scroll', handleScroll);

// Export functions for global access if needed
window.Portfolio = {
    showNotification,
    toggleTheme: function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        return isDark;
    },
    createRippleEffect,
    initLightbox
};

// Initialize lightbox functionality
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent triggering if clicking on the zoom icon
            if (e.target.closest('.gallery-zoom-icon')) {
                e.preventDefault();
                return;
            }
            
            const img = this.querySelector('.gallery-image');
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            
            const lightboxImg = document.createElement('img');
            lightboxImg.className = 'lightbox-content';
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            
            const closeBtn = document.createElement('div');
            closeBtn.className = 'lightbox-close';
            closeBtn.innerHTML = '&times;';
            
            lightbox.appendChild(lightboxImg);
            lightbox.appendChild(closeBtn);
            document.body.appendChild(lightbox);
            
            // Show lightbox
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);
            
            // Close lightbox
            const closeLightbox = () => {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    if (lightbox.parentNode) {
                        lightbox.parentNode.removeChild(lightbox);
                    }
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // Close with ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                }
            });
        });
    });
}

// Initialize mobile menu on DOM load
document.addEventListener('DOMContentLoaded', initMobileMenu);

// Initialize lightbox on DOM load
document.addEventListener('DOMContentLoaded', initLightbox);

// Ghost Orbiting Animation with Enhanced Ghostly Explosions
function initGhostOrbiting() {
    const ghost1 = document.getElementById('ghost1');
    const ghost2 = document.getElementById('ghost2');
    const ghost3 = document.getElementById('ghost3');
    const ghost4 = document.getElementById('ghost4');
    const ghost5 = document.getElementById('ghost5');
    const ghost6 = document.getElementById('ghost6');
    const profileImg = document.getElementById('profile-img');
    
    // Ensure profile image is visible immediately
    if (profileImg) {
        profileImg.style.opacity = '1';
        profileImg.style.transform = 'scale(1)';
        profileImg.style.zIndex = '10';
        profileImg.classList.add('show-profile');
        
        // Ensure the image is displayed
        profileImg.style.display = 'block';
    }
    
    // Set up periodic ghost explosions with screen-size-adjusted intervals
    let explosionInterval;
    
    // Adjust interval based on screen size for performance
    if (window.innerWidth <= 480) {
        explosionInterval = 6000; // Less frequent on small screens for performance
    } else if (window.innerWidth <= 768) {
        explosionInterval = 5000; // Slightly less frequent on medium screens
    } else {
        explosionInterval = 4000; // Default frequency on larger screens
    }
    
    setInterval(() => {
        createEnhancedGhostExplosion();
    }, explosionInterval); // Adjusted interval based on screen size
    
    console.log('Ghost orbiting animation with enhanced ghostly explosions initialized');
}

// Create enhanced ghostly explosion effect
function createEnhancedGhostExplosion() {
    const container = document.querySelector('.ghost-animation-container');
    
    if (!container) return;
    
    // Adjust particle counts based on screen size for better performance
    let particleCount = 40;
    let puffCount = 20;
    let effectCount = 15;
    
    if (window.innerWidth <= 480) {
        particleCount = 15;  // Much fewer particles on small screens to prevent overflow
        puffCount = 8;
        effectCount = 6;
    } else if (window.innerWidth <= 768) {
        particleCount = 20;
        puffCount = 12;
        effectCount = 9;
    } else {
        particleCount = 30;
        puffCount = 15;
        effectCount = 12;
    }
    
    // Create explosion container
    const explosion = document.createElement('div');
    explosion.className = 'ghost-explosion';
    
    // Create ethereal glow effect
    const glow = document.createElement('div');
    glow.className = 'ghostly-glow';
    explosion.appendChild(glow);
    
    // Create particles for explosion
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ghost-particle';
        
        // Random ghostly colors
        const colors = ['#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#e2e8f0', '#f1f5f9'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Position at center initially
        particle.style.left = '50%';
        particle.style.top = '50%';
        
        explosion.appendChild(particle);
        
        // Animate particle with screen-size-adjusted distances to prevent overflow
        const angle = Math.random() * Math.PI * 2;
        let distance;
        if (window.innerWidth <= 480) {
            distance = 15 + Math.random() * 35;  // Much shorter distances on small screens
        } else if (window.innerWidth <= 768) {
            distance = 20 + Math.random() * 45;
        } else {
            distance = 25 + Math.random() * 60;  // Original distances reduced to prevent overflow
        }
        
        const duration = 0.6 + Math.random() * 1.2;
        
        particle.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1
            },
            { 
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        });
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration * 1000);
    }
    
    // Create ghostly puffs
    for (let i = 0; i < puffCount; i++) {
        const puff = document.createElement('div');
        puff.className = 'ghostly-puff';
        
        // Random position around center
        const angle = Math.random() * Math.PI * 2;
        let distance;
        if (window.innerWidth <= 480) {
            distance = 8 + Math.random() * 25;  // Much shorter distances on small screens
        } else if (window.innerWidth <= 768) {
            distance = 10 + Math.random() * 30;
        } else {
            distance = 12 + Math.random() * 40;  // Original distances reduced
        }
        
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;
        
        puff.style.left = `${x}%`;
        puff.style.top = `${y}%`;
        
        explosion.appendChild(puff);
        
        // Remove puff after animation
        setTimeout(() => {
            if (puff.parentNode) {
                puff.parentNode.removeChild(puff);
            }
        }, 1500);
    }
    
    // Create additional visual effects
    for (let i = 0; i < effectCount; i++) {
        const visualEffect = document.createElement('div');
        visualEffect.className = 'ghostly-puff';
        
        // Random position and size for visual effects
        const angle = Math.random() * Math.PI * 2;
        let distance;
        if (window.innerWidth <= 480) {
            distance = 10 + Math.random() * 30;  // Much shorter distances on small screens
        } else if (window.innerWidth <= 768) {
            distance = 12 + Math.random() * 35;
        } else {
            distance = 15 + Math.random() * 45;  // Original distances reduced
        }
        
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;
        
        visualEffect.style.left = `${x}%`;
        visualEffect.style.top = `${y}%`;
        
        // Adjust size based on screen size to prevent overflow
        if (window.innerWidth <= 480) {
            visualEffect.style.width = `${5 + Math.random() * 5}px`;
            visualEffect.style.height = `${5 + Math.random() * 5}px`;
        } else if (window.innerWidth <= 768) {
            visualEffect.style.width = `${6 + Math.random() * 6}px`;
            visualEffect.style.height = `${6 + Math.random() * 6}px`;
        } else {
            visualEffect.style.width = `${7 + Math.random() * 7}px`;
            visualEffect.style.height = `${7 + Math.random() * 7}px`;
        }
        
        // Random bright ghostly color
        const brightColors = ['rgba(207, 217, 227, 0.7)', 'rgba(148, 163, 184, 0.7)', 'rgba(160, 174, 192, 0.7)', 'rgba(226, 232, 240, 0.8)'];
        visualEffect.style.backgroundColor = brightColors[Math.floor(Math.random() * brightColors.length)];
        
        explosion.appendChild(visualEffect);
        
        // Animate the visual effect with reduced scale to prevent overflow
        const duration = 1.0 + Math.random() * 0.8;
        let maxScale;
        if (window.innerWidth <= 480) {
            maxScale = 1.8;  // Much smaller scale on small screens
        } else if (window.innerWidth <= 768) {
            maxScale = 2.2;
        } else {
            maxScale = 2.5;  // Reduced from original scale of 3
        }
        
        visualEffect.animate([
            { 
                transform: 'scale(0.5)',
                opacity: 1
            },
            { 
                transform: `scale(${maxScale})`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        });
        
        // Remove visual effect after animation
        setTimeout(() => {
            if (visualEffect.parentNode) {
                visualEffect.parentNode.removeChild(visualEffect);
            }
        }, duration * 1000);
    }
    
    container.appendChild(explosion);
    
    // Make explosion visible
    setTimeout(() => {
        explosion.style.opacity = '1';
    }, 10);
    
    // Remove explosion after animation
    setTimeout(() => {
        if (explosion.parentNode) {
            explosion.parentNode.removeChild(explosion);
        }
    }, 1800);
}

// Initialize ghost orbiting after DOM loads
setTimeout(initGhostOrbiting, 1000);

// Also initialize after a short delay to ensure all elements are loaded
setTimeout(initGhostOrbiting, 2000);

// Shake Detection for Background Color Changes
let lastShakeTime = 0;
let currentColorIndex = 0;

// Beautiful gradient color palette
const gradientColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Orange
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Soft Pastel
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Rose
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'  // Back to purple
];

function initShakeDetection() {
    // Show indicator that shake feature is available
    const indicator = document.getElementById('shakeIndicator');
    if (indicator) {
        setTimeout(() => {
            indicator.classList.add('show');
            // Hide indicator after 5 seconds
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 5000);
        }, 3000);
    }
    
    if (window.DeviceMotionEvent) {
        let lastAcceleration = { x: 0, y: 0, z: 0 };
        let shakeThreshold = 12; // Reduced sensitivity threshold for better detection
        
        window.addEventListener('devicemotion', (e) => {
            const acceleration = e.accelerationIncludingGravity;
            if (!acceleration) return;
            
            const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
            const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
            const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);
            
            // Check if shake detected - more sensitive detection
            const shakeIntensity = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
            
            if (shakeIntensity > shakeThreshold) {
                const currentTime = Date.now();
                // Debounce shakes to prevent rapid color changes
                if (currentTime - lastShakeTime > 800) { // Reduced debounce time
                    changeBackgroundColor();
                    lastShakeTime = currentTime;
                    // Show indicator temporarily when color changes
                    if (indicator) {
                        indicator.classList.add('show');
                        setTimeout(() => {
                            indicator.classList.remove('show');
                        }, 2000);
                    }
                }
            }
            
            lastAcceleration = {
                x: acceleration.x,
                y: acceleration.y,
                z: acceleration.z
            };
        });
        
        console.log('✅ Shake detection initialized');
    } else {
        // Fallback: Add keyboard shortcut for testing
        document.addEventListener('keydown', (e) => {
            // Press 'C' key to change background color
            if (e.key.toLowerCase() === 'c') {
                const currentTime = Date.now();
                if (currentTime - lastShakeTime > 800) {
                    changeBackgroundColor();
                    lastShakeTime = currentTime;
                    // Show indicator when using keyboard shortcut
                    const indicator = document.getElementById('shakeIndicator');
                    if (indicator) {
                        indicator.classList.add('show');
                        setTimeout(() => {
                            indicator.classList.remove('show');
                        }, 2000);
                    }
                }
            }
        });
        
        console.log('⚠️ Device motion not supported - use C key to change colors');
    }
}

function changeBackgroundColor() {
    const body = document.body;
    
    // Cycle through colors
    currentColorIndex = (currentColorIndex + 1) % gradientColors.length;
    
    // Apply new gradient with smooth transition
    body.style.background = gradientColors[currentColorIndex];
    body.style.transition = 'background 1.5s ease-in-out';
    
    // Add visual feedback
    createShakeVisualEffect();
    
    // Trigger haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Short vibration pattern
    }
    
    console.log(`🎨 Background changed to color ${currentColorIndex + 1}`);
}

function createShakeVisualEffect() {
    // Create temporary visual effect element
    const effect = document.createElement('div');
    effect.className = 'shake-effect';
    Object.assign(effect.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.5s ease-out'
    });
    
    document.body.appendChild(effect);
    
    // Animate effect
    setTimeout(() => {
        effect.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        effect.style.opacity = '0';
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 500);
    }, 300);
}

// Initialize shake detection
setTimeout(initShakeDetection, 1500);

// Firework Animation System for Social Media Buttons
function initFireworkEffects() {
    const socialButtons = document.querySelectorAll('.social-link-pro');
    
    socialButtons.forEach(button => {
        // Add hover event listeners
        button.addEventListener('mouseenter', function() {
            createButtonFirework(this);
        });
        
        // Add click event listeners for dramatic explosion and reconstruction
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default to show animation first
            const originalHref = this.href;
            createDramaticExplosionAndReconstruction(this, originalHref);
        });
        
        // Add double-click for continuous explosion mode
        let clickCount = 0;
        let clickTimer;
        
        button.addEventListener('dblclick', function(e) {
            e.preventDefault();
            startContinuousButtonExplosions(this);
        });
    });
    
    console.log('✅ Enhanced firework effects initialized for social buttons');
}

function createButtonFirework(button) {
    const container = button.querySelector('.firework-container');
    if (!container) return;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Get color from data attribute
    const color = button.dataset.fireworkColor || 'blue';
    
    // Adjust particle count and distances based on screen size
    let particleCount = 8;
    let baseDistance = 30;
    let trailCount = 4;
    
    if (window.innerWidth <= 480) {
        particleCount = 6;  // Fewer particles on mobile
        baseDistance = 20;  // Shorter distances
        trailCount = 3;
    } else if (window.innerWidth <= 768) {
        particleCount = 7;
        baseDistance = 25;
        trailCount = 3;
    }
    
    // Create small firework effect
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework-particle particle-${color}`;
        
        // Position at center
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        container.appendChild(particle);
        
        // Animate particle
        const angle = (i * (360 / particleCount)) * (Math.PI / 180);
        const distance = baseDistance + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            { 
                transform: `translate(${tx}px, ${ty}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 600);
    }
    
    // Create trails
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'firework-trail';
        
        const angle = (i * (360 / trailCount) + (360 / trailCount / 2)) * (Math.PI / 180);
        const trailX = centerX + Math.cos(angle) * (baseDistance / 2);
        const trailY = centerY + Math.sin(angle) * (baseDistance / 2);
        
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
        trail.style.transform = `rotate(${angle}rad)`;
        
        container.appendChild(trail);
        
        trail.animate([
            { 
                transform: `translate(0, 0) rotate(${angle}rad) scaleY(1)`,
                opacity: 0.7
            },
            { 
                transform: `translate(0, -${baseDistance * 1.5}px) rotate(${angle}rad) scaleY(0.3)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 800);
    }
}

function createExplosionFirework(button) {
    const container = button.querySelector('.firework-container');
    if (!container) return;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const color = button.dataset.fireworkColor || 'blue';
    
    // Adjust explosion parameters based on screen size
    let particleCount = 15;
    let baseDistance = 40;
    let ringCount = 3;
    
    if (window.innerWidth <= 480) {
        particleCount = 10;  // Fewer particles on mobile
        baseDistance = 30;   // Shorter distances
        ringCount = 2;
    } else if (window.innerWidth <= 768) {
        particleCount = 12;
        baseDistance = 35;
        ringCount = 2;
    }
    
    // Create explosion effect with more particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework-particle particle-${color}`;
        
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        container.appendChild(particle);
        
        // Random direction explosion
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = baseDistance + Math.random() * (baseDistance * 0.8);
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            { 
                transform: `translate(${tx}px, ${ty}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration);
    }
    
    // Create multiple rings of trails
    for (let ring = 0; ring < ringCount; ring++) {
        const trailCount = 6 + ring * 2;  // 6, 8, 10 trails per ring
        const ringRadius = (baseDistance / 2) + ring * 10;
        
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'firework-trail';
            
            const angle = (i * (360 / trailCount) + (ring * 15)) * (Math.PI / 180);
            const trailX = centerX + Math.cos(angle) * ringRadius;
            const trailY = centerY + Math.sin(angle) * ringRadius;
            
            trail.style.left = `${trailX}px`;
            trail.style.top = `${trailY}px`;
            trail.style.transform = `rotate(${angle}rad)`;
            
            container.appendChild(trail);
            
            const duration = 1000 + ring * 200;
            
            trail.animate([
                { 
                    transform: `translate(0, 0) rotate(${angle}rad) scaleY(1)`,
                    opacity: 0.7 - (ring * 0.2)
                },
                { 
                    transform: `translate(0, -${baseDistance}px) rotate(${angle}rad) scaleY(0.2)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'ease-out'
            });
            
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, duration);
        }
    }
    
    // Add haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate([30, 20, 30]);
    }
}

function createDramaticExplosionAndReconstruction(button, href) {
    const container = button.querySelector('.firework-container');
    if (!container) return;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const color = button.dataset.fireworkColor || 'blue';
    
    // Add dramatic glow effect
    const glow = document.createElement('div');
    glow.className = 'dramatic-glow';
    button.appendChild(glow);
    
    // Start explosion animation
    button.classList.add('button-explode');
    
    // Create initial explosion particles
    setTimeout(() => {
        createExplosionParticles(container, centerX, centerY, color, 25);
    }, 100);
    
    // Create trails during explosion
    setTimeout(() => {
        createExplosionTrails(container, centerX, centerY, 3);
    }, 200);
    
    // Add haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50, 30, 50]);
    }
    
    // Start reconstruction after explosion completes
    setTimeout(() => {
        reconstructButton(button, container, centerX, centerY, color, href);
    }, 800);
    
    // Remove glow effect
    setTimeout(() => {
        if (glow.parentNode) {
            glow.parentNode.removeChild(glow);
        }
    }, 1500);
}

function createExplosionParticles(container, centerX, centerY, color, count) {
    // Adjust for screen size
    let particleCount = count;
    let baseDistance = 60;
    
    if (window.innerWidth <= 480) {
        particleCount = Math.floor(count * 0.6);
        baseDistance = 40;
    } else if (window.innerWidth <= 768) {
        particleCount = Math.floor(count * 0.8);
        baseDistance = 50;
    }
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework-particle particle-${color}`;
        
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        container.appendChild(particle);
        
        // Random direction explosion
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = baseDistance + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        const duration = 1000 + Math.random() * 500;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            { 
                transform: `translate(${tx}px, ${ty}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration);
    }
}

function createExplosionTrails(container, centerX, centerY, ringCount) {
    for (let ring = 0; ring < ringCount; ring++) {
        const trailCount = 12 + ring * 4;
        const ringRadius = 30 + ring * 20;
        
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'firework-trail';
            
            const angle = (i * (360 / trailCount) + (ring * 15)) * (Math.PI / 180);
            const trailX = centerX + Math.cos(angle) * ringRadius;
            const trailY = centerY + Math.sin(angle) * ringRadius;
            
            trail.style.left = `${trailX}px`;
            trail.style.top = `${trailY}px`;
            trail.style.transform = `rotate(${angle}rad)`;
            
            container.appendChild(trail);
            
            const duration = 1200 + ring * 300;
            
            trail.animate([
                { 
                    transform: `translate(0, 0) rotate(${angle}rad) scaleY(1)`,
                    opacity: 0.8 - (ring * 0.2)
                },
                { 
                    transform: `translate(0, -80px) rotate(${angle}rad) scaleY(0.2)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'ease-out'
            });
            
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, duration);
        }
    }
}

function reconstructButton(button, container, centerX, centerY, color, href) {
    // Remove explosion class and add reconstruction class
    button.classList.remove('button-explode');
    button.classList.add('button-reconstruct');
    
    // Create formation particles that converge to rebuild the button
    setTimeout(() => {
        createFormationParticles(container, centerX, centerY, color, () => {
            // Navigate after reconstruction completes
            setTimeout(() => {
                if (href.startsWith('mailto:')) {
                    window.location.href = href;
                } else {
                    window.open(href, '_blank');
                }
            }, 300);
        });
    }, 100);
    
    // Create reconstruction trails
    createReconstructionTrails(container, centerX, centerY);
    
    // Remove reconstruction class after animation completes
    setTimeout(() => {
        button.classList.remove('button-reconstruct');
    }, 1200);
}

function createFormationParticles(container, centerX, centerY, color, onComplete) {
    const particleCount = 20;
    let completedAnimations = 0;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `formation-particle particle-${color}`;
        
        // Start from random positions around the button
        const startAngle = (Math.random() * 360) * (Math.PI / 180);
        const startDistance = 80 + Math.random() * 40;
        const startX = centerX + Math.cos(startAngle) * startDistance;
        const startY = centerY + Math.sin(startAngle) * startDistance;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        container.appendChild(particle);
        
        // Animate toward center
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            { 
                transform: `translate(0, 0) scale(1)`,
                opacity: 1
            },
            { 
                transform: `translate(${centerX - startX}px, ${centerY - startY}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            completedAnimations++;
            if (completedAnimations === particleCount) {
                onComplete();
            }
        }, duration);
    }
}

function createReconstructionTrails(container, centerX, centerY) {
    const trailCount = 16;
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'reconstruction-trail';
        
        // Start from circle around the center
        const angle = (i * (360 / trailCount)) * (Math.PI / 180);
        const startRadius = 60;
        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;
        
        trail.style.left = `${startX}px`;
        trail.style.top = `${startY}px`;
        trail.style.transform = `rotate(${angle + Math.PI}rad)`; // Point toward center
        
        container.appendChild(trail);
        
        trail.animate([
            { 
                transform: `translate(0, 0) rotate(${angle + Math.PI}rad) scaleY(1)`,
                opacity: 0.7
            },
            { 
                transform: `translate(${centerX - startX}px, ${centerY - startY}px) rotate(${angle + Math.PI}rad) scaleY(0.1)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'ease-in'
        });
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    }
}

// Initialize firework effects
setTimeout(initFireworkEffects, 2000);

// Scroll-Triggered Flying Entrance and Explosion Effects
function initScrollTriggeredEffects() {
    const socialSection = document.getElementById('socialSection');
    if (!socialSection) return;
    
    let hasAnimated = false;
    
    function checkScrollPosition() {
        if (hasAnimated) return;
        
        const sectionRect = socialSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Trigger when section is 30% visible
        if (sectionRect.top < windowHeight * 0.7 && sectionRect.bottom > 0) {
            triggerFlyingEntrance();
            hasAnimated = true;
        }
    }
    
    function triggerFlyingEntrance() {
        const buttons = socialSection.querySelectorAll('.social-link-pro');
        
        // Add flying entrance animations
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.classList.add('animate');
            }, index * 100); // Staggered entrance
        });
        
        // Trigger explosion effect after all buttons have flown in
        setTimeout(() => {
            triggerScrollExplosion();
        }, 1500);
        
        console.log('🚀 Scroll-triggered flying entrance activated');
    }
    
    function triggerScrollExplosion() {
        const buttons = socialSection.querySelectorAll('.social-link-pro');
        
        // Start continuous explosion cycle
        startContinuousExplosions(buttons);
        
        console.log('🎆 Continuous scroll-triggered explosions activated');
    }
    
    function startContinuousExplosions(buttons) {
        let currentIndex = 0;
        const explosionInterval = 800; // Time between each explosion
        const cycleDuration = 4000;   // Time for complete cycle through all buttons
        
        function triggerNextExplosion() {
            const button = buttons[currentIndex];
            if (!button) return;
            
            // Add explosion class
            button.classList.add('scroll-explosion');
            
            // Create explosion effects
            const container = button.querySelector('.scroll-firework-container');
            const rect = button.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const color = button.dataset.fireworkColor || 'blue';
            
            createScrollExplosionParticles(container, centerX, centerY, color);
            createScrollExplosionTrails(container, centerX, centerY);
            
            // Add haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate([50, 25, 50]);
            }
            
            // Remove explosion class after animation
            setTimeout(() => {
                button.classList.remove('scroll-explosion');
            }, 2000);
            
            // Move to next button
            currentIndex = (currentIndex + 1) % buttons.length;
        }
        
        // Start the continuous cycle
        triggerNextExplosion(); // First explosion immediately
        
        const explosionTimer = setInterval(triggerNextExplosion, explosionInterval);
        
        // Continue for 20 seconds then slow down
        setTimeout(() => {
            clearInterval(explosionTimer);
            // Slower continuous cycle
            const slowTimer = setInterval(() => {
                triggerNextExplosion();
            }, 1500);
            
            // Stop after 1 minute total
            setTimeout(() => {
                clearInterval(slowTimer);
                console.log('🎉 Continuous explosions completed');
            }, 60000);
        }, 20000);
    }
    
    // Add throttled scroll event listener
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    // Check on load in case already scrolled
    setTimeout(checkScrollPosition, 1000);
    
    console.log('✅ Scroll-triggered effects initialized');
}

function createScrollExplosionParticles(container, centerX, centerY, color) {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework-particle particle-${color}`;
        
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        container.appendChild(particle);
        
        // Random explosion direction
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 70 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        const duration = 1500 + Math.random() * 500;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            { 
                transform: `translate(${tx}px, ${ty}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration);
    }
}

function createScrollExplosionTrails(container, centerX, centerY) {
    const trailCount = 20;
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'firework-trail';
        
        const angle = (i * (360 / trailCount)) * (Math.PI / 180);
        const trailX = centerX + Math.cos(angle) * 40;
        const trailY = centerY + Math.sin(angle) * 40;
        
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
        trail.style.transform = `rotate(${angle}rad)`;
        
        container.appendChild(trail);
        
        trail.animate([
            { 
                transform: `translate(0, 0) rotate(${angle}rad) scaleY(1)`,
                opacity: 0.9
            },
            { 
                transform: `translate(0, -100px) rotate(${angle}rad) scaleY(0.1)`,
                opacity: 0
            }
        ], {
            duration: 1800,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1800);
    }
}

// Initialize scroll-triggered effects
setTimeout(initScrollTriggeredEffects, 2500);

// Continuous Ambient Firework Effects
function initAmbientFireworks() {
    const body = document.body;
    
    // Create ambient firework container
    const ambientContainer = document.createElement('div');
    ambientContainer.id = 'ambient-fireworks';
    Object.assign(ambientContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '50',
        overflow: 'hidden'
    });
    
    body.appendChild(ambientContainer);
    
    // Start optimized ambient fireworks with reduced frequency
    setInterval(() => {
        createAmbientFirework(ambientContainer);
    }, 5000); // Every 5 seconds to reduce CPU usage
    
    console.log('✨ Ambient firework effects initialized');
}

function createAmbientFirework(container) {
    // Random position on screen
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.7; // Keep in upper 70% of screen
    
    // Enhanced color palette with more vivid options
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create explosion center
    const center = document.createElement('div');
    Object.assign(center.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '4px',
        height: '4px',
        backgroundColor: 'white',
        borderRadius: '50%',
        boxShadow: '0 0 10px 2px white',
        opacity: '0'
    });
    
    container.appendChild(center);
    
    // Fade in center
    setTimeout(() => {
        center.style.opacity = '1';
        center.style.transition = 'opacity 0.2s';
    }, 10);
    
    // Create particles with enhanced intensity
    const particleCount = 35;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework-particle particle-${color}`;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        container.appendChild(particle);
        
        // Random direction
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 50 + Math.random() * 70;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        const duration = 1200 + Math.random() * 800;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(0)',
                opacity: 1
            },
            { 
                transform: `translate(${tx}px, ${ty}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, duration);
    }
    
    // Create trails with enhanced visibility
    const trailCount = 20;
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'firework-trail';
        
        const angle = (i * (360 / trailCount)) * (Math.PI / 180);
        const trailX = x + Math.cos(angle) * 30;
        const trailY = y + Math.sin(angle) * 30;
        
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
        trail.style.transform = `rotate(${angle}rad)`;
        
        container.appendChild(trail);
        
        trail.animate([
            { 
                transform: `translate(0, 0) rotate(${angle}rad) scaleY(1)`,
                opacity: 0.7
            },
            { 
                transform: `translate(0, -70px) rotate(${angle}rad) scaleY(0.2)`,
                opacity: 0
            }
        ], {
            duration: 1500,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1500);
    }
    
    // Remove center after explosion
    setTimeout(() => {
        if (center.parentNode) {
            center.parentNode.removeChild(center);
        }
    }, 1000);
}

function startContinuousButtonExplosions(button) {
    const container = button.querySelector('.firework-container');
    if (!container) return;
    
    const rect = button.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const color = button.dataset.fireworkColor || 'blue';
    
    // Add continuous explosion class
    button.classList.add('continuous-explosion');
    
    let explosionCount = 0;
    const maxExplosions = 15; // Limit to prevent performance issues
    
    function createSingleExplosion() {
        if (explosionCount >= maxExplosions) {
            stopContinuousExplosions(button);
            return;
        }
        
        // Create explosion particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = `firework-particle particle-${color}`;
            
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            
            container.appendChild(particle);
            
            // Random direction but closer to button
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = 30 + Math.random() * 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            const duration = 600 + Math.random() * 400;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(0)',
                    opacity: 1
                },
                { 
                    transform: `translate(${tx}px, ${ty}px) scale(1)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration);
        }
        
        // Create small trails
        for (let i = 0; i < 8; i++) {
            const trail = document.createElement('div');
            trail.className = 'firework-trail';
            
            const angle = (i * 45) * (Math.PI / 180);
            const trailX = centerX + Math.cos(angle) * 20;
            const trailY = centerY + Math.sin(angle) * 20;
            
            trail.style.left = `${trailX}px`;
            trail.style.top = `${trailY}px`;
            trail.style.transform = `rotate(${angle}rad)`;
            
            container.appendChild(trail);
            
            trail.animate([
                { 
                    transform: `translate(0, 0) rotate(${angle}rad) scaleY(1)`,
                    opacity: 0.6
                },
                { 
                    transform: `translate(0, -40px) rotate(${angle}rad) scaleY(0.2)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'ease-out'
            });
            
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, 800);
        }
        
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([30, 15, 30]);
        }
        
        explosionCount++;
    }
    
    // Start immediate explosion
    createSingleExplosion();
    
    // Continue with rapid explosions
    const explosionInterval = setInterval(createSingleExplosion, 400);
    
    // Store interval ID on button for cleanup
    button.continuousExplosionInterval = explosionInterval;
    
    console.log(`🔥 Continuous explosions started on ${button.querySelector('span').textContent}`);
}

function stopContinuousExplosions(button) {
    if (button.continuousExplosionInterval) {
        clearInterval(button.continuousExplosionInterval);
        button.classList.remove('continuous-explosion');
        delete button.continuousExplosionInterval;
        console.log(`⏹️ Continuous explosions stopped on ${button.querySelector('span').textContent}`);
    }
}

// Initialize ambient fireworks
setTimeout(initAmbientFireworks, 3000);





// Ensure profile image is visible immediately
window.addEventListener('load', function() {
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        // Make sure profile image is visible
        profileImg.style.opacity = '1';
        profileImg.style.transform = 'scale(1)';
        profileImg.style.zIndex = '10';
        profileImg.style.display = 'block';
        profileImg.classList.add('show-profile');
    }
});

// Also initialize mobile menu on DOM load
setTimeout(initMobileMenu, 500);
setTimeout(initLightbox, 500);

// Mascot and Welcome Bubble functionality
document.addEventListener('DOMContentLoaded', function() {
  // Show welcome message as speech bubble
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    // Make welcome message visible as speech bubble
    welcomeMessage.style.display = 'block';
    welcomeMessage.classList.add('show');
    
    // Start the message transition animation after 5 seconds
    setTimeout(startMessageTransition, 5000);
  }
  
});



