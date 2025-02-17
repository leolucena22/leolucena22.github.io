const burgerMenu = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.links');
  const overlay = document.querySelector('.overlay');

  // Toggle menu
  burgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burgerMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
  });

  // Close menu on overlay click
  overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    burgerMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  // Close menu on link click
  document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      burgerMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });