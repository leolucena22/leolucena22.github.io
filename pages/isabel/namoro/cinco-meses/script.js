// Configuração das legendas
const captions = [
    [0.2, "Mais um dia 22 chegou, e com ele fechamos nosso 5º mês de namoro e iniciamos mais um novo mês, meu amor,"],
    [7.6, "um novo ciclo, pois, ao teu lado, todos os dias são recomeços, descobertas e infinitos motivos para te amar e te querer para toda a minha vida."],
    [15.7, "Nesses 151 dias, curto espaço de tempo, tendo em vista nossa conexão,"],
    [20.5, "afirmo fielmente que é com você que meu coração quer morada para sempre,"],
    [25.5, "é com você que os meus maiores planos serão realizados, é com você que minha vida faz sentido."],
    [32.1, "Foi em ti que encontrei a minha paz. Eu te quero para sempre, meu mundo!"],
    [36.4, "Meu peito palpita mais forte todas as vezes que penso em você, todas as vezes que imagino uma vida inteira ao teu lado."],
    [44.2, "Você ressignificou minha vida, e sou grato, tanto ao Senhor, pela oportunidade de ter a serva mais perfeita já feita e colocada nesta terra por Ele."],
    [54.5, "Você, meu amor, sempre será sinônimo de lindeza, inteligência, respeito, ternura, encanto, desejo,"],
    [62.0, "intensidade, doçura, luz, fascínio, carinho, paixão, cumplicidade, beleza, sedução, magia, calor, amor e eternidade."],
    [72.7, "Eu simplesmente tenho a melhor namorada, futura esposa, mais perfeita."],
    [78.9, "Obrigado por ser minha e por me dar a oportunidade de ser eu mesmo, minha versão verdadeira e sempre amorosa com você."],
    [85.6, "Prometer o mundo seria ingenuidade minha, tendo em vista a quantidade de maldade e coisas ruins existentes."],
    [95.1, "Eu, Leonardo, te prometo conquistar nosso lugar no céu. Prometo cumplicidade, amor, lealdade."],
    [102.0, "Prometo ser abrigo nos teus dias nublados, ser riso nos teus dias bons e força nos difíceis."],
    [108.2, "Prometo respeitar tua essência, valorizar cada detalhe teu, te lembrar todos os dias do quanto és especial."],
    [115.0, "Prometo ser teu porto seguro, tua paz no caos, teu lar em qualquer lugar."],
    [122.1, "E, acima de tudo, prometo te amar com verdade, com alma, com fé, até o infinito, e além do tempo que nos for dado."],
    [130.7, "Finalizo essa curta mensagem de sentimento verdadeiro e certezas, parafraseando nossa música:"],
    [136.4, "\"Foi Deus que me entregou de presente você"],
    [141.5, "Eu que sonhava um dia viver"],
    [145.3, "Um grande amor assim, foi Deus...\""],
    [150.8, "Sim, foi Deus, e Ele foi maravilhoso comigo, me dando você, meu amor."],
    [154.7, "Eu te amo para todo o sempre!"],
    [157.6, "Seu, Leonardo Lucena."]
];

// Elementos DOM
const audio = document.getElementById('love-message');
const captionsContainer = document.getElementById('captions');
const playButton = document.getElementById('play-button');
const heartsContainer = document.getElementById('hearts-container');

// Variáveis de controle de sincronização
let currentActiveIndex = -1;
let lastUpdateTime = 0;
const UPDATE_THRESHOLD = 0.1; // Atualiza apenas se mudou mais que 100ms

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
    console.log('📋 Legendas inicializadas:', captions.length, 'frases');
}

// Função otimizada para encontrar a legenda ativa
function findActiveCaption(currentTime) {
    // Busca binária otimizada para melhor performance
    let activeIndex = -1;
    let tolerance = 0.3; // Tolerância de 300ms para transições mais suaves
    
    for (let i = captions.length - 1; i >= 0; i--) {
        const startTime = captions[i][0];
        const nextStartTime = (i < captions.length - 1) ? captions[i + 1][0] : currentTime + 10;
        
        // Verifica se está dentro do intervalo com tolerância
        if (currentTime >= (startTime - tolerance) && currentTime < (nextStartTime + tolerance)) {
            // Se está muito próximo do início da próxima frase, mantém a atual
            if (currentTime >= startTime) {
                activeIndex = i;
                break;
            }
        }
    }
    
    return activeIndex;
}

// Atualizar legendas com base no tempo do áudio - VERSÃO OTIMIZADA
function updateCaptions() {
    const currentTime = audio.currentTime;
    
    // Throttling: só atualiza se passou tempo suficiente
    if (Math.abs(currentTime - lastUpdateTime) < UPDATE_THRESHOLD && currentActiveIndex !== -1) {
        return;
    }
    
    lastUpdateTime = currentTime;
    const activeIndex = findActiveCaption(currentTime);
    
    // Debug log para acompanhar a sincronização
    if (activeIndex !== currentActiveIndex) {
        console.log(`🎯 Tempo: ${currentTime.toFixed(1)}s | Legenda ${activeIndex >= 0 ? activeIndex + 1 : 'nenhuma'}`);
        if (activeIndex >= 0) {
            console.log(`📝 "${captions[activeIndex][1].substring(0, 50)}..."`);
        }
    }
    
    // Só atualiza se mudou a legenda ativa
    if (activeIndex !== currentActiveIndex) {
        currentActiveIndex = activeIndex;
        
        // Usar requestAnimationFrame para melhor performance
        requestAnimationFrame(() => {
            for (let i = 0; i < captions.length; i++) {
                const captionElement = document.getElementById(`caption-${i}`);
                if (!captionElement) continue;
                
                if (i === activeIndex) {
                    captionElement.classList.add('active-caption');
                    
                    // Scroll suave otimizado
                    if (captionElement.scrollIntoView) {
                        captionElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest'
                        });
                    }
                    
                    // Criar corações em momentos especiais
                    const specialMoments = [5, 17, 28, 34, 83, 90, 97, 104, 110, 143];
                    const emotionalMoments = [133, 137, 143, 147];
                    
                    if (specialMoments.includes(i)) {
                        createFloatingHearts(4);
                    } else if (emotionalMoments.includes(i)) {
                        createFloatingHearts(6);
                    } else if (Math.random() < 0.3) { // 30% chance de corações aleatórios
                        createFloatingHearts(2);
                    }
                    
                } else {
                    captionElement.classList.remove('active-caption');
                }
            }
            
            updatePlayButton();
        });
    }
}

// Atualizar o botão de play/pause
function updatePlayButton() {
    const icon = audio.paused ? 'play' : 'pause';
    const text = audio.paused ? (audio.currentTime > 0 ? 'Continuar' : 'Ouvir Mensagem') : 'Pausar';
    
    playButton.innerHTML = `<i class="fas fa-${icon}" aria-hidden="true"></i><span>${text}</span>`;
}

// Criar corações flutuantes otimizados
function createFloatingHearts(count) {
    const hearts = ['❤️', '💖', '💕', '💘', '💓', '💗'];
    
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
            heart.style.zIndex = '1000';
            
            document.body.appendChild(heart);
            
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
}

// Efeitos de fundo periódicos com controle
let effectInterval;

function startPeriodicEffects() {
    effectInterval = setInterval(() => {
        if (!document.hidden && !audio.paused) {
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

// Função para pular para um tempo específico (para testes)
function jumpToTime(seconds) {
    if (audio) {
        audio.currentTime = seconds;
        console.log(`⏭️ Pulou para ${seconds}s`);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando aplicação de legendas...');
    
    initCaptions();
    
    // Configurar eventos de áudio com melhor sincronização
    audio.addEventListener('timeupdate', updateCaptions);
    audio.addEventListener('play', () => {
        console.log('▶️ Áudio iniciado');
        updatePlayButton();
        startPeriodicEffects();
    });
    audio.addEventListener('pause', () => {
        console.log('⏸️ Áudio pausado');
        updatePlayButton();
        stopPeriodicEffects();
    });
    audio.addEventListener('ended', () => {
        console.log('🏁 Áudio finalizado');
        playButton.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i><span>Ouvir Novamente</span>';
        currentActiveIndex = -1;
        stopPeriodicEffects();
    });
    
    // Configurar botão de play
    playButton.addEventListener('click', (e) => {
        createRipple(e);
        if (audio.paused) {
            audio.play().catch(err => {
                console.error('❌ Erro ao reproduzir:', err);
            });
        } else {
            audio.pause();
        }
    });
    
    // Adicionar efeito ripple aos botões
    const buttons = document.querySelectorAll('.elegant-button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Controle de efeitos de fundo quando a página está visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopPeriodicEffects();
        } else if (!audio.paused) {
            startPeriodicEffects();
        }
    });
    
    // Pré-carregar áudio para melhor experiência
    audio.load();
    
    // Logs de debug
    audio.addEventListener('loadedmetadata', () => {
        console.log(`🎵 Áudio carregado: ${Math.floor(audio.duration)}s de duração`);
        console.log(`📊 Total de legendas: ${captions.length}`);
        console.log('⚡ Use jumpToTime(segundos) no console para testar sincronização');
    });
    
    console.log('✅ Aplicação inicializada com sucesso!');
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