// Função para transformar o link de compartilhamento em link direto
function convertToDirectLink(sharedLink) {
    const idMatch = sharedLink.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    return idMatch ? `https://drive.google.com/uc?export=download&id=${idMatch[1]}` : "Link inválido";
  }

  // Evento ao clicar no botão "Gerar Links Diretos"
  document.getElementById('generate-links').addEventListener('click', () => {
    const links = [
      document.getElementById('link1').value,
      document.getElementById('link2').value,
      document.getElementById('link3').value,
      document.getElementById('link4').value,
    ];

    const outputs = links.map(link => convertToDirectLink(link));
    outputs.forEach((output, index) => {
      document.getElementById(`output${index + 1}`).textContent = output;
    });

    document.getElementById('output').classList.remove('hidden');
  });

  // Função para copiar o link para a área de transferência
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const targetId = event.currentTarget.getAttribute('data-copy');
      const textToCopy = document.getElementById(targetId).textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Link copiado!');
      });
    });
  });