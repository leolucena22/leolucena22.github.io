let currentData = [];

        // Mensagens de saudação aleatórias
        const saudacoes = [
            "Olá {{nome}}! Esperamos que você esteja bem!",
            "Oi {{nome}}! Como você está?",
            "Olá {{nome}}! Que bom falar com você!",
            "Oi {{nome}}! Espero que seu dia esteja sendo incrível!",
            "Olá {{nome}}! É um prazer entrar em contato!",
            "Oi {{nome}}! Tudo bem por aí?",
            "Olá {{nome}}! Que alegria poder conversar com você!",
            "Oi {{nome}}! Espero que esteja tudo ótimo!"
        ];

        // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Check for saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.classList.toggle('dark', savedTheme === 'dark');
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        document.getElementById('fileInput').addEventListener('change', handleFile);
        document.getElementById('nomeEvento').addEventListener('input', updateTable);
        document.getElementById('mensagemPersonalizada').addEventListener('input', updateTable);

        function insertTag(tag) {
            const textarea = document.getElementById("mensagemPersonalizada");
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            textarea.value = text.substring(0, start) + tag + text.substring(end);
            textarea.focus();
            updateTable();
        }

        function getEnviados() {
            return JSON.parse(localStorage.getItem("contatosEnviados") || "{}");
        }

        function getSaudacoesEnviadas() {
            return JSON.parse(localStorage.getItem("saudacoesEnviadas") || "{}");
        }

        function salvarEnviado(telefone) {
            const normalizado = telefone.replace(/\D/g, '');
            const enviados = getEnviados();
            enviados[normalizado] = (enviados[normalizado] || 0) + 1;
            localStorage.setItem("contatosEnviados", JSON.stringify(enviados));
        }

        function salvarSaudacaoEnviada(telefone) {
            const normalizado = telefone.replace(/\D/g, '');
            const saudacoesEnviadas = getSaudacoesEnviadas();
            saudacoesEnviadas[normalizado] = (saudacoesEnviadas[normalizado] || 0) + 1;
            localStorage.setItem("saudacoesEnviadas", JSON.stringify(saudacoesEnviadas));
        }

        function getContadorEnvios(telefone) {
            const normalizado = telefone.replace(/\D/g, '');
            const enviados = getEnviados();
            return enviados[normalizado] || 0;
        }

        function getContadorSaudacoes(telefone) {
            const normalizado = telefone.replace(/\D/g, '');
            const saudacoesEnviadas = getSaudacoesEnviadas();
            return saudacoesEnviadas[normalizado] || 0;
        }

        function getRandomGreeting(row) {
            const nome = row.nome ? `*${row.nome.toUpperCase()}*` : '*Participante*';
            const saudacao = saudacoes[Math.floor(Math.random() * saudacoes.length)];
            return saudacao.replace(/{{\s*nome\s*}}/gi, nome);
        }

        function getRandomMessage(row) {
            const nome = row.nome ? `*${row.nome.toUpperCase()}*` : '*Participante*';
            const titulo = row.titulo ? `*${row.titulo.toUpperCase()}*` : '*seu trabalho*';
            const evento = `*${document.getElementById('nomeEvento').value.trim() || 'o evento'}*`;

            const mensagens = document.getElementById('mensagemPersonalizada').value
                .split('\n')
                .map(m => m.trim())
                .filter(m => m.length > 0);

            const modelo = mensagens[Math.floor(Math.random() * mensagens.length)] ||
                "Olá {{nome}}, seu trabalho {{titulo}} foi recebido com sucesso em {{evento}}.";

            return modelo
                .replace(/{{\s*nome\s*}}/gi, nome)
                .replace(/{{\s*titulo\s*}}/gi, titulo)
                .replace(/{{\s*evento\s*}}/gi, evento);
        }

        function enviarSaudacao(index) {
            const row = currentData[index];
            const telefone = row.telefone.replace(/\D/g, '');
            const mensagem = getRandomGreeting(row);
            const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
            salvarSaudacaoEnviada(telefone);
            window.open(link, '_blank');
            setTimeout(() => {
                renderTable(currentData);
                updateStats();
            }, 100);
        }

        function enviarMensagem(index) {
            const row = currentData[index];
            const telefone = row.telefone.replace(/\D/g, '');
            const mensagem = getRandomMessage(row);
            const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
            salvarEnviado(telefone);
            window.open(link, '_blank');
            setTimeout(() => {
                renderTable(currentData);
                updateStats();
            }, 100);
        }

        function updateTable() {
            if (currentData.length > 0) {
                renderTable(currentData);
                updateStats();
            }
        }

        function updateStats() {
            const enviados = getEnviados();
            const total = currentData.length;
            const enviadosCount = currentData.filter(row => {
                const telefone = row.telefone.replace(/\D/g, '');
                return enviados[telefone] && enviados[telefone] > 0;
            }).length;
            const pendentes = total - enviadosCount;

            document.getElementById('totalContatos').textContent = total;
            document.getElementById('mensagensEnviadas').textContent = enviadosCount;
            document.getElementById('mensagensPendentes').textContent = pendentes;
            document.getElementById('statsContainer').classList.remove('hidden');
        }

        function handleFile(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const raw = XLSX.utils.sheet_to_json(sheet, { range: 1 });

                    currentData = raw.map(row => {
                        const lowerKeys = Object.keys(row).reduce((acc, key) => {
                            acc[key.toLowerCase().trim()] = row[key];
                            return acc;
                        }, {});

                        const produto = (lowerKeys['produto'] || '').toString().toLowerCase();
                        const telefone = (lowerKeys['telefone'] || '').toString().replace(/\D/g, '');

                        if (produto.includes('premium') || produto.includes('plus') || produto.includes('combo')) return null;

                        return {
                            nome: lowerKeys['autor'] || lowerKeys['nome'] || '',
                            telefone: telefone,
                            email: lowerKeys['e-mail'] || lowerKeys['email'] || '',
                            titulo: lowerKeys['título'] || lowerKeys['titulo'] || '',
                            tipo: lowerKeys['tipo'] || '',
                            apresentacao: lowerKeys['apresentação'] || lowerKeys['apresentacao'] || '',
                            produto: lowerKeys['produto'] || ''
                        };
                    }).filter(Boolean);

                    renderTable(currentData);
                    updateStats();
                } catch (error) {
                    alert('Erro ao processar arquivo. Verifique se é um arquivo Excel válido.');
                }
            };
            reader.readAsArrayBuffer(file);
        }

        // Função para truncar texto (mantida para compatibilidade)
        function truncateText(text, maxLength = 15) {
            if (!text) return '';
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }

        // Função para quebrar texto em múltiplas linhas
        function breakLongText(text, maxLineLength = 20) {
            if (!text) return '';
            
            const words = text.split(' ');
            const lines = [];
            let currentLine = '';
            
            words.forEach(word => {
                if ((currentLine + word).length > maxLineLength && currentLine.length > 0) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    currentLine += word + ' ';
                }
            });
            
            if (currentLine.trim().length > 0) {
                lines.push(currentLine.trim());
            }
            
            // Limitar a 2 linhas para não ocupar muito espaço
            const displayLines = lines.slice(0, 2);
            if (lines.length > 2) {
                displayLines[1] = displayLines[1].substring(0, 15) + '...';
            }
            
            return displayLines.join('<br>');
        }

        function renderTable(data) {
            const enviados = getEnviados();
            const saudacoesEnviadas = getSaudacoesEnviadas();
            const container = document.getElementById('tableContainer');

            if (data.length === 0) {
                container.innerHTML = '';
                return;
            }

            // Desktop Table - Layout mais compacto
            let desktopHtml = `
                <div class="glass-effect rounded-3xl p-4 card-shadow desktop-table">
                    <h3 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">📋 Lista de Contatos</h3>
                    <div class="table-responsive overflow-x-auto">
                        <table class="w-full text-xs compact-table">
                            <thead class="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-10">
                                <tr>
                                    <th class="px-2 py-2 text-left font-medium rounded-tl-xl min-w-[100px]">Nome</th>
                                    <th class="px-2 py-2 text-left font-medium min-w-[90px]">Telefone</th>
                                    <th class="px-2 py-2 text-left font-medium min-w-[80px]">Título</th>
                                    <th class="px-2 py-2 text-left font-medium min-w-[60px]">Tipo</th>
                                    <th class="px-2 py-2 text-center font-medium min-w-[70px]">Status</th>
                                    <th class="px-2 py-2 text-center font-medium rounded-tr-xl min-w-[140px]">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            `;

            // Mobile Cards
            let mobileHtml = `
                <div class="mobile-card">
                    <h3 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 text-center">📋 Lista de Contatos</h3>
            `;

            data.forEach((row, index) => {
                const telefone = row.telefone.replace(/\D/g, '');
                const contadorMensagens = getContadorEnvios(telefone);
                const contadorSaudacoes = getContadorSaudacoes(telefone);
                const jaEnviado = contadorMensagens > 0;
                const saudacaoEnviada = contadorSaudacoes > 0;

                // Desktop row
                let statusClass, statusIcon, statusText, mensagemButton, saudacaoButton;

                if (jaEnviado) {
                    statusClass = 'status-sent';
                    statusIcon = '✅';
                    statusText = `${contadorMensagens}x`;
                    mensagemButton = `<button onclick="enviarMensagem(${index})"
                        class="btn-primary text-white px-1 py-1 rounded text-xs font-medium shadow-sm hover:scale-105 transition-transform"
                        title="Enviar mensagem (já enviou ${contadorMensagens}x)">
                        📱${contadorMensagens > 0 ? contadorMensagens : ''}
                    </button>`;
                } else {
                    statusClass = 'status-pending';
                    statusIcon = '⏳';
                    statusText = 'Pend';
                    mensagemButton = `<button onclick="enviarMensagem(${index})"
                        class="btn-primary text-white px-1 py-1 rounded text-xs font-medium shadow-sm hover:scale-105 transition-transform"
                        title="Enviar mensagem">
                        📱
                    </button>`;
                }

                // Botão de saudação sempre ativo
                saudacaoButton = `<button onclick="enviarSaudacao(${index})"
                    class="btn-secondary text-white px-1 py-1 rounded text-xs font-medium shadow-sm hover:scale-105 transition-transform"
                    title="Enviar saudação${contadorSaudacoes > 0 ? ` (já enviou ${contadorSaudacoes}x)` : ''}">
                    👋${contadorSaudacoes > 0 ? contadorSaudacoes : ''}
                </button>`;

                desktopHtml += `
                    <tr class="${jaEnviado ? 'row-sent hover:bg-green-100 dark:hover:bg-green-800/30 transition-all duration-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'}">
                        <td class="px-2 py-2 font-${jaEnviado ? 'bold text-green-800 dark:text-green-100' : 'medium text-gray-900 dark:text-gray-100'} leading-tight relative group" title="${row.nome}">
                            <div class="break-words hyphens-auto">
                                ${breakLongText(row.nome, 25)}
                            </div>
                            ${row.nome && row.nome.length > 25 ? `
                                <div class="absolute z-50 invisible group-hover:visible bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded px-2 py-1 -top-8 left-0 whitespace-nowrap shadow-lg">
                                    ${row.nome}
                                </div>
                            ` : ''}
                        </td>
                        <td class="px-2 py-2 ${jaEnviado ? 'font-medium text-green-700 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}">${row.telefone}</td>
                        <td class="px-2 py-2 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'} leading-tight relative group" title="${row.titulo}">
                            <div class="break-words hyphens-auto">
                                ${breakLongText(row.titulo, 30)}
                            </div>
                            ${row.titulo && row.titulo.length > 30 ? `
                                <div class="absolute z-50 invisible group-hover:visible bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded px-2 py-1 -top-8 left-0 max-w-xs break-words shadow-lg">
                                    ${row.titulo}
                                </div>
                            ` : ''}
                        </td>
                        <td class="px-2 py-2 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'} leading-tight relative group" title="${row.tipo}">
                            <div class="break-words hyphens-auto">
                                ${breakLongText(row.tipo, 15)}
                            </div>
                            ${row.tipo && row.tipo.length > 15 ? `
                                <div class="absolute z-50 invisible group-hover:visible bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded px-2 py-1 -top-8 left-0 whitespace-nowrap shadow-lg">
                                    ${row.tipo}
                                </div>
                            ` : ''}
                        </td>
                        <td class="px-2 py-2 text-center">
                            <span class="status-badge ${statusClass} text-xs px-2 py-1 rounded-full ${jaEnviado ? 'pulse-animation' : ''}" title="${jaEnviado ? `Enviado ${contadorMensagens} vez(es)` : 'Pendente'}">
                                ${statusIcon}${statusText !== 'Pend' ? ' ' + statusText : ''}
                            </span>
                        </td>
                        <td class="px-2 py-2 text-center">
                            <div class="flex gap-1 justify-center items-center">
                                ${mensagemButton}
                                ${saudacaoButton}
                                <button onclick="editarContato(${index})" 
                                    class="text-blue-600 hover:text-blue-800 p-1 rounded hover:scale-105 transition-transform text-xs"
                                    title="Editar contato">
                                    ✏️
                                </button>
                                <button onclick="excluirContato(${index})" 
                                    class="text-red-600 hover:text-red-800 p-1 rounded hover:scale-105 transition-transform text-xs"
                                    title="Excluir contato">
                                    🗑️
                                </button>
                            </div>
                        </td>
                    </tr>
                `;

                // Mobile card
                mobileHtml += `
                    <div class="mobile-card-item ${jaEnviado ? 'sent' : ''}">
                        <div class="mobile-header">
                            <div class="flex-1 min-w-0">
                                <h4 class="mobile-name ${jaEnviado ? 'sent' : ''} break-words leading-tight">${row.nome}</h4>
                                <p class="mobile-phone">${row.telefone}</p>
                            </div>
                            <span class="status-badge ${statusClass} ${jaEnviado ? 'pulse-animation' : ''} flex-shrink-0 ml-2">
                                ${statusIcon} ${jaEnviado ? `Enviado ${contadorMensagens}x` : 'Pendente'}
                            </span>
                        </div>
                        
                        <div class="mobile-details">
                            <div class="mobile-detail-item">
                                <div class="mobile-detail-label">E-mail</div>
                                <div class="mobile-detail-value break-words">${row.email || 'Não informado'}</div>
                            </div>
                            
                            <div class="mobile-detail-item">
                                <div class="mobile-detail-label">Título do Trabalho</div>
                                <div class="mobile-detail-value break-words leading-tight">${row.titulo || 'Não informado'}</div>
                            </div>
                            
                            <div class="mobile-detail-item">
                                <div class="mobile-detail-label">Tipo</div>
                                <div class="mobile-detail-value break-words">${row.tipo || 'Não informado'}</div>
                            </div>
                            
                            <div class="mobile-detail-item">
                                <div class="mobile-detail-label">Apresentação</div>
                                <div class="mobile-detail-value break-words leading-tight">${row.apresentacao || 'Não informado'}</div>
                            </div>
                            
                            <div class="mobile-detail-item">
                                <div class="mobile-detail-label">Produto</div>
                                <div class="mobile-detail-value break-words">${row.produto || 'Não informado'}</div>
                            </div>
                        </div>
                        
                        <div class="mobile-buttons">
                            <button onclick="enviarMensagem(${index})" class="mobile-btn btn-primary">
                                📱 ${contadorMensagens > 0 ? `Mensagem (${contadorMensagens}x)` : 'Enviar Mensagem'}
                            </button>
                            <button onclick="enviarSaudacao(${index})" class="mobile-btn btn-secondary">
                                👋 ${contadorSaudacoes > 0 ? `Saudação (${contadorSaudacoes}x)` : 'Enviar Saudação'}
                            </button>
                        </div>
                        
                        <div class="mobile-buttons-secondary">
                            <button onclick="editarContato(${index})" class="mobile-btn mobile-btn-edit">
                                ✏️ Editar
                            </button>
                            <button onclick="excluirContato(${index})" class="mobile-btn mobile-btn-delete">
                                🗑️ Excluir
                            </button>
                        </div>
                    </div>
                `;
            });

            // Fechar desktop table
            desktopHtml += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Fechar mobile cards
            mobileHtml += `
                </div>
            `;

            // Combinar HTML final
            container.innerHTML = desktopHtml + mobileHtml;
            
            // Adicionar estilos CSS customizados para tooltips e responsividade
            if (!document.getElementById('custom-responsive-styles')) {
                const style = document.createElement('style');
                style.id = 'custom-responsive-styles';
                style.textContent = `
                    .break-words {
                        word-wrap: break-word;
                        word-break: break-word;
                        overflow-wrap: break-word;
                        hyphens: auto;
                        -webkit-hyphens: auto;
                        -moz-hyphens: auto;
                        -ms-hyphens: auto;
                    }
                    
                    .group:hover .group-hover\\:visible {
                        visibility: visible !important;
                    }
                    
                    .leading-tight {
                        line-height: 1.25;
                    }
                    
                    /* Tooltip personalizado */
                    .tooltip-hover {
                        position: relative;
                    }
                    
                    .tooltip-hover:hover::after {
                        content: attr(data-tooltip);
                        position: absolute;
                        z-index: 1000;
                        bottom: 125%;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        white-space: pre-wrap;
                        max-width: 300px;
                        word-wrap: break-word;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        animation: fadeIn 0.3s ease-in-out;
                    }
                    
                    .tooltip-hover:hover::before {
                        content: '';
                        position: absolute;
                        z-index: 1001;
                        bottom: 120%;
                        left: 50%;
                        transform: translateX(-50%);
                        border: 5px solid transparent;
                        border-top-color: rgba(0, 0, 0, 0.9);
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    /* Melhorar responsividade da tabela */
                    .table-responsive {
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    .compact-table td {
                        vertical-align: top;
                        min-height: 40px;
                    }
                    
                    /* Mobile adjustments */
                    .mobile-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 8px;
                    }
                    
                    .mobile-name {
                        font-size: 16px;
                        font-weight: 600;
                        margin: 0;
                        word-break: break-word;
                    }
                    
                    .mobile-detail-value {
                        word-break: break-word;
                        overflow-wrap: break-word;
                        hyphens: auto;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        // Editar contato
        function editarContato(index) {
            const row = currentData[index];
            const novoNome = prompt("Editar nome:", row.nome);
            if (novoNome === null) return;
            const novoTelefone = prompt("Editar telefone:", row.telefone);
            if (novoTelefone === null) return;
            const novoEmail = prompt("Editar e-mail:", row.email);
            if (novoEmail === null) return;
            const novoTitulo = prompt("Editar título:", row.titulo);
            if (novoTitulo === null) return;
            const novoTipo = prompt("Editar tipo:", row.tipo);
            if (novoTipo === null) return;
            const novaApresentacao = prompt("Editar apresentação:", row.apresentacao);
            if (novaApresentacao === null) return;
            const novoProduto = prompt("Editar produto:", row.produto);
            if (novoProduto === null) return;

            currentData[index] = {
                nome: novoNome,
                telefone: novoTelefone,
                email: novoEmail,
                titulo: novoTitulo,
                tipo: novoTipo,
                apresentacao: novaApresentacao,
                produto: novoProduto
            };
            renderTable(currentData);
            updateStats();
        }

        // Excluir contato
        function excluirContato(index) {
            if (confirm("Tem certeza que deseja excluir este contato?")) {
                currentData.splice(index, 1);
                renderTable(currentData);
                updateStats();
            }
        }