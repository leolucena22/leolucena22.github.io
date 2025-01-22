// Define a data inicial do namoro (substitua pela data real)
const dataInicial = new Date('2024-12-22T09:00:00'); // Exemplo: 14 de fevereiro de 2023

// Função para atualizar o contador
function atualizarContador() {
  const agora = new Date();
  const diferenca = agora - dataInicial; // Diferença em milissegundos

  // Converte a diferença em dias, horas, minutos e segundos
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

  // Atualiza o conteúdo do contador
  const contador = document.getElementById('contador');
  contador.innerHTML = `
    <h3>${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos</h3>
  `;
}

// Atualiza o contador a cada segundo
setInterval(atualizarContador, 1000);

// Chama a função imediatamente para mostrar o tempo assim que a página carregar
atualizarContador();
