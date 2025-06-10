// Criar corações flutuantes aleatórios
    function createFloatingHeart() {
      const heart = document.createElement('i');
      heart.className = 'fas fa-heart heart-float';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
      heart.style.opacity = Math.random() * 0.5 + 0.3;
      heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 4000);
    }

    // Criar estrelas cintilantes
    function createSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 2000);
    }

    // Adicionar efeito de clique
    document.addEventListener('click', (e) => {
      createSparkle(e.clientX, e.clientY);

      // Criar múltiplas estrelas ao redor do clique
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createSparkle(
            e.clientX + (Math.random() - 0.5) * 100,
            e.clientY + (Math.random() - 0.5) * 100
          );
        }, i * 100);
      }
    });

    // Criar corações flutuantes continuamente
    setInterval(createFloatingHeart, 800);

    // Adicionar efeito de hover nos ícones
    document.querySelectorAll('.love-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('i');
        if (icon) {
          icon.style.transform = 'scale(1.3) rotate(10deg)';
          icon.style.transition = 'all 0.3s ease';
        }
      });

      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('i');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      });
    });

    // Efeito de digitação responsivo
    document.addEventListener('DOMContentLoaded', () => {
      const title = document.querySelector('.typing-animation');
      if (title && window.innerWidth > 768) {
        // Só aplica o efeito de digitação em desktop
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid #ff6b9d';

        let i = 0;
        const typeWriter = () => {
          if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
          } else {
            setTimeout(() => {
              title.style.borderRight = 'none';
            }, 1000);
          }
        };

        setTimeout(typeWriter, 2000);
      }
    });

    // Animação suave ao rolar a página
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s ease';
      observer.observe(el);
    });