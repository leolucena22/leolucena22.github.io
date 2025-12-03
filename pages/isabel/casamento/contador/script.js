// Data do casamento (mantendo a data original fornecida)
const weddingDate = new Date('2025-10-31T16:30:00');

function updateCounter() {
    const now = new Date();
    
    // Se a data atual for anterior à data do casamento, zera tudo
    if (now < weddingDate) {
        const elements = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = id === 'years' || id === 'months' || id === 'days' ? '0' : '00';
        });
        return;
    }

    let startDate = new Date(weddingDate);
    let endDate = new Date(now);

    // 1. Calcular Anos
    let years = endDate.getFullYear() - startDate.getFullYear();
    
    // Verificar se o aniversário do ano ainda não chegou
    // Criamos uma data temporária com o ano atual para comparar
    let tempDate = new Date(startDate);
    tempDate.setFullYear(startDate.getFullYear() + years);
    
    // Se a data temporária for maior que agora, significa que ainda não completou o ano
    if (tempDate > endDate) {
        years--;
        tempDate.setFullYear(startDate.getFullYear() + years);
    }

    // 2. Calcular Meses
    let months = 0;
    // Começamos a contar os meses a partir do último aniversário (tempDate)
    let currentTempDate = new Date(tempDate);

    while (true) {
        // Próximo mês
        let nextMonthIndex = currentTempDate.getMonth() + 1;
        let nextYear = currentTempDate.getFullYear();
        
        if (nextMonthIndex > 11) {
            nextMonthIndex = 0;
            nextYear++;
        }

        // Determinar o dia alvo no próximo mês
        // O dia alvo é o dia do casamento (31), mas limitado ao último dia do mês
        const daysInNextMonth = new Date(nextYear, nextMonthIndex + 1, 0).getDate();
        let targetDay = weddingDate.getDate();
        if (targetDay > daysInNextMonth) {
            targetDay = daysInNextMonth;
        }

        // Criar a data do próximo marco mensal
        let nextMilestone = new Date(
            nextYear, 
            nextMonthIndex, 
            targetDay, 
            weddingDate.getHours(), 
            weddingDate.getMinutes(), 
            weddingDate.getSeconds()
        );

        // Se o próximo marco ultrapassar a data atual, paramos
        if (nextMilestone > endDate) break;

        months++;
        currentTempDate = nextMilestone;
    }

    // 3. Calcular Dias, Horas, Minutos, Segundos restantes
    // A diferença é entre agora e o último marco mensal alcançado (currentTempDate)
    let diff = endDate - currentTempDate;

    const MS_IN_SECOND = 1000;
    const MS_IN_MINUTE = 60 * MS_IN_SECOND;
    const MS_IN_HOUR = 60 * MS_IN_MINUTE;
    const MS_IN_DAY = 24 * MS_IN_HOUR;

    const days = Math.floor(diff / MS_IN_DAY);
    diff %= MS_IN_DAY;

    const hours = Math.floor(diff / MS_IN_HOUR);
    diff %= MS_IN_HOUR;

    const minutes = Math.floor(diff / MS_IN_MINUTE);
    diff %= MS_IN_MINUTE;

    const seconds = Math.floor(diff / MS_IN_SECOND);

    // Função auxiliar para garantir dois dígitos
    const pad = (n) => String(n).padStart(2, '0');

    // Atualizar displays
    const yearsEl = document.getElementById('years');
    if (yearsEl) yearsEl.textContent = years;

    const monthsEl = document.getElementById('months');
    if (monthsEl) monthsEl.textContent = months;

    const daysEl = document.getElementById('days');
    if (daysEl) daysEl.textContent = days;

    const hoursEl = document.getElementById('hours');
    if (hoursEl) hoursEl.textContent = pad(hours);

    const minutesEl = document.getElementById('minutes');
    if (minutesEl) minutesEl.textContent = pad(minutes);
    
    const secondsElement = document.getElementById('seconds');
    if (secondsElement) {
        secondsElement.textContent = pad(seconds);
    }
}

// Atualizar a cada segundo
updateCounter();
setInterval(updateCounter, 1000);