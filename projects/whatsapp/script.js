// Função principal
        function startWhatsAppChat() {
            const input = document.getElementById('whatsappNumber');
            let number = input.value.trim();

            // Remover caracteres não numéricos
            number = number.replace(/\D/g, '');

            // Verificar se o número tem pelo menos 10 caracteres
            if (number.length < 10) {
                showNotification('Por favor, insira um número válido com DDD (mínimo 10 dígitos).', 'error');
                input.focus();
                return;
            }

            // Adicionar código do país se necessário
            if (number.length === 10 || number.length === 11) {
                number = `55${number}`;
            }

            // Feedback visual de sucesso
            showNotification('Abrindo WhatsApp...', 'success');
            
            // Pequeno delay para o feedback visual
            setTimeout(() => {
                const whatsappLink = `https://wa.me/${number}`;
                window.open(whatsappLink, '_blank');
            }, 500);
        }

        // Sistema de notificações
        function showNotification(message, type = 'info') {
            // Remove notificação existente se houver
            const existing = document.getElementById('notification');
            if (existing) {
                existing.remove();
            }

            const notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
                type === 'error' ? 'bg-red-500 text-white' : 
                type === 'success' ? 'bg-green-500 text-white' : 
                'bg-blue-500 text-white'
            }`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Animação de entrada
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
                notification.style.opacity = '1';
            }, 100);
            
            // Remove após 3 segundos
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        }

        // Formatação automática do input
        document.getElementById('whatsappNumber').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos (DDD + número)
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Formata o número conforme o usuário digita
            if (value.length >= 2) {
                value = value.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/, (match, p1, p2, p3) => {
                    let formatted = `(${p1})`;
                    if (p2) formatted += ` ${p2}`;
                    if (p3) formatted += `-${p3}`;
                    return formatted;
                });
            }
            
            e.target.value = value;
        });

        // Enter para enviar
        document.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                startWhatsAppChat();
            }
        });

        // Foco automático no input
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('whatsappNumber').focus();
        });

        // Animação das partículas (mais suave)
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = particle.style.height = (Math.random() * 4 + 1) + 'px';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            document.querySelector('.particles').appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 20000);
        }

        // Criar partículas periodicamente
        setInterval(createParticle, 2000);