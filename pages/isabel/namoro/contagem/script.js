const startDate = new Date('2024-12-22T10:05:00'); // Data do início do namoro
const contador = document.getElementById('contador');

function updateTimer() {
  const now = new Date();

  // Diferença de anos e meses
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  // Ajuste para quando o dia ainda não foi atingido no mês atual
  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Último dia do mês anterior
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Calcular o tempo restante do dia atual
  const diff = now - startDate;
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;

  // Definir texto correto para "mês" ou "meses"
  const mesTexto = months === 1 ? 'mês' : 'meses';

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
updateTimer(); // Chamar imediatamente para evitar o delay do primeiro segundo
