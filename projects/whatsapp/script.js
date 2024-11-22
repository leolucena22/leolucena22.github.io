function startWhatsAppChat() {
    const input = document.getElementById('whatsappNumber');
    let number = input.value.trim();

    // Verificar se o número é válido
    if (!number.match(/^\d+$/) || number.length < 10) {
      alert('Por favor, insira um número válido com DDD.');
      return;
    }

    // Redirecionar para o WhatsApp com o número formatado
    const whatsappLink = `https://wa.me/55${number}`;
    window.open(whatsappLink, '_blank');
  }