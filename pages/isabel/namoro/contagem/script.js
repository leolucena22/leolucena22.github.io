const startDate = new Date('2024-12-22T10:05:00'); // Data do início do namoro
const contador = document.getElementById('contador');

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  // Calcular tempo total
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44); // Aproximando meses
  const years = Math.floor(months / 12);

  // Dias adicionais após meses/anos completos
  const remainingDays = days - (months * 30.44).toFixed(0);
  const remainingMonths = months % 12;
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  // Mostrar o tempo completo
  let timeString = '';
  if (years > 0) {
    timeString += `<p>${years} anos</p>`;
  }
  timeString += `
    <p>${remainingMonths} mês | ${remainingDays.toFixed()} dias | </p>
    <p>${remainingHours} horas | ${remainingMinutes} minutos | ${remainingSeconds} segundos</p>
  `;
  contador.innerHTML = timeString;
}

// Atualizar o contador a cada segundo
setInterval(updateTimer, 1000);
