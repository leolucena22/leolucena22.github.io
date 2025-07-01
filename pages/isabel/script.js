// Create floating hearts
    function createFloatingHeart() {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.className = 'floating-heart';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
      heart.style.animationDuration = (Math.random() * 3 + 5) + 's';

      document.getElementById('floating-hearts').appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 8000);
    }

    // Create hearts periodically
    setInterval(createFloatingHeart, 2000);

    // Add hover effects to cards
    document.querySelectorAll('.card-hover').forEach(card => {
      card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Add click animation to buttons
    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', function (e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
      });
    });