/**
 * leolucena22 – Main Script
 * Handles: burger menu, scroll effects, intersection observer reveals, cursor glow
 */

(function () {
  'use strict';

  // ── DOM Refs ──
  const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.links');
  const overlay = document.querySelector('.overlay');
  const nav = document.querySelector('nav');
  const scrollProgress = document.getElementById('scroll-progress');

  // ── Burger Menu ──
  function toggleMenu(open) {
    const isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('active');
    navLinks.classList.toggle('active', isOpen);
    burgerMenu.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burgerMenu.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // ── Nav Scroll Effect ──
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 40);
    lastScroll = scrollY;

    // Scroll progress bar
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }
  }, { passive: true });

  // ── Intersection Observer: Reveal on Scroll ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Cursor Glow (desktop only) ──
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ── Tilt Effect on Profile Image ──
  const profileImg = document.querySelector('#about .img');
  if (profileImg && window.matchMedia('(pointer: fine)').matches) {
    const img = profileImg.querySelector('img');
    profileImg.addEventListener('mousemove', (e) => {
      const rect = profileImg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      img.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      img.style.transition = 'transform 0.1s ease-out';
    });
    profileImg.addEventListener('mouseleave', () => {
      img.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
      img.style.transition = 'transform 0.5s ease-out';
    });
  }
})();