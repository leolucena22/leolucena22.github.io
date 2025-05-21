 // Configuração das legendas
        const captions = [
        [1.2, "Mais um dia 22 chegou, e com ele fechamos nosso 5º mês de namoro e iniciamos mais um novo mês, meu amor,"],
        [8.7, "um novo ciclo, pois, ao teu lado, todos os dias são recomeços, descobertas e infinitos motivos para te amar e te querer para toda a minha vida."],
        [15.1, "Nesses 151 dias, curto espaço de tempo, tendo em vista nossa conexão,"],
        [18.1, "afirmo fielmente que é com você que meu coração quer morada para sempre,"],
        [20.2, "é com você que os meus maiores planos serão realizados, é com você que minha vida faz sentido."],
        [28.1, "Foi em ti que encontrei a minha paz. Eu te quero para sempre, meu mundo!"],
        [31.4, "Meu peito palpita mais forte todas as vezes que penso em você, todas as vezes que imagino uma vida inteira ao teu lado."],
        [34.2, "Você ressignificou minha vida, e sou grato, tanto ao Senhor, pela oportunidade de ter a serva mais perfeita já feita e colocada nesta terra por Ele."],
        [36.5, "Você, meu amor, sempre será sinônimo de lindeza, inteligência, respeito, ternura, encanto, desejo,"],
        [39.0, "intensidade, doçura, luz, fascínio, carinho, paixão, cumplicidade, beleza, sedução, magia, calor, amor e eternidade."],
        [42.7, "Eu simplesmente tenho a melhor namorada, futura esposa, mais perfeita."],
        [45.9, "Obrigado por ser minha e por me dar a oportunidade de ser eu mesmo, minha versão verdadeira e sempre amorosa com você."],
        [55.6, "Prometer o mundo seria ingenuidade minha, tendo em vista a quantidade de maldade e coisas ruins existentes."],
        [60.6, "Eu, Leonardo, te prometo conquistar nosso lugar no céu. Prometo cumplicidade, amor, lealdade."],
        [72.0, "Prometo ser abrigo nos teus dias nublados, ser riso nos teus dias bons e força nos difíceis."],
        [75.2, "Prometo respeitar tua essência, valorizar cada detalhe teu, te lembrar todos os dias do quanto és especial."],
        [80.0, "Prometo ser teu porto seguro, tua paz no caos, teu lar em qualquer lugar."],
        [89.1, "E, acima de tudo, prometo te amar com verdade, com alma, com fé, até o infinito, e além do tempo que nos for dado."],
        [92.5, "Finalizo essa curta mensagem de sentimento verdadeiro e certezas, parafraseando nossa música:"],
        [96.1, "\"Foi Deus que me entregou de presente você"],
        [105.5, "Eu que sonhava um dia viver"],
        [109.3, "Um grande amor assim, foi Deus...\""],
        [113.8, "Sim, foi Deus, e Ele foi maravilhoso comigo, me dando você, meu amor."],
        [117.7, "Eu te amo para todo o sempre!"],
        [121.6, "Seu, Leonardo Lucena."]
        ];

        
        // Elementos DOM
        const audio = document.getElementById('love-message');
        const captionsContainer = document.getElementById('captions');
        const playButton = document.getElementById('play-button');
        const heartsContainer = document.getElementById('hearts-container');
        
        // Inicializar o contêiner de legendas
        function initCaptions() {
            captionsContainer.innerHTML = '';
            
            const fragment = document.createDocumentFragment();
            
            captions.forEach((caption, index) => {
                const captionElement = document.createElement('p');
                captionElement.id = `caption-${index}`;
                captionElement.className = 'caption-text serif-text';
                
                if (index >= 19 && index <= 22) {
                    captionElement.innerHTML = `<span class="quote-highlight">${caption[1]}</span>`;
                } else {
                    captionElement.textContent = caption[1];
                }
                
                if (index >= 13 && index <= 18) {
                    captionElement.classList.add('promise-text');
                }
                
                fragment.appendChild(captionElement);
            });
            
            captionsContainer.appendChild(fragment);
        }
        
        // Atualizar legendas com base no tempo do áudio
        function updateCaptions() {
            const currentTime = audio.currentTime;
            let activeIndex = -1;
            
            for (let i = 0; i < captions.length; i++) {
                const startTime = captions[i][0];
                const nextStartTime = (i < captions.length - 1) ? captions[i + 1][0] : Infinity;
                
                if (currentTime >= startTime && currentTime < nextStartTime) {
                    activeIndex = i;
                    break;
                }
            }
            
            // Usar requestAnimationFrame para melhor performance
            requestAnimationFrame(() => {
                for (let i = 0; i < captions.length; i++) {
                    const captionElement = document.getElementById(`caption-${i}`);
                    if (i === activeIndex) {
                        captionElement.classList.add('active-caption');
                        
                        // Scroll suave com polyfill para browsers antigos
                        captionElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest'
                        });
                        
                        if (i !== window.lastActiveIndex) {
                            createFloatingHearts([5, 17, 28, 34, 83, 90, 97, 104, 110, 143].includes(i) ? 4 : 
                                               [133, 137, 143, 147].includes(i) ? 6 : 2);
                        }
                    } else {
                        captionElement.classList.remove('active-caption');
                    }
                }
                
                window.lastActiveIndex = activeIndex;
                updatePlayButton();
            });
        }
        
        // Atualizar o botão de play/pause
        function updatePlayButton() {
            const icon = audio.paused ? 'play' : 'pause';
            const text = audio.paused ? 'Continuar' : 'Pausar';
            
            playButton.innerHTML = `<i class="fas fa-${icon}" aria-hidden="true"></i><span>${text}</span>`;
        }
        
        // Criar corações flutuantes otimizados
        function createFloatingHearts(count) {
            const hearts = ['❤️', '💖', '💕', '💘', '💓', '💗'];
            const fragment = document.createDocumentFragment();
            
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.className = 'floating-heart';
                    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
                    
                    const x = 10 + Math.random() * (window.innerWidth - 20);
                    const size = 15 + Math.random() * 25;
                    
                    heart.style.left = `${x}px`;
                    heart.style.bottom = `${window.innerHeight}px`;
                    heart.style.fontSize = `${size}px`;
                    
                    fragment.appendChild(heart);
                    
                    const duration = 5000 + Math.random() * 5000;
                    const xMovement = -50 + Math.random() * 100;
                    
                    const animation = heart.animate([
                        { transform: `translate(0, 0) rotate(0deg)`, opacity: 0 },
                        { transform: `translate(${xMovement}px, -100px) rotate(${Math.random() * 90}deg)`, opacity: 0.7 },
                        { transform: `translate(${xMovement*1.5}px, -${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                    ], {
                        duration: duration,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    });
                    
                    animation.onfinish = () => heart.remove();
                    
                }, i * 300);
            }
            
            document.body.appendChild(fragment);
        }
        
        // Efeitos de fundo periódicos com controle
        let effectInterval;
        
        function startPeriodicEffects() {
            effectInterval = setInterval(() => {
                if (!document.hidden) {
                    createFloatingHearts(1);
                }
            }, 3000 + Math.random() * 4000);
        }
        
        function stopPeriodicEffects() {
            clearInterval(effectInterval);
        }
        
        // Ripple effect para botões
        function createRipple(event) {
            const button = event.currentTarget;
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
            circle.classList.add('ripple');
            
            const ripple = button.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }
            
            button.appendChild(circle);
        }
        
        // Inicializar
        document.addEventListener('DOMContentLoaded', () => {
            initCaptions();
            
            // Configurar eventos de áudio
            audio.addEventListener('timeupdate', updateCaptions);
            audio.addEventListener('play', updatePlayButton);
            audio.addEventListener('pause', updatePlayButton);
            audio.addEventListener('ended', () => {
                playButton.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i><span>Ouvir Novamente</span>';
            });
            
            // Configurar botão de play
            playButton.addEventListener('click', () => {
                audio.paused ? audio.play() : audio.pause();
            });
            
            // Adicionar efeito ripple aos botões
            const buttons = document.querySelectorAll('.elegant-button');
            buttons.forEach(button => {
                button.addEventListener('click', createRipple);
            });
            
            // Controle de efeitos de fundo quando a página está visível
            document.addEventListener('visibilitychange', () => {
                document.hidden ? stopPeriodicEffects() : startPeriodicEffects();
            });
            
            // Iniciar efeitos periódicos
            startPeriodicEffects();
            
            // Pré-carregar áudio para melhor experiência
            audio.load();
        });
        
        // Service Worker para cache (opcional)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker registration successful');
                }).catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }