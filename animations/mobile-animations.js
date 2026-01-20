// Mobile Touch Interaction Animations

class MobileTouchAnimations {
    constructor() {
        this.init();
        this.profileImage = null;
        this.animationInterval = null;
        this.isMobile = this.detectMobile();
        this.isLowEndDevice = this.detectLowEndDevice();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window ||
               navigator.maxTouchPoints > 0;
    }

    detectLowEndDevice() {
        // Simple detection based on device memory and cores
        const memory = navigator.deviceMemory || 4; // GB
        const cores = navigator.hardwareConcurrency || 4;
        return memory < 2 || cores < 4;
    }

    init() {
        // Reduce animations on low-end devices
        if (this.isLowEndDevice) {
            this.reduceAnimations();
        }
        
        this.bindTouchEvents();
        this.bindGestureEvents();
        this.bindShakeDetection();
        this.bindProfileImageAnimations();
        
        // Add mobile-specific optimizations
        if (this.isMobile) {
            this.optimizeForMobile();
        }
    }

    reduceAnimations() {
        // Add class to reduce animation intensity
        document.body.classList.add('low-end-device');
        
        // Reduce animation durations
        const style = document.createElement('style');
        style.textContent = `
            .bounce-mobile { animation-duration: 0.3s !important; }
            .shake-mobile { animation-duration: 0.2s !important; }
            .pulse-mobile { animation-duration: 1s !important; }
            .flip-mobile { animation-duration: 0.4s !important; }
        `;
        document.head.appendChild(style);
    }

    optimizeForMobile() {
        // Add mobile-specific optimizations
        document.body.classList.add('mobile-device');
        
        // Optimize touch targets
        const touchTargets = document.querySelectorAll('button, a, .btn');
        touchTargets.forEach(target => {
            if (!target.style.minHeight) {
                target.style.minHeight = '44px';
                target.style.minWidth = '44px';
            }
        });
    }

    bindTouchEvents() {
        // Performance optimization: Only add touch events on mobile
        if (!this.isMobile) return;
        
        // Add touch ripple effect to interactive elements
        const interactiveElements = document.querySelectorAll(
            '.btn, .project-card, .social-link-pro, .nav-link'
        );

        interactiveElements.forEach(element => {
            // Debounce touch events to prevent multiple rapid triggers
            let touchActive = false;
            
            element.addEventListener('touchstart', (e) => {
                if (touchActive) return;
                touchActive = true;
                
                this.createTouchRipple(e, element);
                
                setTimeout(() => {
                    touchActive = false;
                }, 300);
            }, { passive: true });

            element.addEventListener('touchend', () => {
                this.removeTouchRipple(element);
            }, { passive: true });
        });

        // Add press and hold animations
        const longPressElements = document.querySelectorAll('.project-card, .social-link-pro');
        
        longPressElements.forEach(element => {
            let pressTimer;
            
            element.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    element.classList.add('long-press');
                    this.triggerHapticFeedback();
                }, 500);
            });

            element.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
                element.classList.remove('long-press');
            });

            element.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
                element.classList.remove('long-press');
            });
        });
    }

    createTouchRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.touches[0].clientX - rect.left - size / 2;
        const y = e.touches[0].clientY - rect.top - size / 2;
        
        ripple.className = 'touch-ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-mobile 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Add ripple animation if not exists
        if (!document.getElementById('ripple-mobile-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-mobile-style';
            style.textContent = `
                @keyframes ripple-mobile {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    removeTouchRipple(element) {
        const ripples = element.querySelectorAll('.touch-ripple-effect');
        ripples.forEach(ripple => {
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    }

    bindGestureEvents() {
        // Swipe detection
        let startX, startY, startTime;
        let isSwiping = false;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = new Date().getTime();
            isSwiping = true;
        });

        document.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Only consider significant movements
            if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
                const element = e.target.closest('.swipe-container') || document.body;
                
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    // Horizontal swipe
                    if (diffX > 0) {
                        element.classList.add('swipe-left');
                    } else {
                        element.classList.add('swipe-right');
                    }
                }
                
                setTimeout(() => {
                    element.classList.remove('swipe-left', 'swipe-right');
                }, 500);
                
                isSwiping = false;
            }
        });

        document.addEventListener('touchend', () => {
            isSwiping = false;
        });
    }

    bindShakeDetection() {
        // Device motion detection for shake
        if (window.DeviceMotionEvent) {
            let lastAcceleration = { x: 0, y: 0, z: 0 };
            let shakeThreshold = 15;
            
            window.addEventListener('devicemotion', (e) => {
                const acceleration = e.accelerationIncludingGravity;
                if (!acceleration) return;
                
                const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
                const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
                const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);
                
                if (deltaX > shakeThreshold || deltaY > shakeThreshold || deltaZ > shakeThreshold) {
                    this.handleShake();
                }
                
                lastAcceleration = {
                    x: acceleration.x,
                    y: acceleration.y,
                    z: acceleration.z
                };
            });
        }
    }

    handleShake() {
        // Trigger fun animations when device is shaken
        const elements = document.querySelectorAll('.project-card, .social-link-pro');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('shake-mobile');
                setTimeout(() => {
                    element.classList.remove('shake-mobile');
                }, 500);
            }, index * 100);
        });
        
        this.triggerHapticFeedback();
    }

    triggerHapticFeedback() {
        // Try to trigger device vibration
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
    }

    // Public methods for manual triggering
    triggerAnimation(element, animationClass) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 1000);
    }

    addDoubleTap(element) {
        let lastTap = 0;
        
        element.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                element.classList.add('double-tap');
                setTimeout(() => {
                    element.classList.remove('double-tap');
                }, 600);
                this.triggerHapticFeedback();
                e.preventDefault();
            }
            
            lastTap = currentTime;
        });
    }

    bindProfileImageAnimations() {
        // Get profile image elements
        this.profileImage = document.querySelector('.profile-image');
        const profileContainer = document.querySelector('.profile-image-container');
        
        if (!this.profileImage) return;
        
        // Add click animation to profile image
        this.profileImage.addEventListener('click', () => {
            this.triggerRandomProfileAnimation();
        });
        
        // Add double tap for special animation
        this.addDoubleTap(this.profileImage);
        
        // Start continuous gentle rotation on mobile
        if (window.innerWidth <= 768) {
            this.startContinuousRotation();
        }
        
        // Add shake detection for profile animations
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (e) => {
                const acceleration = e.accelerationIncludingGravity;
                if (!acceleration) return;
                
                // Trigger profile animation on strong movement
                if (Math.abs(acceleration.x) > 20 || Math.abs(acceleration.y) > 20 || Math.abs(acceleration.z) > 20) {
                    this.triggerProfileShakeAnimation();
                }
            });
        }
    }

    triggerRandomProfileAnimation() {
        const animations = [
            'click-rotate',
            'bounce-profile',
            'swing-profile',
            'float-profile'
        ];
        
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        this.applyProfileAnimation(randomAnimation);
    }

    triggerProfileShakeAnimation() {
        // Only trigger if not already animating
        if (this.profileImage.classList.length > 1) return;
        
        this.applyProfileAnimation('spin-fall');
        this.triggerHapticFeedback();
    }

    applyProfileAnimation(animationClass) {
        // Remove existing animations
        this.profileImage.classList.remove(
            'click-rotate', 'bounce-profile', 'swing-profile', 
            'float-profile', 'spin-fall', 'rotate-profile',
            'fall-profile', 'continuous-spin'
        );
        
        // Add new animation
        this.profileImage.classList.add(animationClass);
        
        // Remove animation class after completion
        const durations = {
            'click-rotate': 800,
            'bounce-profile': 1500,
            'swing-profile': 3000,
            'float-profile': 4000,
            'spin-fall': 3000
        };
        
        setTimeout(() => {
            this.profileImage.classList.remove(animationClass);
        }, durations[animationClass] || 2000);
    }

    startContinuousRotation() {
        // Gentle continuous rotation for mobile
        setTimeout(() => {
            if (this.profileImage && !this.profileImage.classList.contains('continuous-spin')) {
                this.profileImage.classList.add('continuous-spin');
            }
        }, 5000);
    }
}

// Initialize mobile animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileTouchAnimations();
    
    // Add double tap to project cards
    const projectCards = document.querySelectorAll('.project-card');
    const mobileAnimations = new MobileTouchAnimations();
    
    projectCards.forEach(card => {
        mobileAnimations.addDoubleTap(card);
    });
    
    // Show mobile hint on mobile devices after delay
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            const mobileHint = document.getElementById('mobileHint');
            if (mobileHint) {
                document.body.classList.add('mobile-hint-shown');
                mobileHint.classList.add('show');
                
                // Hide after 5 seconds
                setTimeout(() => {
                    mobileHint.classList.remove('show');
                }, 5000);
            }
        }, 3000);
    }
});

// Export for global use
window.MobileTouchAnimations = MobileTouchAnimations;