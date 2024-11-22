function startWhatsAppChat() {
    const input = document.getElementById('whatsappNumber');
    let number = input.value.trim();

    // Remover caracteres não numéricos
    number = number.replace(/\D/g, ''); // Remove tudo que não é número

    // Verificar se o número tem pelo menos 10 caracteres (DDD + número)
    if (number.length < 10) {
      alert('Por favor, insira um número válido com DDD (mínimo 10 dígitos).');
      return;
    }

    // Adicionar código do país se não for informado (por exemplo, 55 para Brasil)
    if (number.length === 10 || number.length === 11) {
      number = `55${number}`; // Adiciona o código do Brasil
    }

    // Redirecionar para o WhatsApp com o número formatado
    const whatsappLink = `https://wa.me/${number}`;
    window.open(whatsappLink, '_blank');
  }