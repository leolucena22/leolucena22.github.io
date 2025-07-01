let reflexoes = [];
let indexAtual = 0;
let maxIndex = 0;
let indexHoje = 0;

function getIndexHoje() {
  const hoje = new Date();
  const dataInicial = new Date('2025-04-10T00:00:00-03:00');
  const diffEmDias = Math.floor((hoje - dataInicial) / (1000 * 60 * 60 * 24));
  return diffEmDias;
}

function renderReflexao(item, index) {
  const dataInicial = new Date('2025-04-10T00:00:00-03:00');
  const dataReflexao = new Date(dataInicial.getTime() + index * 24 * 60 * 60 * 1000);
  const dataFormatada = dataReflexao.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  
  // Verifica se é uma reflexão futura
  const isFutura = index > indexHoje;
  const statusTexto = isFutura ? ' (Futura)' : '';

  document.getElementById('reflexao-dia').innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <button id="anterior" class="text-pink-400 text-3xl hover:scale-125 transition ${index <= 0 ? 'opacity-30 cursor-default' : ''}">❮</button>
      <span class="text-sm text-gray-400">Dia ${item.dia} - ${dataFormatada}${statusTexto}</span>
      <button id="proximo" class="text-pink-400 text-3xl hover:scale-125 transition ${index >= maxIndex ? 'opacity-30 cursor-default' : ''}">❯</button>
    </div>
    <h2 class="text-xl md:text-2xl text-pink-400 font-semibold mb-4 ${isFutura ? 'opacity-70' : ''}">"${item.mensagem}"</h2>
    <p class="text-md leading-relaxed text-gray-300 ${isFutura ? 'opacity-70' : ''}">${item.meditacao}</p>
    ${isFutura ? '<p class="text-xs text-yellow-400 mt-4 italic">✨ Esta reflexão estará disponível em breve</p>' : ''}
  `;

  const btnAnterior = document.getElementById('anterior');
  const btnProximo = document.getElementById('proximo');

  btnAnterior.onclick = () => {
    if (indexAtual > 0) {
      indexAtual--;
      renderReflexao(reflexoes[indexAtual], indexAtual);
    }
  };

  btnProximo.onclick = () => {
    if (indexAtual < maxIndex) {
      indexAtual++;
      renderReflexao(reflexoes[indexAtual], indexAtual);
    }
  };
}

fetch('reflexoes.json')
  .then((response) => response.json())
  .then((data) => {
    reflexoes = data;
    indexHoje = getIndexHoje();
    // Agora maxIndex vai até o final das reflexões disponíveis
    maxIndex = reflexoes.length - 1;
    indexAtual = Math.min(indexHoje, maxIndex); // Começa no dia atual ou no último disponível
    renderReflexao(reflexoes[indexAtual], indexAtual);
  })
  .catch((error) => {
    console.error('Erro ao carregar reflexões:', error);
    document.getElementById('reflexao-dia').innerHTML = `
      <p class="text-red-400">Erro ao carregar a reflexão de hoje. 🙏</p>
    `;
  });

// Funcionalidade adicional: navegação por teclado
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' && indexAtual > 0) {
    indexAtual--;
    renderReflexao(reflexoes[indexAtual], indexAtual);
  } else if (event.key === 'ArrowRight' && indexAtual < maxIndex) {
    indexAtual++;
    renderReflexao(reflexoes[indexAtual], indexAtual);
  }
});