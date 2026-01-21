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

    // Sticky navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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

// Scroll-based Animations
function initScrollAnimations() {
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

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = scrolled * 0.5;
        
        if (parallax) {
            parallax.style.backgroundPositionY = `${speed}px`;
        }
    });
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
