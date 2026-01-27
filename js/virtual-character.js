// Virtual Character with Welcome Phrases Based on Scroll Position

class VirtualCharacterManager {
  constructor() {
    this.characters = [];
    this.scrollPositions = [
      { threshold: 0, phrases: [
        "🌟 مرحباً! أنا صديق عماد الافتراضي",
        "🇬🇧 Hello! I'm Imad's virtual friend",
        "🇫🇷 Salut! Je suis l'ami virtuel d'Imad"
      ]},
      { threshold: 0.33, phrases: [
        "👋 عماد أوصاني بالترحيب بك",
        "🇬🇧 Imad asked me to welcome you",
        "🇫🇷 Imad m'a demandé de vous accueillir"
      ]},
      { threshold: 0.66, phrases: [
        "💬 تواصل مع صديقي.. فلن تندم!",
        "🇬🇧 Connect with my friend, you won't regret it!",
        "🇫🇷 Contacte mon ami, tu ne le regretteras pas!"
      ]}
    ];
    
    // Special message for the social section
    this.socialMessage = {
      phrase: [
        "🌟 تواصل مع صديقي عماد فلن تندم!",
        "🇬🇧 Connect with my friend Imad, you won't regret it!",
        "🇫🇷 Contacte mon ami Imad, tu ne le regretteras pas!"
      ]
    };
    this.currentPhraseIndex = 0;
    this.socialCharacterShown = false;
    this.init();
  }

  init() {
    this.createCharacters();
    this.bindScrollEvent();
    this.updateCharactersBasedOnScroll();
    
    // Start periodic message cycling
    setInterval(() => {
      this.cycleMessages();
    }, 12000); // Cycle every 12 seconds
  }

  createCharacters() {
    const positions = ['mr', 'mr2']; // Right side positions only - two characters only
    
    positions.forEach((pos, index) => {
      const container = document.createElement('div');
      container.className = `virtual-character-container position-${pos}`;
      
      const character = document.createElement('div');
      character.className = 'virtual-character';
      character.innerHTML = `
        <div class="character-avatar">
          <div class="eye left-eye"></div>
          <div class="eye right-eye"></div>
          <div class="smile"></div>
          <div class="blush left-blush"></div>
          <div class="blush right-blush"></div>
        </div>
        <div class="speech-bubble">Loading...</div>
      `;
      
      container.appendChild(character);
      document.body.appendChild(container);
      
      this.characters.push({
        container: container,
        character: character,
        speechBubble: character.querySelector('.speech-bubble'),
        lastShown: 0,
        isVisible: false,
        isAlwaysVisible: false,
        lastLanguageIndex: -1
      });
    });
    
    // Add static character from HTML (position-bottom)
    const staticCharacter = document.querySelector('.virtual-character-container.position-bottom');
    if (staticCharacter) {
      const characterElement = staticCharacter.querySelector('.virtual-character');
      const speechBubble = staticCharacter.querySelector('.speech-bubble');
      
      if (characterElement && speechBubble) {
        this.characters.push({
          container: staticCharacter,
          character: characterElement,
          speechBubble: speechBubble,
          lastShown: 0,
          isVisible: false,
          isStatic: true, // Mark as static character
          isAlwaysVisible: true, // Static character is always visible
          lastLanguageIndex: -1
        });
        
        // Make static character visible immediately
        characterElement.style.opacity = '1';
        characterElement.style.visibility = 'visible';
        
        // Show initial message for static character
        const languageIndex = 0; // Start with first language
        const message = this.socialMessage.phrase[languageIndex];
        
        // Show typing dots first
        setTimeout(() => {
          if (speechBubble) {
            speechBubble.textContent = '...';
            speechBubble.classList.add('show');
            
            // After 1 second, show the actual message
            setTimeout(() => {
              if (speechBubble) {
                speechBubble.textContent = message;
              }
            }, 1000);
          }
        }, 1000); // Delay initial display to allow page to load
      }
    }
  }

  bindScrollEvent() {
    let ticking = false;
    
    const updateScroll = () => {
      this.updateCharactersBasedOnScroll();
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    }, { passive: true });
    
    // Also update on resize
    window.addEventListener('resize', () => {
      setTimeout(() => this.updateCharactersBasedOnScroll(), 100);
    });
  }

  getCurrentScrollPercentage() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    return isNaN(scrollPercent) ? 0 : scrollPercent;
  }

  getPhraseForScrollPosition(scrollPercent) {
    // Find the appropriate phrase based on scroll position
    let applicablePhrases = this.scrollPositions[0].phrases; // Default to first
    
    for (let i = this.scrollPositions.length - 1; i >= 0; i--) {
      if (scrollPercent >= this.scrollPositions[i].threshold) {
        applicablePhrases = this.scrollPositions[i].phrases;
        break;
      }
    }
    
    // Cycle through phrases for the current scroll position
    const phrase = applicablePhrases[this.currentPhraseIndex % applicablePhrases.length];
    this.currentPhraseIndex++;
    return phrase;
  }

  updateCharactersBasedOnScroll() {
    const scrollPercent = this.getCurrentScrollPercentage();
    
    // Only show messages when scrolled to appropriate section
    this.characters.forEach((char, index) => {
      // Skip static characters
      if (char.isStatic) return;
      
      // Make character always visible
      if (!char.isAlwaysVisible) {
        // Show the character immediately
        char.character.style.opacity = '1';
        char.character.style.visibility = 'visible';
        char.isAlwaysVisible = true;
        char.hasShownInitialMessage = false; // Track if initial message has been shown
      }
      
      // Check if we're in the section for this character
      const charThreshold = index * 0.33; // 0, 0.33, 0.66 for three characters
      const showSection = scrollPercent >= charThreshold && scrollPercent < charThreshold + 0.33;
      
      if (showSection && !char.isVisible && !char.hasShownInitialMessage) {
        // Show initial message - always start with Arabic (index 0)
        const scrollPositionIndex = index % this.scrollPositions.length;
        const phrases = this.scrollPositions[scrollPositionIndex].phrases;
        const message = phrases[0]; // Always start with Arabic (first language)
        char.lastLanguageIndex = 0; // Set to Arabic index
        
        // Show typing dots first
        char.speechBubble.textContent = '...';
        char.speechBubble.classList.add('show');
        char.isVisible = true;
        
        // After 1 second, show the actual message
        setTimeout(() => {
          if (char.speechBubble) {
            char.speechBubble.textContent = message;
          }
        }, 1000);
        
        // Keep it visible
        setTimeout(() => {
          if (char.speechBubble) {
            char.speechBubble.classList.remove('show');
            char.isVisible = false;
            char.hasShownInitialMessage = true; // Mark initial message as shown
          }
        }, 9000); // Show for 9 seconds initially
      }
    });
    
    // Check if we're in the social section
    this.checkSocialSection(scrollPercent);
    
    // Handle static character visibility based on scroll position
    this.handleStaticCharacter(scrollPercent);
  }
  
  checkSocialSection(scrollPercent) {
    // Calculate if we're in the social section (around 80-95% of the page)
    if (scrollPercent >= 0.8 && scrollPercent <= 0.95 && !this.socialCharacterShown) {
      // Show the social message on one of the characters
      const socialChar = this.characters[0]; // Use the first character
      if (socialChar && !socialChar.isVisible) {
        // Cycle through languages for social message
        const languageIndex = (socialChar.lastLanguageIndex || 0) + 1;
        const message = this.socialMessage.phrase[languageIndex % this.socialMessage.phrase.length];
        socialChar.lastLanguageIndex = languageIndex;
        
        // Show typing dots first
        socialChar.speechBubble.textContent = '...';
        socialChar.speechBubble.classList.add('show');
        socialChar.isVisible = true;
        
        // After 1 second, show the actual message
        setTimeout(() => {
          if (socialChar.speechBubble) {
            socialChar.speechBubble.textContent = message;
          }
        }, 1000);
        
        // Hide after a delay
        setTimeout(() => {
          if (socialChar.speechBubble) {
            socialChar.speechBubble.classList.remove('show');
            socialChar.isVisible = false;
          }
        }, 6000);
        
        this.socialCharacterShown = true;
      }
    }
    
    // Reset the social character flag when scrolling back up
    if (scrollPercent < 0.75 && this.socialCharacterShown) {
      this.socialCharacterShown = false;
    }
  }

  // Method to manually trigger a phrase
  showRandomPhrase() {
    const randomChar = this.characters[Math.floor(Math.random() * this.characters.length)];
    if (randomChar && !randomChar.isStatic) {
      // Get the character's assigned scroll position
      const charIndex = this.characters.indexOf(randomChar);
      const scrollPositionIndex = charIndex % this.scrollPositions.length;
      const phrases = this.scrollPositions[scrollPositionIndex].phrases;
      
      // Cycle to next language
      const languageIndex = (randomChar.lastLanguageIndex || 0) + 1;
      const nextPhrase = phrases[languageIndex % phrases.length];
      randomChar.lastLanguageIndex = languageIndex;
      
      // Show typing dots first
      randomChar.speechBubble.textContent = '...';
      randomChar.speechBubble.classList.add('show');
      
      // After 1 second, show the actual message
      setTimeout(() => {
        if (randomChar.speechBubble) {
          randomChar.speechBubble.textContent = nextPhrase;
        }
      }, 1000);
      
      setTimeout(() => {
        if (randomChar.speechBubble) {
          randomChar.speechBubble.classList.remove('show');
        }
      }, 5000);
    }
  }
  
  // Method to cycle messages for all characters
  cycleMessages() {
    this.characters.forEach((char, index) => {
      if (!char.isAlwaysVisible) return; // Include static characters in cycling
      
      // Cycle through languages within the current message for this character
      let phrases;
      if (char.isStatic) {
        // Static character uses socialMessage phrases
        phrases = this.socialMessage.phrase;
      } else {
        // Dynamic characters use scrollPositions phrases
        const scrollPositionIndex = index % this.scrollPositions.length;
        phrases = this.scrollPositions[scrollPositionIndex].phrases;
      }
      const languageIndex = (char.lastLanguageIndex || 0) + 1;
      const message = phrases[languageIndex % phrases.length];
      
      // Show typing dots first
      char.speechBubble.textContent = '...';
      char.speechBubble.classList.add('show');
      char.lastLanguageIndex = languageIndex;
      char.isVisible = true;
      
      // After 1 second, show the actual message
      setTimeout(() => {
        if (char.speechBubble) {
          // Wrap each line in a span for circular text arrangement
          const lines = message.split('\n');
          const wrappedMessage = lines.map(line => `<span>${line}</span>`).join('');
          char.speechBubble.innerHTML = wrappedMessage;
        }
      }, 1000);
      
      // Hide after delay
      setTimeout(() => {
        if (char.speechBubble) {
          char.speechBubble.classList.remove('show');
          char.isVisible = false;
        }
      }, 7000);
    });
  }
  
  // Handle static character visibility
  handleStaticCharacter(scrollPercent) {
    const staticChar = this.characters.find(char => char.isStatic);
    if (staticChar && !staticChar.isInitialized) {
      // Show the static character message when user scrolls to bottom (90%+)
      if (scrollPercent >= 0.9 && !staticChar.isVisible) {
        // Show typing dots first
        staticChar.speechBubble.textContent = '...';
        staticChar.speechBubble.classList.add('show');
        staticChar.isVisible = true;
        staticChar.isInitialized = true;
        
        // Cycle through languages for static character
        const languageIndex = (staticChar.lastLanguageIndex || 0) + 1;
        const message = this.socialMessage.phrase[languageIndex % this.socialMessage.phrase.length];
        staticChar.lastLanguageIndex = languageIndex;
        
        // After 1 second, show the actual message
        setTimeout(() => {
          if (staticChar.speechBubble) {
            staticChar.speechBubble.textContent = message;
          }
        }, 1000);
        
        // Keep it visible
        setTimeout(() => {
          if (staticChar.speechBubble) {
            staticChar.speechBubble.classList.remove('show');
            staticChar.isVisible = false;
          }
        }, 9000); // Show for 9 seconds
      }
    }
  }
}

// Initialize the virtual character manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Make sure Font Awesome is loaded before initializing
  const checkFontAwesome = () => {
    if (typeof window.FontAwesomeConfig !== 'undefined' || document.querySelector('[data-fa-i2svg]')) {
      new VirtualCharacterManager();
    } else {
      // Wait a bit and check again
      setTimeout(checkFontAwesome, 100);
    }
  };
  
  // Start checking for Font Awesome
  checkFontAwesome();
  
  // Fallback initialization in case Font Awesome doesn't load properly
  setTimeout(() => {
    new VirtualCharacterManager();
  }, 2000);
});

// Also export for potential external use
window.VirtualCharacterManager = VirtualCharacterManager;