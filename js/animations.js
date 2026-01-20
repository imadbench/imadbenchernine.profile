// Advanced Scroll Animations JavaScript

class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.ticking = false;
        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
        this.animateOnLoad();
    }

    setupElements() {
        // Select all elements that need scroll animations
        this.elements = [
            ...document.querySelectorAll('.scroll-reveal'),
            ...document.querySelectorAll('.skill-card'),
            ...document.querySelectorAll('.project-card'),
            ...document.querySelectorAll('.timeline-item'),
            ...document.querySelectorAll('.stat-card'),
            ...document.querySelectorAll('.contact-item'),
            ...document.querySelectorAll('.about-simple'),
            ...document.querySelectorAll('.about-description')
        ];
    }

    bindEvents() {
        // Throttled scroll handler for better performance
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => this.setupElements());
    }

    handleScroll() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top + scrollTop;
            const elementBottom = elementTop + element.offsetHeight;
            const viewportBottom = scrollTop + windowHeight;
            const viewportTop = scrollTop;

            // Check if element is in viewport
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                const scrollPercent = Math.max(0, Math.min(1, 
                    (viewportBottom - elementTop) / (windowHeight + element.offsetHeight)
                ));
                
                this.animateElement(element, scrollPercent);
            }
        });
    }

    animateElement(element, scrollPercent) {
        // Skip if already animated
        if (element.dataset.animated) return;

        // Different animations based on element type
        if (element.classList.contains('skill-card')) {
            this.animateSkillCard(element, scrollPercent);
        } else if (element.classList.contains('project-card')) {
            this.animateProjectCard(element, scrollPercent);
        } else if (element.classList.contains('timeline-item')) {
            this.animateTimelineItem(element, scrollPercent);
        } else if (element.classList.contains('about-simple') || element.classList.contains('about-description')) {
            this.animateAboutElement(element, scrollPercent);
        } else {
            this.animateGenericElement(element, scrollPercent);
        }

        // Mark as animated when fully in view
        if (scrollPercent > 0.8) {
            element.dataset.animated = 'true';
        }
    }

    animateSkillCard(element, scrollPercent) {
        // Rotate and scale effect
        const rotation = (1 - scrollPercent) * 10;
        const scale = 0.8 + (scrollPercent * 0.2);
        
        element.style.transform = `perspective(1000px) rotateY(${rotation}deg) scale(${scale})`;
        element.style.opacity = scrollPercent;
    }

    animateProjectCard(element, scrollPercent) {
        // 3D tilt effect
        const tiltX = (0.5 - scrollPercent) * 20;
        const tiltY = (Math.sin(scrollPercent * Math.PI) - 0.5) * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        element.style.opacity = Math.min(1, scrollPercent * 1.2);
    }

    animateTimelineItem(element, scrollPercent) {
        // Slide in from side with fade
        const translateX = (1 - scrollPercent) * 100;
        element.style.transform = `translateX(${translateX}px)`;
        element.style.opacity = scrollPercent;
    }

    animateGenericElement(element, scrollPercent) {
        // Standard fade up animation
        const translateY = (1 - scrollPercent) * 50;
        element.style.transform = `translateY(${translateY}px)`;
        element.style.opacity = scrollPercent;
    }

    animateAboutElement(element, scrollPercent) {
        // Smooth fade in for about section
        element.style.opacity = Math.min(1, scrollPercent * 1.2);
        element.style.transform = `translateY(${(1 - scrollPercent) * 30}px)`;
        
        // Add slight scale effect
        const scale = 0.95 + (scrollPercent * 0.05);
        element.style.transform += ` scale(${scale})`;
    }

    animateOnLoad() {
        // Initial animation for elements already in viewport
        setTimeout(() => {
            this.handleScroll();
        }, 100);
    }
}

// Parallax Controller
class ParallaxController {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
    }

    setupElements() {
        this.elements = [
            {
                element: document.querySelector('.hero'),
                speed: 0.5,
                axis: 'y'
            },
            {
                element: document.querySelector('.profile-placeholder'),
                speed: -0.3,
                axis: 'y'
            }
        ].filter(item => item.element);
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.update(), { passive: true });
    }

    update() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(({ element, speed, axis }) => {
            const value = scrollTop * speed;
            const transform = axis === 'y' ? 
                `translateY(${value}px)` : 
                `translateX(${value}px)`;
            
            element.style.transform = transform;
        });
    }
}

// Mouse Move Effects
class MouseMoveEffects {
    constructor() {
        this.init();
    }

    init() {
        this.bindMouseMoves();
        this.createCursorFollower();
    }

    bindMouseMoves() {
        const interactiveElements = document.querySelectorAll(
            '.project-card, .skill-card, .social-link, .btn'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e, element);
            });

            element.addEventListener('mouseleave', () => {
                this.handleMouseLeave(element);
            });
        });
    }

    handleMouseMove(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    handleMouseLeave(element) {
        element.style.transform = '';
        element.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            element.style.transition = '';
        }, 300);
    }

    createCursorFollower() {
        // Create custom cursor follower
        const follower = document.createElement('div');
        follower.className = 'cursor-follower';
        Object.assign(follower.style, {
            position: 'fixed',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
            pointerEvents: 'none',
            zIndex: '9999',
            transition: 'all 0.1s ease',
            mixBlendMode: 'difference'
        });
        
        document.body.appendChild(follower);
        
        document.addEventListener('mousemove', (e) => {
            follower.style.left = e.clientX - 10 + 'px';
            follower.style.top = e.clientY - 10 + 'px';
        });
        
        // Hide default cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.transform = 'scale(2)';
                follower.style.backgroundColor = 'rgba(37, 99, 235, 0.8)';
            });
            
            el.addEventListener('mouseleave', () => {
                follower.style.transform = 'scale(1)';
                follower.style.backgroundColor = 'rgba(37, 99, 235, 0.5)';
            });
        });
    }
}

// Text Animation Controller
class TextAnimator {
    constructor() {
        this.init();
    }

    init() {
        this.animateHeadings();
        this.animateNumbers();
        this.createTypewriterEffects();
    }

    animateHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3');
        
        headings.forEach(heading => {
            // Split text into words for staggered animation
            const text = heading.textContent;
            const words = text.split(' ');
            
            heading.innerHTML = words.map(word => 
                `<span class="word">${word}</span>`
            ).join(' ');
            
            const wordSpans = heading.querySelectorAll('.word');
            wordSpans.forEach((word, index) => {
                word.style.display = 'inline-block';
                word.style.opacity = '0';
                word.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    word.style.transition = 'all 0.6s ease';
                    word.style.opacity = '1';
                    word.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    }

    animateNumbers() {
        const numberElements = document.querySelectorAll('.stat-number');
        
        const animateNumber = (element) => {
            const target = parseInt(element.textContent);
            const duration = 2000;
            const steps = 60;
            const stepDuration = duration / steps;
            let current = 0;
            const increment = target / steps;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }, stepDuration);
        };
        
        // Use Intersection Observer to trigger number animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        numberElements.forEach(el => observer.observe(el));
    }

    createTypewriterEffects() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.dataset.text || element.textContent;
            element.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
}

// Particle System for Background Effects
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '-1',
            opacity: '0.3'
        });
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 5000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.particles = [];
            this.createParticles();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary checks
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }
            
            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize all animation systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize advanced animations
    new ScrollAnimator();
    new ParallaxController();
    new MouseMoveEffects();
    new TextAnimator();
    
    // Initialize particle system (optional - uncomment if desired)
    // new ParticleSystem();
    
    // Add loading screen removal
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);
    }
});

// Export classes for potential external use
window.AnimationSystems = {
    ScrollAnimator,
    ParallaxController,
    MouseMoveEffects,
    TextAnimator,
    ParticleSystem
};