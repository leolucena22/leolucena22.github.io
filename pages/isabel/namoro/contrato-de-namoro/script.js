// Coloca a data de hoje
document.getElementById('dataHoje').textContent = new Date().toLocaleDateString('pt-BR');

// Função quando clicar em Aceitar
function aceitarContrato() {
  document.getElementById('namorada').textContent = 'Isabel de Lima';
  document.getElementById('assinaturaNamoradaDiv').classList.remove('hidden');
  document.getElementById('mensagemFinal').textContent = "Parabéns, agora somos oficialmente um casal abençoado por Deus e apaixonados! ❤️🙏";
  document.getElementById('botoes').classList.add('hidden');
}

// Função quando clicar em Recusar
function recusarContrato() {
  document.getElementById('mensagemFinal').textContent = "Que pena... 😔 Mas ainda te amo!";
  document.getElementById('botoes').classList.add('hidden');
}

// Função para criar corações subindo
function criarCoracoes() {
  const heartContainer = document.getElementById('heart-container');
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = Math.random() * window.innerWidth + 'px';
  heart.style.top = window.innerHeight + 'px';
  heartContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}

// Gera vários corações continuamente
setInterval(criarCoracoes, 300);
