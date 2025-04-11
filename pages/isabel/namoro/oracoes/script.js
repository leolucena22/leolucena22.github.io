function getReflexaoDoDia(reflexoes) {
  // Pega a data atual no horário de Brasília (UTC-3)
  const agoraUTC = new Date();
  const agoraBrasilia = new Date(agoraUTC.getTime() - (3 * 60 * 60 * 1000));
  agoraBrasilia.setHours(0, 0, 0, 0); // Garante que o horário seja 00:00h

  const dataInicial = new Date('2025-04-10T00:00:00-03:00'); // Data de início no horário de Brasília
  dataInicial.setHours(0, 0, 0, 0); // Garante que a data inicial também esteja às 00:00h

  const diffEmDias = Math.floor((agoraBrasilia - dataInicial) / (1000 * 60 * 60 * 24));
  const index = Math.min(diffEmDias, reflexoes.length - 1);

  return reflexoes[index];
}

function renderReflexao(item) {
  const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

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
