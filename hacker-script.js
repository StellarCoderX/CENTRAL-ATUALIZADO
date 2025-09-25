// CENTRAL DE CHECKERS - HACKER SCRIPT AVANÇADO

class CyberHackerApp {
  constructor() {
    this.matrixCanvas = null;
    this.matrixCtx = null;
    this.matrixChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    this.matrixDrops = [];
    this.particles = [];
    this.glitchInterval = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initMatrixRain();
    this.initParticles();
    this.initGlitchEffects();
    this.initTypewriterEffects();
    this.initSoundEffects();
    this.initKeyboardShortcuts();
    this.initFormValidation();
    this.initCyberAnimations();
  }

  setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.handleFormSubmissions();
      this.setupToolCardAnimations();
      this.initTerminalEffects();
      this.setupCyberCursor();
    });

    window.addEventListener("resize", () => {
      this.handleResize();
    });

    window.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });

    // Detectar inatividade para ativar screensaver
    let inactivityTimer;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        this.activateScreensaver();
      }, 300000); // 5 minutos
    };

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    resetTimer();
  }

  // Matrix Rain Effect
  initMatrixRain() {
    const matrixBg = document.getElementById("matrixBg");
    if (!matrixBg) return;

    this.matrixCanvas = document.createElement("canvas");
    this.matrixCtx = this.matrixCanvas.getContext("2d");
    matrixBg.appendChild(this.matrixCanvas);

    this.resizeMatrixCanvas();
    this.initMatrixDrops();
    this.animateMatrix();
  }

  resizeMatrixCanvas() {
    if (!this.matrixCanvas) return;

    this.matrixCanvas.width = window.innerWidth;
    this.matrixCanvas.height = window.innerHeight;

    const columns = Math.floor(this.matrixCanvas.width / 20);
    this.matrixDrops = Array(columns).fill(1);
  }

  initMatrixDrops() {
    const columns = Math.floor(this.matrixCanvas.width / 20);
    this.matrixDrops = [];

    for (let i = 0; i < columns; i++) {
      this.matrixDrops[i] = Math.random() * this.matrixCanvas.height;
    }
  }

  animateMatrix() {
    if (!this.matrixCtx) return;

    // Fade effect
    this.matrixCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.matrixCtx.fillRect(
      0,
      0,
      this.matrixCanvas.width,
      this.matrixCanvas.height
    );

    // Matrix characters
    this.matrixCtx.fillStyle = "#00ff41";
    this.matrixCtx.font = "15px JetBrains Mono";

    for (let i = 0; i < this.matrixDrops.length; i++) {
      const char =
        this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      const x = i * 20;
      const y = this.matrixDrops[i] * 20;

      this.matrixCtx.fillText(char, x, y);

      if (y > this.matrixCanvas.height && Math.random() > 0.975) {
        this.matrixDrops[i] = 0;
      }
      this.matrixDrops[i]++;
    }

    requestAnimationFrame(() => this.animateMatrix());
  }

  // Floating Particles
  initParticles() {
    const container = document.getElementById("particlesContainer");
    if (!container) return;

    setInterval(() => {
      this.createParticle();
    }, 500);
  }

  createParticle() {
    const container = document.getElementById("particlesContainer");
    if (!container) return;

    const particle = document.createElement("div");
    particle.className = "particle";

    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 8 + 5;

    particle.style.left = startX + "px";
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.animationDuration = duration + "s";

    container.appendChild(particle);

    setTimeout(() => {
      if (container.contains(particle)) {
        container.removeChild(particle);
      }
    }, duration * 1000);
  }

  // Glitch Effects
  initGlitchEffects() {
    this.glitchInterval = setInterval(() => {
      this.triggerRandomGlitch();
    }, 10000);
  }

  triggerRandomGlitch() {
    const elements = document.querySelectorAll(".cyber-text, .cyber-title");
    if (elements.length === 0) return;

    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    const originalText = randomElement.textContent;

    randomElement.setAttribute("data-text", originalText);
    randomElement.classList.add("glitch");

    setTimeout(() => {
      randomElement.classList.remove("glitch");
    }, 500);
  }

  // Typewriter Effects
  initTypewriterEffects() {
    const typewriterElements = document.querySelectorAll(".cyber-title");
    typewriterElements.forEach((element, index) => {
      setTimeout(() => {
        this.typewriterEffect(element);
      }, index * 1000);
    });
  }

  typewriterEffect(element) {
    const text = element.textContent;
    element.textContent = "";
    element.style.borderRight = "2px solid #00ff41";

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;

        // Efeito de digitação com som
        this.playTypingSound();
      } else {
        clearInterval(timer);
        setTimeout(() => {
          element.style.borderRight = "none";
        }, 1000);
      }
    }, 100);
  }

  // Sound Effects
  initSoundEffects() {
    this.audioContext = null;
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (e) {
      console.log("Audio context not supported");
    }
  }

  playTypingSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playClickSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.05
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // Keyboard Shortcuts
  initKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + Enter para submeter formulário
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const activeForm = document.querySelector("form");
        if (activeForm) {
          this.playClickSound();
          activeForm.submit();
        }
      }

      // F11 para fullscreen
      if (e.key === "F11") {
        e.preventDefault();
        this.toggleFullscreen();
      }

      // Escape para limpar campos
      if (e.key === "Escape") {
        const activeInput = document.activeElement;
        if (activeInput && activeInput.tagName === "INPUT") {
          activeInput.blur();
        }
      }

      // Konami Code
      this.handleKonamiCode(e);
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  // Konami Code Easter Egg
  handleKonamiCode(e) {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];

    if (!this.konamiSequence) this.konamiSequence = [];

    this.konamiSequence.push(e.code);

    if (this.konamiSequence.length > konamiCode.length) {
      this.konamiSequence.shift();
    }

    if (
      this.konamiSequence.length === konamiCode.length &&
      this.konamiSequence.every((key, index) => key === konamiCode[index])
    ) {
      this.activateHackerMode();
    }
  }

  activateHackerMode() {
    document.body.style.filter = "hue-rotate(180deg) saturate(2)";
    this.showNotification("HACKER MODE ATIVADO", "success");

    setTimeout(() => {
      document.body.style.filter = "";
    }, 5000);
  }

  // Form Handling
  handleFormSubmissions() {
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          this.showCyberLoadingState(submitBtn);
          this.playClickSound();
        }
      });
    });
  }

  showCyberLoadingState(button) {
    button.classList.add("loading");
    button.disabled = true;

    const originalHTML = button.innerHTML;
    button.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> <span class="btn-text">PROCESSANDO...</span>';

    // Simular tempo de processamento
    setTimeout(() => {
      if (button.classList.contains("loading")) {
        button.innerHTML = originalHTML;
        button.classList.remove("loading");
        button.disabled = false;
      }
    }, 2000);
  }

  // Tool Card Animations
  setupToolCardAnimations() {
    const toolCards = document.querySelectorAll(".cyber-tool-card");
    toolCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("cyber-fade-in");

      card.addEventListener("mouseenter", () => {
        this.animateCyberCardHover(card, true);
        this.playClickSound();
      });

      card.addEventListener("mouseleave", () => {
        this.animateCyberCardHover(card, false);
      });

      card.addEventListener("click", () => {
        this.triggerCardClickEffect(card);
      });
    });
  }

  animateCyberCardHover(card, isHover) {
    const icon = card.querySelector(".cyber-tool-icon");
    if (icon) {
      if (isHover) {
        icon.style.transform = "scale(1.1) rotate(5deg)";
        icon.style.boxShadow = "0 0 30px rgba(0, 255, 65, 0.8)";
      } else {
        icon.style.transform = "scale(1) rotate(0deg)";
        icon.style.boxShadow = "";
      }
    }
  }

  triggerCardClickEffect(card) {
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
    }, 150);
  }

  // Terminal Effects
  initTerminalEffects() {
    const terminalElements = document.querySelectorAll(".terminal-content");
    terminalElements.forEach((terminal) => {
      this.addTerminalCursor(terminal);
    });
  }

  addTerminalCursor(terminal) {
    const cursor = document.createElement("span");
    cursor.textContent = "█";
    cursor.style.animation = "blink 1s infinite";
    cursor.style.color = "#00ff41";
    terminal.appendChild(cursor);
  }

  // Cyber Cursor
  setupCyberCursor() {
    const cursor = document.createElement("div");
    cursor.className = "cyber-cursor";
    cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #00ff41;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX - 10 + "px";
      cursor.style.top = e.clientY - 10 + "px";
    });

    document.addEventListener("mousedown", () => {
      cursor.style.transform = "scale(0.8)";
    });

    document.addEventListener("mouseup", () => {
      cursor.style.transform = "scale(1)";
    });
  }

  // Form Validation
  initFormValidation() {
    const inputs = document.querySelectorAll(".cyber-input");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        this.addInputGlow(input);
      });

      input.addEventListener("blur", () => {
        this.removeInputGlow(input);
        this.validateCyberField(input);
      });

      input.addEventListener("input", () => {
        this.clearFieldError(input);
        this.addTypingEffect(input);
      });
    });
  }

  addInputGlow(input) {
    input.style.boxShadow =
      "0 0 20px rgba(0, 255, 65, 0.5), inset 0 0 20px rgba(0, 255, 65, 0.2)";
  }

  removeInputGlow(input) {
    input.style.boxShadow = "";
  }

  addTypingEffect(input) {
    input.style.textShadow = "0 0 5px #00ff41";
    setTimeout(() => {
      input.style.textShadow = "";
    }, 100);
  }

  validateCyberField(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute("required");

    if (isRequired && value === "") {
      this.showCyberFieldError(input, "CAMPO OBRIGATÓRIO");
      return false;
    }

    if (input.type === "email" && value && !this.validateEmail(value)) {
      this.showCyberFieldError(input, "EMAIL INVÁLIDO");
      return false;
    }

    if (input.type === "password" && value && value.length < 8) {
      this.showCyberFieldError(input, "SENHA MUITO CURTA");
      return false;
    }

    this.showCyberFieldSuccess(input);
    return true;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showCyberFieldError(input, message) {
    input.style.borderColor = "#ff0040";
    input.style.boxShadow = "0 0 20px rgba(255, 0, 64, 0.5)";
    this.showCyberFieldMessage(input, message, "error");
  }

  showCyberFieldSuccess(input) {
    input.style.borderColor = "#00ff41";
    input.style.boxShadow = "0 0 20px rgba(0, 255, 65, 0.5)";
    this.removeCyberFieldMessage(input);
  }

  clearFieldError(input) {
    if (
      input.style.borderColor === "rgb(255, 0, 64)" &&
      input.value.trim() !== ""
    ) {
      input.style.borderColor = "#00ff41";
      input.style.boxShadow = "";
      this.removeCyberFieldMessage(input);
    }
  }

  showCyberFieldMessage(input, message, type) {
    this.removeCyberFieldMessage(input);

    const messageEl = document.createElement("div");
    messageEl.className = `cyber-field-message cyber-field-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: ${type === "error" ? "#ff0040" : "#00ff41"};
            font-family: 'JetBrains Mono', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 0 5px currentColor;
        `;

    input.parentNode.appendChild(messageEl);
  }

  removeCyberFieldMessage(input) {
    const existingMessage = input.parentNode.querySelector(
      ".cyber-field-message"
    );
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  // Cyber Animations
  initCyberAnimations() {
    this.observeElements();
    this.initScrollAnimations();
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("cyber-fade-in");
        }
      });
    });

    const elements = document.querySelectorAll(
      ".cyber-card, .cyber-tool-card, .cyber-stat-card"
    );
    elements.forEach((el) => observer.observe(el));
  }

  initScrollAnimations() {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollAnimations();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateScrollAnimations() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    const cyberGrid = document.querySelector(".cyber-grid");
    if (cyberGrid) {
      cyberGrid.style.transform = `translateY(${rate}px)`;
    }
  }

  // Mouse Movement Effects
  handleMouseMove(e) {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    const particles = document.querySelectorAll(".particle");
    particles.forEach((particle, index) => {
      const speed = (index + 1) * 0.5;
      const xPos = x * speed * 10;
      const yPos = y * speed * 10;

      particle.style.transform += ` translate(${xPos}px, ${yPos}px)`;
    });

    // Parallax effect on cards
    const cards = document.querySelectorAll(".cyber-card");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardX = (e.clientX - rect.left - rect.width / 2) / 25;
      const cardY = (e.clientY - rect.top - rect.height / 2) / 25;

      card.style.transform = `perspective(1000px) rotateY(${cardX}deg) rotateX(${-cardY}deg)`;
    });
  }

  // Resize Handler
  handleResize() {
    this.resizeMatrixCanvas();
    this.initMatrixDrops();
  }

  // Screensaver
  activateScreensaver() {
    const screensaver = document.createElement("div");
    screensaver.className = "cyber-screensaver";
    screensaver.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', monospace;
            font-size: 3rem;
            color: #00ff41;
            text-shadow: 0 0 20px #00ff41;
            animation: cyber-pulse-anim 2s ease-in-out infinite;
        `;
    screensaver.textContent = "SISTEMA EM STANDBY";

    document.body.appendChild(screensaver);

    const deactivate = () => {
      screensaver.remove();
      document.removeEventListener("mousemove", deactivate);
      document.removeEventListener("keypress", deactivate);
    };

    document.addEventListener("mousemove", deactivate);
    document.addEventListener("keypress", deactivate);
  }

  // Notification System
  showNotification(message, type = "info", duration = 4000) {
    const notification = document.createElement("div");
    notification.className = `cyber-notification cyber-notification-${type}`;

    const colors = {
      success: "#00ff41",
      error: "#ff0040",
      warning: "#ffaa00",
      info: "#0099ff",
    };

    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    };

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid ${colors[type]};
            border-radius: 8px;
            color: ${colors[type]};
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 0 20px ${colors[type]}50;
            z-index: 9999;
            max-width: 300px;
            text-shadow: 0 0 10px ${colors[type]};
        `;

    notification.innerHTML = `<i class="${icons[type]}"></i> ${message}`;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => (notification.style.transform = "translateX(0)"), 100);

    // Animar saída
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  // Utility Methods
  debounce(func, wait) {
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

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Cleanup
  destroy() {
    if (this.glitchInterval) {
      clearInterval(this.glitchInterval);
    }

    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Initialize the Cyber Hacker App
const cyberApp = new CyberHackerApp();

// Export for global use
window.CyberHackerApp = cyberApp;

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .cyber-cursor {
        animation: cursor-pulse 1s ease-in-out infinite;
    }
    
    @keyframes cursor-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Console Easter Egg
console.log(`
    ╔══════════════════════════════════════╗
    ║        CENTRAL DE CHECKERS           ║
    ║           HACKER MODE                ║
    ║                                      ║
    ║  Digite 'help()' para comandos       ║
    ║  Digite 'matrix()' para Matrix Rain  ║
    ║  Digite 'glitch()' para Glitch       ║
    ╚══════════════════════════════════════╝
`);

window.help = () => {
  console.log(`
    Comandos disponíveis:
    - help(): Mostra esta ajuda
    - matrix(): Ativa/desativa Matrix Rain
    - glitch(): Ativa efeito glitch
    - hacker(): Ativa modo hacker
    - particles(): Cria explosão de partículas
    - sound(): Testa efeitos sonoros
    `);
};

window.matrix = () => {
  const matrixBg = document.getElementById("matrixBg");
  if (matrixBg) {
    matrixBg.style.display =
      matrixBg.style.display === "none" ? "block" : "none";
    console.log("Matrix Rain toggled");
  }
};

window.glitch = () => {
  cyberApp.triggerRandomGlitch();
  console.log("Glitch effect activated");
};

window.hacker = () => {
  cyberApp.activateHackerMode();
  console.log("Hacker mode activated");
};

window.particles = () => {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => cyberApp.createParticle(), i * 100);
  }
  console.log("Particle explosion created");
};

window.sound = () => {
  cyberApp.playClickSound();
  console.log("Sound effect played");
};
