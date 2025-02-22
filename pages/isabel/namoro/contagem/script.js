const startDate = new Date('2024-12-22T10:05:00'); // Data do início do namoro
const contador = document.getElementById('contador');

function updateTimer() {
  const now = new Date();

  // Diferença em anos, meses e dias
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  let hours = now.getHours() - startDate.getHours();
  let minutes = now.getMinutes() - startDate.getMinutes();
  let seconds = now.getSeconds() - startDate.getSeconds();

  // Ajustar minutos e segundos negativos
  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Último dia do mês anterior
    days += lastMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Garantir que o contador mostre o mês certo antes do horário exato
  let mesTexto;
  if (months === 1 && now.getDate() === startDate.getDate() && now.getHours() < startDate.getHours()) {
    // Ainda não chegou no horário certo, então mantém "1 mês"
    months = 1;
    mesTexto = "mês";
  } else {
    // Atualiza corretamente após o horário
    mesTexto = months === 1 ? "mês" : "meses";
  }

  // Montar a string formatada
  let timeString = '';
  if (years > 0) {
    timeString += `<p>${years} anos</p>`;
  }
  timeString += `<p>${months} ${mesTexto} | ${days} dias | </p>`;
  timeString += `<p>${hours} horas | ${minutes} minutos | ${seconds} segundos</p>`;

  contador.innerHTML = timeString;
}

// Atualizar o contador a cada segundo
setInterval(updateTimer, 1000);
updateTimer(); // Chamar imediatamente para evitar atraso