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

  document.getElementById('reflexao-dia').innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <button id="anterior" class="text-pink-400 text-3xl hover:scale-125 transition ${index <= 0 ? 'opacity-30 cursor-default' : ''}">❮</button>
      <span class="text-sm text-gray-400">Dia ${item.dia} - ${dataFormatada}</span>
      <button id="proximo" class="text-pink-400 text-3xl hover:scale-125 transition ${index >= indexHoje ? 'opacity-30 cursor-default' : ''}">❯</button>
    </div>
    <h2 class="text-xl md:text-2xl text-pink-400 font-semibold mb-4">“${item.mensagem}”</h2>
    <p class="text-md leading-relaxed text-gray-300">${item.meditacao}</p>
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
    if (indexAtual < indexHoje) {
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
    maxIndex = Math.min(reflexoes.length - 1, indexHoje);
    indexAtual = indexHoje;
    renderReflexao(reflexoes[indexAtual], indexAtual);
  })
  .catch((error) => {
    console.error('Erro ao carregar reflexões:', error);
    document.getElementById('reflexao-dia').innerHTML = `
      <p class="text-red-400">Erro ao carregar a reflexão de hoje. 🙏</p>
    `;
  });
