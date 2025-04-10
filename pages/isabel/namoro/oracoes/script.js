particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 30
    },
    "shape": {
      "type": "image",
      "image": {
        "src": "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png",
        "width": 72,
        "height": 72
      }
    },
    "size": {
      "value": 16,
      "random": true
    },
    "move": {
      "speed": 1,
      "direction": "top",
      "out_mode": "out"
    },
    "opacity": {
      "value": 0.6,
      "random": true
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      }
    }
  },
  "retina_detect": true
});

function getReflexaoDoDia(reflexoes) {
    const hoje = new Date();
    const dataInicial = new Date('2025-04-10'); // Data de início
    const diffEmDias = Math.floor((hoje - dataInicial) / (1000 * 60 * 60 * 24));
    const index = Math.min(diffEmDias, reflexoes.length - 1);
    return reflexoes[index];
  }
  
  function renderReflexao(item) {
    const hoje = new Date().toLocaleDateString('pt-BR');
  
    document.getElementById('reflexao-dia').innerHTML = `
      <div class="p-6 bg-gray-800 rounded-xl">
        <p class="text-sm text-gray-400 mb-2">Dia ${item.dia} - ${hoje}</p>
        <h2 class="text-xl md:text-2xl text-pink-400 font-semibold mb-4">“${item.mensagem}”</h2>
        <p class="text-md leading-relaxed text-gray-300">${item.meditacao}</p>
      </div>
    `;
  }
  
fetch('reflexoes.json')
  .then(response => response.json())
  .then(reflexoes => {
    const reflexao = getReflexaoDoDia(reflexoes);
    renderReflexao(reflexao);
    })
  .catch(error => {
    console.error('Erro ao carregar reflexões:', error);
    document.getElementById('reflexao-dia').innerHTML = `
      <p class="text-red-400">Erro ao carregar a reflexão de hoje. 🙏</p>
      `;
  });
  