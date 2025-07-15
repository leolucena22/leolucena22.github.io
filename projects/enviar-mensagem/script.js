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

            let html = `
                <div class="glass-effect rounded-3xl p-6 card-shadow">
                    <h3 class="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">📋 Lista de Contatos</h3>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                <tr>
                                    <th class="px-4 py-3 text-left font-semibold rounded-tl-xl">Nome</th>
                                    <th class="px-4 py-3 text-left font-semibold">Telefone</th>
                                    <th class="px-4 py-3 text-left font-semibold">E-mail</th>
                                    <th class="px-4 py-3 text-left font-semibold">Título</th>
                                    <th class="px-4 py-3 text-left font-semibold">Tipo</th>
                                    <th class="px-4 py-3 text-left font-semibold">Apresentação</th>
                                    <th class="px-4 py-3 text-left font-semibold">Produto</th>
                                    <th class="px-4 py-3 text-center font-semibold">Status</th>
                                    <th class="px-4 py-3 text-center font-semibold rounded-tr-xl">Ações</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            `;

            data.forEach((row, index) => {
                const telefone = row.telefone.replace(/\D/g, '');
                const jaEnviado = enviados.includes(telefone);
                const saudacaoEnviada = saudacoesEnviadas.includes(telefone);
                
                let statusClass, statusIcon, statusText, mensagemButton;

                if (jaEnviado) {
                    statusClass = 'status-sent';
                    statusIcon = '✅';
                    statusText = 'Enviado';
                    mensagemButton = `<button onclick="enviarMensagem(${index})"
                        class="btn-primary text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md opacity-70 cursor-not-allowed"
                        disabled>
                        ✅ Enviada
                    </button>`;
                } else {
                    statusClass = 'status-pending';
                    statusIcon = '⏳';
                    statusText = 'Pendente';
                    mensagemButton = `<button onclick="enviarMensagem(${index})"
                        class="btn-primary text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md">
                        📱 Mensagem
                    </button>`;
                }

                html += `
                    <tr class="${jaEnviado ? 'row-sent hover:bg-green-100 dark:hover:bg-green-800/30 transition-all duration-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'}">
                        <td class="px-4 py-3 font-${jaEnviado ? 'bold text-green-800 dark:text-green-100' : 'medium text-gray-900 dark:text-gray-100'}">${row.nome}</td>
                        <td class="px-4 py-3 ${jaEnviado ? 'font-medium text-green-700 dark:text-green-200' : 'text-gray-700 dark:text-gray-300'}">${row.telefone}</td>
                        <td class="px-4 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}">${row.email}</td>
                        <td class="px-4 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}">${row.titulo}</td>
                        <td class="px-4 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}">${row.tipo}</td>
                        <td class="px-4 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}">${row.apresentacao}</td>
                        <td class="px-4 py-3 ${jaEnviado ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}">${row.produto}</td>
                        <td class="px-4 py-3 text-center">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-${jaEnviado ? 'bold' : 'medium'} ${statusClass} ${jaEnviado ? 'pulse-animation' : ''}">
                                ${statusIcon} ${statusText}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-center">
                            <div class="flex justify-center space-x-2">
                                <button onclick="enviarSaudacao(${index})"
                                    class="btn-greeting text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md ${saudacaoEnviada ? 'opacity-50 cursor-not-allowed' : ''}"
                                    ${saudacaoEnviada ? 'disabled' : ''}>
                                    ${saudacaoEnviada ? '👋 Enviada' : '👋 Saudar'}
                                </button>
                                ${mensagemButton}
                            </div>
                        </td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            container.innerHTML = html;
        }

        // Theme Toggle
        tailwind.config = {
            darkMode: 'class',
        }

        const html = document.documentElement;
        const botaoTema = document.getElementById('themeToggle');
        const temaSalvo = localStorage.getItem('tema');
        const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (temaSalvo === 'escuro' || (!temaSalvo && prefereEscuro)) {
            html.classList.add('dark');
            botaoTema.textContent = '🌞';
        } else {
            html.classList.remove('dark');
            botaoTema.textContent = '🌙';
        }

        botaoTema.addEventListener('click', () => {
            const estaEscuro = html.classList.toggle('dark');
            localStorage.setItem('tema', estaEscuro ? 'escuro' : 'claro');
            botaoTema.textContent = estaEscuro ? '🌞' : '🌙';
        });