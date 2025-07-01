// Criar corações flutuantes (apenas em telas maiores)
    function createFloatingHearts() {
      if (window.innerWidth < 640) return; // Não criar em mobile
      
      const heartsContainer = document.getElementById('floating-hearts');
      const heartSymbols = ['💖', '💕', '💗', '💝', '💘'];
      
      function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
          if (heart.parentNode) {
            heartsContainer.removeChild(heart);
          }
        }, 10000);
      }
      
      // Criar coração a cada 3 segundos
      setInterval(createHeart, 3000);
      
      // Criar alguns corações iniciais
      for (let i = 0; i < 3; i++) {
        setTimeout(createHeart, i * 1000);
      }
    }
    
    // Iniciar quando a página carregar
    window.addEventListener('load', createFloatingHearts);
    
    // Reiniciar se a tela for redimensionada para maior que mobile
    window.addEventListener('resize', () => {
      const heartsContainer = document.getElementById('floating-hearts');
      if (window.innerWidth < 640) {
        heartsContainer.innerHTML = '';
      } else if (heartsContainer.children.length === 0) {
        createFloatingHearts();
      }
    });