const weddingDate = new Date('2025-10-31T00:00:00');

        function updateCounter() {
            const now = new Date();
            const diff = now - weddingDate;

            // Calcular o tempo
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            // Calcular anos e meses
            let years = now.getFullYear() - weddingDate.getFullYear();
            let months = now.getMonth() - weddingDate.getMonth();
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            if (now.getDate() < weddingDate.getDate()) {
                months--;
                if (months < 0) {
                    years--;
                    months += 12;
                }
            }

            // Calcular dias desde o último mês completo
            const lastMonthDate = new Date(now.getFullYear(), now.getMonth(), weddingDate.getDate());
            if (lastMonthDate > now) {
                lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            }
            const daysInCurrentMonth = Math.floor((now - lastMonthDate) / (1000 * 60 * 60 * 24));

            // Atualizar displays
            document.getElementById('years').textContent = years;
            document.getElementById('months').textContent = months;
            document.getElementById('days').textContent = daysInCurrentMonth;
            document.getElementById('hours').textContent = now.getHours();
            document.getElementById('minutes').textContent = now.getMinutes();
            document.getElementById('seconds').textContent = now.getSeconds();
        }

        // Atualizar a cada segundo
        updateCounter();
        setInterval(updateCounter, 1000);