// Data do casamento (mantendo a data original fornecida)
        const weddingDate = new Date('2025-10-31T16:30:00');

        function updateCounter() {
            const now = new Date();
            // Calcula a diferença total em milissegundos
            const diff = now.getTime() - weddingDate.getTime();

            // Define as constantes de tempo em milissegundos
            const MS_IN_SECOND = 1000;
            const MS_IN_MINUTE = 60 * MS_IN_SECOND;
            const MS_IN_HOUR = 60 * MS_IN_MINUTE;
            const MS_IN_DAY = 24 * MS_IN_HOUR;

            // Se a diferença for negativa (data futura), exibe zero e sai
            if (diff < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }

            // 1. Calcula o total de dias e o restante dos milissegundos
            const days = Math.floor(diff / MS_IN_DAY);
            let remainingMs = diff % MS_IN_DAY;

            // 2. Calcula as horas restantes
            const hours = Math.floor(remainingMs / MS_IN_HOUR);
            remainingMs %= MS_IN_HOUR;

            // 3. Calcula os minutos restantes
            const minutes = Math.floor(remainingMs / MS_IN_MINUTE);
            remainingMs %= MS_IN_MINUTE;

            // 4. Calcula os segundos restantes
            const seconds = Math.floor(remainingMs / MS_IN_SECOND);

            // Função auxiliar para garantir dois dígitos (ex: 01, 12)
            const pad = (n) => String(n).padStart(2, '0');

            // Atualizar displays (agora usando o tempo decorrido correto)
            document.getElementById('days').textContent = pad(days);
            document.getElementById('hours').textContent = pad(hours);
            document.getElementById('minutes').textContent = pad(minutes);
            
            // Oculta segundos em mobile para evitar quebra de layout, mas continua atualizando
            const secondsElement = document.getElementById('seconds');
            if (secondsElement) {
                secondsElement.textContent = pad(seconds);
            }
        }

        // Atualizar a cada segundo
        updateCounter();
        setInterval(updateCounter, 1000);