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
            return JSON.parse(localStorage.getItem("contatosEnviados") || "[]");
        }

        function getSaudacoesEnviadas() {
            return JSON.parse(localStorage.getItem("saudacoesEnviadas") || "[]");
        }

        function salvarEnviado(telefone) {
            const normalizado = telefone.replace(/\D/g, '');
            const enviados = getEnviados();
            if (!enviados.includes(normalizado)) {
                enviados.push(normalizado);
                localStorage.setItem("contatosEnviados", JSON.stringify(enviados));
            }
        }

        function salvarSaudacaoEnviada(telefone) {
            const normalizado = telefone.replace(/\D/g, '');
            const saudacoesEnviadas = getSaudacoesEnviadas();
            if (!saudacoesEnviadas.includes(normalizado)) {
                saudacoesEnviadas.push(normalizado);
                localStorage.setItem("saudacoesEnviadas", JSON.stringify(saudacoesEnviadas));
            }
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
            const enviadosCount = currentData.filter(row => 
                enviados.includes(row.telefone.replace(/\D/g, ''))
            ).length;
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

        function renderTable(data) {
            const enviados = getEnviados().map(t => t.replace(/\D/g, ''));
            const saudacoesEnviadas = getSaudacoesEnviadas().map(t => t.replace(/\D/g, ''));
            const container = document.getElementById('tableContainer');

            if (data.length === 0) {
                container.innerHTML = '';
                return;
            }

            // Desktop Table
            let desktopHtml = `
                <div class="glass-effect rounded-3xl p-6 card-shadow desktop-table">
                    <h3 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">📋 Lista de Contatos</h3>
                    <div class="table-responsive">
                        <table class="w-full text-sm compact-table">
                            <thead class="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-10">
                                <tr>
                                    <th class="px-3 py-3 text-left font-semibold rounded-tl-xl">Nome</th>
                                    <th class="px-3 py-3 text-left font-semibold">Telefone</th>
                                    <th class="px-3 py-3 text-left font-semibold">E-mail</th>
                                    <th class="px-3 py-3 text-left font-semibold">Título</th>
                                    <th class="px-3 py-3 text-left font-semibold">Tipo</th>
                                    <th class="px-3 py-3 text-left font-semibold">Apresentação</th>
                                    <th class="px-3 py-3 text-left font-semibold">Produto</th>
                                    <th class="px-3 py-3 text-center font-semibold">Status</th>
                                    <th class="px-3 py-3 text-center font-semibold rounded-tr-xl">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            `;

            // Mobile Cards
            let mobileHtml = `
                <div class="mobile-card">
                    <h3 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200 text-center">📋 Lista de Contatos</h3>
            `;

            data.forEach((row, index) => {
                const telefone = row.telefone.replace(/\D/g, '');
                const jaEnviado = enviados.includes(telefone);
                const saudacaoEnviada = saudacoesEnviadas.includes(telefone);

                // Desktop row
                let statusClass, statusIcon, statusText, mensagemButton;

                if (jaEnviado) {
                    statusClass = 'status-sent';
                    statusIcon = '✅';
                    statusText = 'Enviado';
                    mensagemButton = `<button onclick="enviarMensagem(${index})"
                        class="btn-primary text-white px-2 py-1 rounded-md text-xs font-medium shadow-md opacity-70 cursor-not-allowed"
                        disabled>
                        ✅ Enviada
                    </button>`;
                } else {
                    statusClass = 'status-pending';
                    statusIcon = '⏳';
                    statusText = 'Pendente';
                    mensagemButton = `<button onclick="enviarMensagem(${index})"
                        class="btn-primary text-white px-2 py-1 rounded-md text-xs font-medium shadow-md">
                        📱 Mensagem
                    </button>`;
                }

                // Botão de saudação
                let saudacaoButton;
                if (saudacaoEnviada) {
                    saudacaoButton = `<button onclick="enviarSaudacao(${index})"
                        class="btn-secondary text-white px-2 py-1 rounded-md text-xs font-medium shadow-md opacity-70 cursor-not-allowed ml-1"
                        disabled>
                        👋 Enviada
                    </button>`;
                } else {
                    saudacaoButton = `<button onclick="enviarSaudacao(${index})"
                        class="btn-secondary text-white px-2 py-1 rounded-md text-xs font-medium shadow-md ml-1">
                        👋 Saudação
                    </button>`;
                }

                desktopHtml += `
                    <tr class="${jaEnviado ? 'row-sent hover:bg-green-100 dark:hover:bg-green-800/30 transition-all duration-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'}">
                        <td class="px-3 py-3 font-${jaEnviado ? 'bold text-green-800 dark:text-green-100' : 'medium text-gray-900 dark:text-gray-100'} max-w-[120px] truncate">${row.nome}</td>
                        <td class="px-3 py-3 ${jaEnviado ? 'font-medium text-green-700 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}">${row.telefone}</td>
                        <td class="px-3 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'} max-w-[150px] truncate">${row.email}</td>
                        <td class="px-3 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'} max-w-[200px] truncate" title="${row.titulo}">${row.titulo}</td>
                        <td class="px-3 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}">${row.tipo}</td>
                        <td class="px-3 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'} max-w-[120px] truncate">${row.apresentacao}</td>
                        <td class="px-3 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'} max-w-[100px] truncate">${row.produto}</td>
                        <td class="px-3 py-3 text-center">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-${jaEnviado ? 'bold' : 'medium'} ${statusClass} ${jaEnviado ? 'pulse-animation' : ''}">
                                ${statusIcon} ${statusText}
                            </span>
                        </td>
                        <td class="px-3 py-3 text-center">
                            <div class="flex justify-center items-center space-x-1">
                                ${mensagemButton}
                                ${saudacaoButton}
                                <button onclick="editarContato(${index})" 
                                    class="btn-edit text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                                    ✏️
                                </button>
                                <button onclick="excluirContato(${index})" 
                                    class="btn-delete text-red-600 hover:text-red-800 px-2 py-1 rounded-md text-xs font-medium">
                                    🗑️
                                </button>
                            </div>
                        </td>
                    </tr>
                `;

                // Mobile card
                mobileHtml += `
                    <div class="glass-effect rounded-2xl p-4 mb-4 card-shadow ${jaEnviado ? 'border-l-4 border-green-500' : ''}">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-1">
                                <h4 class="font-semibold text-lg ${jaEnviado ? 'text-green-800 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'}">${row.nome}</h4>
                                <p class="text-sm ${jaEnviado ? 'text-green-700 dark:text-green-200' : 'text-gray-600 dark:text-gray-400'}">${row.telefone}</p>
                            </div>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-${jaEnviado ? 'bold' : 'medium'} ${statusClass} ${jaEnviado ? 'pulse-animation' : ''}">
                                ${statusIcon} ${statusText}
                            </span>
                        </div>
                        
                        <div class="space-y-2 text-sm">
                            <div class="flex flex-wrap gap-2">
                                <span class="inline-block bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                                    <strong>E-mail:</strong> ${row.email}
                                </span>
                                <span class="inline-block bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                                    <strong>Tipo:</strong> ${row.tipo}
                                </span>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                                <p><strong>Título:</strong> ${row.titulo}</p>
                                <p><strong>Apresentação:</strong> ${row.apresentacao}</p>
                                <p><strong>Produto:</strong> ${row.produto}</p>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-2 mt-4">
                            ${mensagemButton}
                            ${saudacaoButton}
                            <button onclick="editarContato(${index})" 
                                class="btn-edit text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-xs font-medium border border-blue-300">
                                ✏️ Editar
                            </button>
                            <button onclick="excluirContato(${index})" 
                                class="btn-delete text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-xs font-medium border border-red-300">
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

            // Atualizar contadores
            updateCounters();
        }

        // Atualiza os contadores de contatos na tabela (opcional, caso queira mostrar no topo da tabela)
        function updateCounters() {
            // Exemplo: pode ser expandido para mostrar contadores em outros lugares
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