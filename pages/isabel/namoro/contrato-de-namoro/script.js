// Coloca a data de hoje
document.getElementById('dataHoje').textContent = new Date().toLocaleDateString('pt-BR');

// Função para aceitar o contrato
function aceitarContrato() {
  document.getElementById('namorada').textContent = 'Isabel de Lima';
  document.getElementById('assinaturaNamoradaDiv').classList.remove('hidden');
  document.getElementById('mensagemFinal').textContent = "Parabéns, agora somos oficialmente um casal abençoado por Deus e apaixonados! ❤️🙏";
  document.getElementById('botoes').classList.add('hidden');

  // Salva no localStorage
  localStorage.setItem('contratoAceito', 'true');
}

// Função para recusar o contrato
function recusarContrato() {
  document.getElementById('mensagemFinal').textContent = "Que pena... 😔 Mas ainda te amo!";
  document.getElementById('botoes').classList.add('hidden');
}

// Verificar se já foi aceito antes
function verificarContrato() {
  if (localStorage.getItem('contratoAceito') === 'true') {
    document.getElementById('namorada').textContent = 'Isabel de Lima';
    document.getElementById('assinaturaNamoradaDiv').classList.remove('hidden');
    document.getElementById('botoes').classList.add('hidden');
    document.getElementById('mensagemFinal').textContent = "Contrato já aceito. ❤️🙏";
  }
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

// Inicializa
verificarContrato();
setInterval(criarCoracoes, 300);
