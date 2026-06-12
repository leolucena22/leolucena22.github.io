/**
 * Dia dos Namorados 2026 – Typewriter Engine
 * Provides a realistic typewriter effect that types each paragraph
 * sequentially, with variable keystroke timing and a blinking cursor.
 */

(function () {
  'use strict';

  // ── Configuration ──
  const CONFIG = {
    charDelay: 38,            // base ms between characters
    charJitter: 22,           // random jitter added to charDelay
    paragraphPause: 600,      // pause between paragraphs
    initialDelay: 2200,       // delay before typing starts
    commaDelay: 180,          // extra pause at commas
    periodDelay: 300,         // extra pause at periods
    heartCount: 12,           // floating background hearts
    heartInterval: 3000,      // ms between new floating hearts
  };

  // ── Scroll Progress Bar ──
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  // ── Floating Hearts ──
  function spawnFloatingHeart() {
    const container = document.getElementById('floating-hearts-bg');
    if (!container) return;
    const heart = document.createElement('span');
    heart.className = 'float-heart';
    heart.textContent = '♥';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 10 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 6 + 8) + 's';
    heart.style.animationDelay = '0s';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 16000);
  }

  function initFloatingHearts() {
    // Spawn initial batch
    for (let i = 0; i < CONFIG.heartCount; i++) {
      setTimeout(() => spawnFloatingHeart(), i * 400);
    }
    // Continue spawning
    setInterval(spawnFloatingHeart, CONFIG.heartInterval);
  }

  // ── Click Sparkles ──
  function initClickSparkles() {
    document.addEventListener('click', (e) => {
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.className = 'click-spark';
        spark.style.left = (e.clientX + (Math.random() - 0.5) * 60) + 'px';
        spark.style.top = (e.clientY + (Math.random() - 0.5) * 60) + 'px';
        spark.style.width = (Math.random() * 4 + 3) + 'px';
        spark.style.height = spark.style.width;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 900);
      }
    });
  }

  // ── Typewriter Engine ──
  class TypewriterEngine {
    constructor() {
      this.paragraphs = Array.from(document.querySelectorAll('.typewriter-paragraph'));
      this.signatureBlock = document.querySelector('.signature-block');
      this.currentParagraph = 0;
      this.cursor = null;
      this.isTyping = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    start() {
      if (this.reducedMotion) {
        this.revealAll();
        return;
      }
      // Create cursor element
      this.cursor = document.createElement('span');
      this.cursor.className = 'typewriter-cursor';
      this.cursor.setAttribute('aria-hidden', 'true');

      setTimeout(() => this.typeNextParagraph(), CONFIG.initialDelay);
    }

    revealAll() {
      this.paragraphs.forEach((p) => {
        p.textContent = p.dataset.text;
        p.classList.add('visible');
      });
      if (this.signatureBlock) {
        this.signatureBlock.classList.add('visible');
      }
    }

    typeNextParagraph() {
      if (this.currentParagraph >= this.paragraphs.length) {
        this.onComplete();
        return;
      }

      const p = this.paragraphs[this.currentParagraph];
      const fullText = p.dataset.text;
      p.textContent = '';
      p.classList.add('visible');
      p.appendChild(this.cursor);

      this.isTyping = true;
      this.typeText(p, fullText, 0);
    }

    typeText(element, text, index) {
      if (index >= text.length) {
        // Remove cursor from this paragraph
        if (this.cursor.parentNode === element) {
          element.removeChild(this.cursor);
        }
        this.currentParagraph++;
        this.isTyping = false;

        // Scroll the next paragraph into view
        if (this.currentParagraph < this.paragraphs.length) {
          const nextP = this.paragraphs[this.currentParagraph];
          nextP.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => this.typeNextParagraph(), CONFIG.paragraphPause);
        return;
      }

      const char = text[index];

      // Insert character before cursor
      const textNode = document.createTextNode(char);
      element.insertBefore(textNode, this.cursor);

      // Determine delay for next character
      let delay = CONFIG.charDelay + Math.random() * CONFIG.charJitter;
      if (char === ',' || char === ';') delay += CONFIG.commaDelay;
      if (char === '.' || char === '!' || char === '?') delay += CONFIG.periodDelay;
      if (char === '\n') delay += CONFIG.periodDelay;

      setTimeout(() => this.typeText(element, text, index + 1), delay);
    }

    onComplete() {
      // Show signature with fade
      if (this.signatureBlock) {
        this.signatureBlock.classList.add('visible');
        this.signatureBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      // Remove cursor
      if (this.cursor && this.cursor.parentNode) {
        this.cursor.parentNode.removeChild(this.cursor);
      }
    }
  }

  // ── Initialization ──
  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initFloatingHearts();
    initClickSparkles();

    // Store text content and clear paragraphs
    const paragraphs = document.querySelectorAll('.typewriter-paragraph');
    paragraphs.forEach((p) => {
      p.dataset.text = p.textContent.trim();
      p.textContent = '';
    });

    // Start typewriter
    const engine = new TypewriterEngine();
    engine.start();
  });
})();
