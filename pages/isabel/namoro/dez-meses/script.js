const fullText = `Estamos na porta do nosso matrimônio, meu amor, e hoje, nessa data tão marcante e especial para nós, chegamos ao nosso 10° mês juntos, nossos 10 meses de alegrias, companheirismo, amor verdadeiro, atenção, carinho, respeito e fidelidade (passaria anos descrevendo nosso relacionamento perfeito e blindado por Deus). Sou muito grato por tudo que meu amor significa para mim. Você é meu tudo, minha paz, minha calmaria, meu lar, meu foco, meu caminho de sucesso, você é tudo que eu sempre quis, você é minha vida. Tenhamos sempre essa relação que temos, cativada todos os dias pela vontade e propósito de vivermos um para o outro, com visão de futuro e colocando Deus no centro de tudo. Obrigado por existir, eu te amo infinitamente! Ass. Leo Lucena.`;
        
        let index = 0;
        const textElement = document.getElementById('text');
        const muteBtn = document.getElementById('muteBtn');
        
        // Função de digitação
        function typeWriter() {
            if (index < fullText.length) {
                const char = fullText.charAt(index);
                textElement.textContent += char;
                
                index++;
                
                // Velocidade variável para parecer mais natural
                const speed = char === ' ' ? 50 : (Math.random() * 60 + 50);
                setTimeout(typeWriter, speed);
            } else {
                textElement.classList.add('finished');
            }
        }
        
        // Criar corações caindo
        function createHeart() {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.textContent = '❤️';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
            heart.style.fontSize = (Math.random() * 10 + 20) + 'px';
            document.getElementById('hearts').appendChild(heart);
            
            setTimeout(() => heart.remove(), 8000);
        }
        
        // Iniciar animação
        setTimeout(() => {
            typeWriter();
            setInterval(createHeart, 500);
        }, 1000);