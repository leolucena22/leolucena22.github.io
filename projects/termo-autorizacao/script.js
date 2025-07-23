const { jsPDF } = window.jspdf;
        let xlsxData = [];
        let statusTimeout;

        const logoPath = 'assets/logo.png'; // Verifique se o caminho da logo está correto
        let logoImageElement = null;

        const eventNameInput = document.getElementById('eventName');

        document.getElementById('xlsxFile').addEventListener('change', handleXlsxUpload);
        document.getElementById('generateAllBtn').addEventListener('click', generateAllPDFs);
        document.getElementById('generateSampleBtn').addEventListener('click', generateSamplePDF);
        document.getElementById('generateAllCadastroBtn').addEventListener('click', generateAllCadastroPDFs);
        document.getElementById('dataPreview').addEventListener('click', handleTableActions);

        const editModal = document.getElementById('editModal');
        const closeButton = document.querySelector('.close-button');
        const editForm = document.getElementById('editForm');
        const editIndex = document.getElementById('editIndex');
        const editNome = document.getElementById('editNome');
        const editCpf = document.getElementById('editCpf');
        const editEndereco = document.getElementById('editEndereco');
        const editCep = document.getElementById('editCep');
        const editTelefone = document.getElementById('editTelefone');
        const editMiniCurriculo = document.getElementById('editMiniCurriculo');
        const editTitulo = document.getElementById('editTitulo');
        const editRedesSociais = document.getElementById('editRedesSociais');
        const editLinkLattesLinkedin = document.getElementById('editLinkLattesLinkedin');
        const editFoto = document.getElementById('editFoto');
        const editEmail = document.getElementById('editEmail');
        const editCarimbo = document.getElementById('editCarimbo');

        closeButton.addEventListener('click', () => editModal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target == editModal) {
                editModal.style.display = 'none';
            }
        });
        editForm.addEventListener('submit', handleSaveEdit);

        function preloadLogo() {
            logoImageElement = new Image();
            logoImageElement.onload = () => console.log('Logo carregada com sucesso!');
            logoImageElement.onerror = () => showStatus('Erro ao carregar a logo! Verifique o caminho: ' + logoPath, 'error');
            logoImageElement.src = logoPath;
        }
        preloadLogo();

        function handleXlsxUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});

                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    if (jsonData.length === 0) {
                        showStatus('Planilha vazia ou sem dados válidos!', 'error');
                        return;
                    }

                    xlsxData = jsonData.map(row => {
                        const findColumn = (possibleNames) => {
                            for (const key in row) {
                                for (const name of possibleNames) {
                                    if (key.toLowerCase().includes(name.toLowerCase())) {
                                        return row[key];
                                    }
                                }
                            }
                            return '';
                        };

                        return {
                            carimbo: findColumn(['carimbo', 'data/hora', 'timestamp']),
                            nome: findColumn(['nome completo', 'nome']),
                            cpf: findColumn(['cpf']),
                            email: findColumn(['endereço de e-mail', 'email', 'e-mail']),
                            endereco: findColumn(['endereço completo', 'endereco', 'rua', 'end. completo']),
                            cep: findColumn(['cep', 'c.e.p.']),
                            telefone: findColumn(['telefone', 'celular', 'tel.']),
                            minicurriculo: findColumn(['mini currículo', 'mini curriculo', 'breve descrição', 'titulações e experiências']),
                            titulo: findColumn(['título da palestra', 'titulo', 'palestra', 'minicurso']),
                            redesSociais: findColumn(['redes sociais', 'instagram', 'facebook', 'youtube', 'social']),
                            linkLattesLinkedin: findColumn(['link do lattes ou linkedin', 'lattes', 'linkedin', 'link lattes']),
                            foto: findColumn(['anexe sua foto', 'foto'])
                        };
                    });

                    // Filtra linhas que têm pelo menos nome e CPF
                    xlsxData = xlsxData.filter(row => row.nome && row.cpf);

                    displayPreview(xlsxData);
                    showStatus(`${xlsxData.length} registros carregados com sucesso!`, 'success');

                } catch (error) {
                    showStatus('Erro ao processar arquivo XLSX: ' + error.message, 'error');
                    console.error('Erro de processamento XLSX:', error);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function displayPreview(data) {
            const previewSection = document.getElementById('previewSection');
            const dataPreview = document.getElementById('dataPreview');
            const generateSection = document.getElementById('generateSection');

            if (data.length === 0) {
                previewSection.classList.add('hidden');
                generateSection.classList.add('hidden');
                dataPreview.innerHTML = '<p class="text-gray-500">Nenhum registro para exibir.</p>';
                return;
            }

            let tableHTML = `
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
            `;

            data.forEach((row, index) => {
                tableHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.nome || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatCPF(row.cpf) || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${row.email || 'N/A'}</td>
                        <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">${row.titulo || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button class="generate-individual-term-btn text-indigo-600 hover:text-indigo-900 mr-2" data-index="${index}">Gerar Termo</button>
                            <button class="generate-individual-cadastro-btn text-blue-600 hover:text-blue-900 mr-2" data-index="${index}">Gerar Ficha</button>
                            <button class="edit-btn text-yellow-600 hover:text-yellow-900 mr-2" data-index="${index}">Editar</button>
                            <button class="delete-btn text-red-600 hover:text-red-900" data-index="${index}">Excluir</button>
                        </td>
                    </tr>
                `;
            });

            tableHTML += '</tbody></table>';
            dataPreview.innerHTML = tableHTML;
            previewSection.classList.remove('hidden');
            generateSection.classList.remove('hidden');
        }

        function handleTableActions(event) {
            const target = event.target;
            const index = target.dataset.index;

            if (target.classList.contains('generate-individual-term-btn')) {
                const palestrante = xlsxData[index];
                if (palestrante) {
                    generatePDF(palestrante);
                    showStatus(`PDF de Termo para ${palestrante.nome} gerado com sucesso!`, 'success');
                } else {
                    showStatus('Erro: Dados do palestrante não encontrados para geração do termo.', 'error');
                }
            } else if (target.classList.contains('generate-individual-cadastro-btn')) {
                const palestrante = xlsxData[index];
                if (palestrante) {
                    generateCadastroPDF(palestrante);
                    showStatus(`PDF de Ficha de Cadastro para ${palestrante.nome} gerado com sucesso!`, 'success');
                } else {
                    showStatus('Erro: Dados do palestrante não encontrados para geração da ficha.', 'error');
                }
            } else if (target.classList.contains('edit-btn')) {
                openEditModal(index);
            } else if (target.classList.contains('delete-btn')) {
                deleteRecord(index);
            }
        }

        function openEditModal(index) {
            const record = xlsxData[index];
            if (record) {
                editIndex.value = index;
                editNome.value = record.nome || '';
                editCpf.value = record.cpf || '';
                editEmail.value = record.email || '';
                editEndereco.value = record.endereco || '';
                editCep.value = record.cep || '';
                editTelefone.value = record.telefone || '';
                editMiniCurriculo.value = record.minicurriculo || '';
                editTitulo.value = record.titulo || '';
                editRedesSociais.value = record.redesSociais || '';
                editLinkLattesLinkedin.value = record.linkLattesLinkedin || '';
                editFoto.value = record.foto || '';
                editCarimbo.value = formatDateTime(record.carimbo) || '';
                editModal.style.display = 'flex';
            } else {
                showStatus('Registro não encontrado para edição.', 'error');
            }
        }

        function handleSaveEdit(event) {
            event.preventDefault();
            const index = editIndex.value;
            if (index !== null && index !== undefined && xlsxData[index]) {
                xlsxData[index].nome = editNome.value;
                xlsxData[index].cpf = editCpf.value;
                xlsxData[index].email = editEmail.value;
                xlsxData[index].endereco = editEndereco.value;
                xlsxData[index].cep = editCep.value;
                xlsxData[index].telefone = editTelefone.value;
                xlsxData[index].minicurriculo = editMiniCurriculo.value;
                xlsxData[index].titulo = editTitulo.value;
                xlsxData[index].redesSociais = editRedesSociais.value;
                xlsxData[index].linkLattesLinkedin = editLinkLattesLinkedin.value;
                xlsxData[index].foto = editFoto.value;

                displayPreview(xlsxData);
                editModal.style.display = 'none';
                showStatus('Registro atualizado com sucesso!', 'success');
            } else {
                showStatus('Erro ao salvar edição: Registro não encontrado.', 'error');
            }
        }

        function deleteRecord(index) {
            if (confirm(`Tem certeza que deseja excluir o registro de ${xlsxData[index].nome}?`)) {
                xlsxData.splice(index, 1);
                displayPreview(xlsxData);
                showStatus('Registro excluído com sucesso!', 'success');
            }
        }

        function formatDateTime(timestamp) {
            if (!timestamp) return '';
            try {
                let date;
                // Detecta se é um número de série de data do Excel ou string/timestamp normal
                if (typeof timestamp === 'number' && timestamp > 10000) { 
                    date = new Date((timestamp - 25569) * 86400 * 1000); // Excel to JS date
                } else {
                    date = new Date(timestamp);
                }

                if (isNaN(date.getTime())) {
                    // Tenta parser como string, se o timestamp não for um número diretamente reconhecível
                    date = new Date(String(timestamp));
                    if (isNaN(date.getTime())) {
                        return String(timestamp); // Retorna o original se falhar novamente
                    }
                }

                return date.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (error) {
                console.error("Erro ao formatar data/hora:", timestamp, error);
                return String(timestamp);
            }
        }

        function formatCPF(cpf) {
            if (!cpf) return '';
            const cleanCpf = String(cpf).replace(/\D/g, '');
            if (cleanCpf.length === 11) {
                return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }
            return cleanCpf;
        }

        function formatCEP(cep) {
            if (!cep) return '';
            const cleanCep = String(cep).replace(/\D/g, '');
            if (cleanCep.length === 8) {
                return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            return cleanCep;
        }

        function formatPhone(phone) {
            if (!phone) return '';
            const cleanPhone = String(phone).replace(/\D/g, '');
            if (cleanPhone.length === 11) { // (XX) XXXXX-XXXX
                return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (cleanPhone.length === 10) { // (XX) XXXX-XXXX
                return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            return cleanPhone;
        }


        // Função auxiliar para adicionar texto formatado com quebra de linha automática e bold
        function addFormattedText(doc, parts, x, y, maxWidth, lineHeight) {
            let currentY = y;
            let currentLineParts = [];
            let currentLineWidth = 0;
            const normalSpaceWidth = doc.getTextWidth(' ');

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const words = part.text.replace(/\n/g, ' [NEWLINE] ').split(' ').filter(w => w !== '');
                
                for (let j = 0; j < words.length; j++) {
                    let word = words[j];

                    if (word === '[NEWLINE]') {
                        let tempX = x;
                        for(const linePart of currentLineParts) {
                            doc.setFont(undefined, linePart.bold ? 'bold' : 'normal');
                            doc.text(linePart.text, tempX, currentY);
                            tempX += doc.getTextWidth(linePart.text);
                            if (currentLineParts.indexOf(linePart) < currentLineParts.length - 1) {
                                tempX += normalSpaceWidth;
                            }
                        }
                        currentY += lineHeight;
                        currentLineParts = [];
                        currentLineWidth = 0;
                        continue;
                    }

                    let wordToMeasure = word;
                    if (currentLineParts.length > 0) {
                        wordToMeasure = ' ' + word;
                    }
                    
                    doc.setFont(undefined, part.bold ? 'bold' : 'normal');
                    const measuredWordWidth = doc.getTextWidth(wordToMeasure);

                    if (currentLineWidth + measuredWordWidth > maxWidth && currentLineParts.length > 0) {
                        let tempX = x;
                        for(const linePart of currentLineParts) {
                            doc.setFont(undefined, linePart.bold ? 'bold' : 'normal');
                            doc.text(linePart.text, tempX, currentY);
                            tempX += doc.getTextWidth(linePart.text);
                            if (currentLineParts.indexOf(linePart) < currentLineParts.length - 1) {
                                tempX += normalSpaceWidth;
                            }
                        }
                        currentY += lineHeight;
                        currentLineParts = [];
                        currentLineWidth = 0;
                        
                        currentLineParts.push({ text: word, bold: part.bold });
                        doc.setFont(undefined, part.bold ? 'bold' : 'normal');
                        currentLineWidth = doc.getTextWidth(word);
                    } else {
                        if (currentLineParts.length > 0) {
                            currentLineParts.push({ text: ' ' + word, bold: part.bold });
                        } else {
                            currentLineParts.push({ text: word, bold: part.bold });
                        }
                        currentLineWidth += measuredWordWidth;
                    }
                }
            }
            
            if (currentLineParts.length > 0) {
                let tempX = x;
                for(const linePart of currentLineParts) {
                    doc.setFont(undefined, linePart.bold ? 'bold' : 'normal');
                    doc.text(linePart.text, tempX, currentY);
                    tempX += doc.getTextWidth(linePart.text);
                    if (currentLineParts.indexOf(linePart) < currentLineParts.length - 1) {
                        tempX += normalSpaceWidth;
                    }
                }
                currentY += lineHeight;
            }

            doc.setFont(undefined, 'normal');
            return currentY;
        }

        // Função para gerar o Termo de Autorização (já existente)
        function generatePDF(palestrante, index = 0, total = 1) {
            const margin = 28.35; // 2 cm em pontos
            const leftMargin = margin;
            const rightMargin = margin;
            
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const contentWidth = pageWidth - leftMargin - rightMargin;
            
            let yPosition = margin;

            if (logoImageElement && logoImageElement.complete) {
                try {
                    const imgWidth = 40;
                    const imgHeight = (logoImageElement.height / logoImageElement.width) * imgWidth;
                    const imgX = (pageWidth - imgWidth) / 2;
                    doc.addImage(logoImageElement, 'PNG', imgX, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 15;
                } catch (error) {
                    console.warn('Erro ao adicionar logo:', error);
                    yPosition += 20;
                }
            } else {
                yPosition += 20;
            }

            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            const title = 'TERMO DE AUTORIZAÇÃO';
            doc.text(title, leftMargin + (contentWidth / 2), yPosition, { align: 'center' });
            yPosition += 20;

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');

            const eventName = eventNameInput.value.trim();
            const nomeDoEvento = eventName || '[NOME DO EVENTO]';
            const nomeCompleto = palestrante.nome || '[NOME DO PALESTRANTE]';
            const cpfCompleto = formatCPF(palestrante.cpf) || '[CPF]';
            const dataAceite = formatDateTime(palestrante.carimbo) || '[DATA E HORA DO ACEITE]';
            
            const lineHeight = 7;

            const termoParts = [
                { text: `Eu, `, bold: false },
                { text: nomeCompleto, bold: true },
                { text: `, `, bold: false },
                { text: `AUTORIZO `, bold: true },
                { text: `o uso da minha imagem, em fotos ou vídeos, para fins de divulgação e exibição da gravação da palestra ou minicurso, a ser encaminhada posteriormente à confirmação do termo, conforme a Lei Geral de Proteção de Dados (LGPD), artigos 7º e 11º da Lei n° 13.709/2018, pelo `, bold: false },
                { text: nomeDoEvento, bold: true },
                { text: `, realizado pela SOCIEDADE BRASILEIRA DE EVENTOS CIENTÍFICOS, com sede na Av. Jeremias Pereira, nº 309 - Centro, Nova Olinda – CE, CEP: 63.165-000, inscrita no CNPJ/MF sob o nº 51.616.646/0001-39.`, bold: false },
                { text: `\n\nEsta autorização é concedida de forma voluntária, após o preenchimento deste formulário de cadastro de palestrante, e abrange o uso da imagem mencionada em todo o território nacional, sem ônus à instituição. Declaro que não haverá qualquer reivindicação de direitos relacionados à minha imagem ou a outros direitos conexos.`, bold: false }
            ];
            
            yPosition = addFormattedText(doc, termoParts, leftMargin, yPosition, contentWidth, lineHeight);
            yPosition += 20;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.text(`Aceite eletrônico em: ${dataAceite}`, leftMargin, yPosition);
            yPosition += 30;

            doc.line(leftMargin, yPosition, leftMargin + 120, yPosition);
            yPosition += 10;

            doc.setFont(undefined, 'bold');
            doc.setFontSize(12);
            doc.text(nomeCompleto, leftMargin, yPosition);
            yPosition += 10;
            
            doc.setFont(undefined, 'normal');
            doc.text(`CPF: ${cpfCompleto}`, leftMargin, yPosition);

            const nomeArquivo = nomeCompleto.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

            if (total === 1) {
                doc.save(`termo_autorizacao_${nomeArquivo}.pdf`);
            } else {
                return {
                    filename: `termo_autorizacao_${nomeArquivo}.pdf`,
                    blob: doc.output('blob')
                };
            }
        }

        // FUNÇÃO ATUALIZADA: Gerar Ficha de Cadastro em PDF com quebra de página
        function generateCadastroPDF(palestrante, index = 0, total = 1) {
            const margin = 20; // Margem padrão
            const leftMargin = margin;
            const topMargin = margin;
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const contentWidth = pageWidth - (2 * margin);
            let yPosition = topMargin;
            const lineHeight = 6;
            const fieldIndent = 10; // Espaçamento para o valor do campo
            const bottomPageThreshold = pageHeight - (margin + 20); // 20 para espaço do rodapé

            // Helper para adicionar cabeçalho (logo e título) em novas páginas
            function addHeaderToPage() {
                let currentHeaderY = topMargin;
                if (logoImageElement && logoImageElement.complete) {
                    try {
                        const imgWidth = 30;
                        const imgHeight = (logoImageElement.height / logoImageElement.width) * imgWidth;
                        const imgX = (pageWidth - imgWidth) / 2;
                        doc.addImage(logoImageElement, 'PNG', imgX, currentHeaderY, imgWidth, imgHeight);
                        currentHeaderY += imgHeight + 10;
                    } catch (error) {
                        console.warn('Erro ao adicionar logo na ficha em nova página:', error);
                        currentHeaderY += 20;
                    }
                } else {
                    currentHeaderY += 20;
                }

                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
                doc.text('FICHA DE CADASTRO DO PALESTRANTE', pageWidth / 2, currentHeaderY, { align: 'center' });
                currentHeaderY += 15;

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.text(`Evento: ${eventNameInput.value.trim() || '[NOME DO EVENTO]'}`, leftMargin, currentHeaderY);
                currentHeaderY += 10;

                return currentHeaderY; // Retorna a nova yPosition após o cabeçalho
            }

            // Inicia a primeira página com o cabeçalho
            yPosition = addHeaderToPage();


            // Helper para adicionar campo no PDF com verificação de página
            function addField(label, value, isBoldValue = true) {
                if (value === undefined || value === null || value === '') {
                    value = 'Não Informado';
                }
                
                doc.setFont(undefined, 'normal');
                // Estima a altura do campo ANTES de adicioná-lo
                const textWidthOfLabel = doc.getTextWidth(`${label}:`);
                const maxTextWidthForValue = contentWidth - textWidthOfLabel - fieldIndent;
                const splitValue = doc.splitTextToSize(String(value), maxTextWidthForValue);
                const estimatedHeight = (splitValue.length * lineHeight) + 2; // +2 para espaçamento extra

                // Verifica se há espaço para este campo
                if (yPosition + estimatedHeight > bottomPageThreshold) {
                    doc.addPage();
                    yPosition = addHeaderToPage(); // Adiciona cabeçalho na nova página
                    yPosition += 10; // Espaço extra após o cabeçalho
                }

                // Agora, adicione o campo
                doc.setFont(undefined, 'normal');
                doc.text(`${label}:`, leftMargin, yPosition);
                doc.setFont(undefined, isBoldValue ? 'bold' : 'normal');
                doc.text(splitValue, leftMargin + textWidthOfLabel + fieldIndent, yPosition);
                yPosition += estimatedHeight; // Atualiza a posição
            }

            // Helper para adicionar uma seção com título e linha separadora
            function addSection(title) {
                 // Estima altura da linha + título + margem
                const estimatedSectionHeight = 5 + 10 + 10; // Linha + título + margem para o primeiro campo

                if (yPosition + estimatedSectionHeight > bottomPageThreshold) {
                    doc.addPage();
                    yPosition = addHeaderToPage();
                    yPosition += 10; // Espaço extra após o cabeçalho
                }

                doc.setDrawColor(150);
                doc.setLineWidth(0.5);
                doc.line(leftMargin, yPosition, pageWidth - margin, yPosition);
                yPosition += 5;

                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(title, leftMargin, yPosition);
                yPosition += 10; // Espaço após o título da seção
            }


            // Seção 1: Dados Pessoais
            addSection('1. Dados Pessoais');
            doc.setFontSize(12);
            addField('Nome Completo', palestrante.nome);
            addField('CPF', formatCPF(palestrante.cpf));
            addField('E-mail', palestrante.email);
            addField('Endereço Completo', palestrante.endereco);
            addField('CEP', formatCEP(palestrante.cep));
            addField('Telefone', formatPhone(palestrante.telefone));
            yPosition += 5; // Espaçamento entre seções


            // Seção 2: Informações Acadêmicas e Profissionais
            addSection('2. Informações Acadêmicas e Profissionais');
            doc.setFontSize(12);
            // Mini currículo pode ser longo, o addField já lida com quebra de linha interna
            // mas precisamos garantir que o bloco do mini currículo não force o rodapé
            addField('Mini Currículo', palestrante.minicurriculo, true); // O 'true' indica bold no valor
            addField('Link Lattes/Linkedin', palestrante.linkLattesLinkedin);
            yPosition += 5; // Espaçamento entre seções


            // Seção 3: Informações da Palestra
            addSection('3. Informações da Palestra/Minicurso');
            doc.setFontSize(12);
            addField('Título', palestrante.titulo);
            addField('Redes Sociais', palestrante.redesSociais);
            addField('Foto Anexada (referência)', palestrante.foto);
            yPosition += 5; // Espaçamento entre seções


            // Seção 4: Aceite do Termo de Autorização
            addSection('4. Aceite do Termo de Autorização');
            doc.setFontSize(12);
            addField('Data e Hora do Aceite', formatDateTime(palestrante.carimbo));
            yPosition += 20;

            // Footer (adicionado na última página ou na única página)
            doc.setFontSize(8);
            doc.setFont(undefined, 'italic');
            doc.text('Documento gerado automaticamente pelo sistema de Gerador de PDFs.', leftMargin, pageHeight - margin);

            const nomeArquivo = (palestrante.nome || 'ficha_cadastro_').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

            if (total === 1) {
                doc.save(`ficha_cadastro_${nomeArquivo}.pdf`);
            } else {
                return {
                    filename: `ficha_cadastro_${nomeArquivo}.pdf`,
                    blob: doc.output('blob')
                };
            }
        }

        function generateSamplePDF() {
            if (xlsxData.length === 0) {
                showStatus('Carregue primeiro um arquivo XLSX!', 'error');
                return;
            }
            if (eventNameInput.value.trim() === '') {
                showStatus('Por favor, insira o nome do evento antes de gerar o PDF de exemplo.', 'error');
                return;
            }

            // Exemplo de dados mais longos para testar a quebra de página
            const sampleData = {
                nome: "Fulano de Tal da Silva Sauro",
                cpf: "12345678901",
                email: "fulano.silva@email.com",
                endereco: "Avenida das Palmeiras, 789, apto 101, Bairro Jardim Imperial, Cidade Nova do Sul, Estado das Flores, CEP 98765-432",
                cep: "98765432",
                telefone: "21998765432",
                minicurriculo: "Doutor em Astrofísica pela Universidade de São Paulo (USP) e pós-doutorado em Buracos Negros na NASA. Atua como pesquisador sênior no Instituto Brasileiro de Pesquisas Espaciais (INPE) desde 2010, com foco em ondas gravitacionais e cosmologia. Possui mais de 50 publicações em periódicos renomados e é frequentemente convidado para palestras internacionais sobre o tema. Membro da Sociedade Brasileira de Física. Experiência em liderança de projetos de grande escala e mentoria de jovens pesquisadores. Fluente em inglês e espanhol. Atualmente desenvolvendo um novo modelo para a expansão do universo, que promete revolucionar a compreensão da matéria escura. Contribuições significativas para a missão do telescópio espacial James Webb.",
                titulo: "A Influência dos Buracos Negros na Evolução das Galáxias e a Busca por Novas Físicas no Cosmos",
                redesSociais: "Instagram: @astrofulano, Twitter/X: @fulano_astro, LinkedIn: /in/fulanosilva",
                linkLattesLinkedin: "https://lattes.cnpq.br/9876543210987654 ou https://www.linkedin.com/in/fulanosilva",
                foto: "foto_fulano_perfil.jpg",
                carimbo: new Date().toLocaleString(),
                autorizacao: "Sim"
            };
            generateCadastroPDF(sampleData); // Gera a ficha de cadastro de exemplo
            showStatus('PDF de exemplo (Ficha de Cadastro com quebra de página) gerado com sucesso! 🎉', 'success');
        }

        async function generateAllPDFs() {
            if (xlsxData.length === 0) {
                showStatus('Carregue primeiro um arquivo XLSX!', 'error');
                return;
            }
            if (eventNameInput.value.trim() === '') {
                showStatus('Por favor, insira o nome do evento antes de gerar todos os PDFs.', 'error');
                return;
            }

            const progressSection = document.getElementById('progressSection');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');

            progressSection.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressText.textContent = `0/${xlsxData.length}`;

            const pdfs = [];
            for (let i = 0; i < xlsxData.length; i++) {
                const pdfData = generatePDF(xlsxData[i], i, xlsxData.length);
                pdfs.push(pdfData);

                const progress = ((i + 1) / xlsxData.length) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${i + 1}/${xlsxData.length}`;

                await new Promise(resolve => setTimeout(resolve, 50));
            }

            if (window.JSZip) {
                const zip = new JSZip();
                pdfs.forEach(pdf => {
                    zip.file(pdf.filename, pdf.blob);
                });

                const zipBlob = await zip.generateAsync({type: 'blob'});
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'termos_autorizacao.zip';
                a.click();
                URL.revokeObjectURL(url);
                showStatus(`${xlsxData.length} Termos de Autorização gerados e compactados em ZIP com sucesso! ✅`, 'success');
            } else {
                showStatus('JSZip não carregado, baixando Termos de Autorização individualmente.', 'info');
                for (const pdf of pdfs) {
                    const url = URL.createObjectURL(pdf.blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = pdf.filename;
                    a.click();
                    URL.revokeObjectURL(url);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                showStatus(`${xlsxData.length} Termos de Autorização gerados com sucesso! ✅`, 'success');
            }
            progressSection.classList.add('hidden');
        }

        async function generateAllCadastroPDFs() {
            if (xlsxData.length === 0) {
                showStatus('Carregue primeiro um arquivo XLSX!', 'error');
                return;
            }
            if (eventNameInput.value.trim() === '') {
                showStatus('Por favor, insira o nome do evento antes de gerar as fichas de cadastro.', 'error');
                return;
            }

            const progressSection = document.getElementById('progressSection');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');

            progressSection.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressText.textContent = `0/${xlsxData.length}`;

            const pdfs = [];
            for (let i = 0; i < xlsxData.length; i++) {
                const pdfData = generateCadastroPDF(xlsxData[i], i, xlsxData.length);
                pdfs.push(pdfData);

                const progress = ((i + 1) / xlsxData.length) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${i + 1}/${xlsxData.length}`;

                await new Promise(resolve => setTimeout(resolve, 50));
            }

            if (window.JSZip) {
                const zip = new JSZip();
                pdfs.forEach(pdf => {
                    zip.file(pdf.filename, pdf.blob);
                });

                const zipBlob = await zip.generateAsync({type: 'blob'});
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'fichas_cadastro.zip';
                a.click();
                URL.revokeObjectURL(url);
                showStatus(`${xlsxData.length} Fichas de Cadastro geradas e compactadas em ZIP com sucesso! ✅`, 'success');
            } else {
                showStatus('JSZip não carregado, baixando Fichas de Cadastro individualmente.', 'info');
                for (const pdf of pdfs) {
                    const url = URL.createObjectURL(pdf.blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = pdf.filename;
                    a.click();
                    URL.revokeObjectURL(url);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                showStatus(`${xlsxData.length} Fichas de Cadastro geradas com sucesso! ✅`, 'success');
            }
            progressSection.classList.add('hidden');
        }

        function showStatus(message, type = 'info') {
            const statusSection = document.getElementById('statusSection');
            if (statusTimeout) {
                clearTimeout(statusTimeout);
            }

            const colorClass = {
                'success': 'bg-green-100 border-green-400 text-green-700',
                'error': 'bg-red-100 border-red-400 text-red-700',
                'info': 'bg-blue-100 border-blue-400 text-blue-700'
            }[type] || 'bg-blue-100 border-blue-400 text-blue-700';

            const statusHTML = `
                <div class="border-l-4 p-4 ${colorClass} rounded">
                    <p class="font-medium">${message}</p>
                </div>
            `;

            statusSection.innerHTML = statusHTML;

            statusTimeout = setTimeout(() => {
                statusSection.innerHTML = '';
            }, 5000);
        }

        // Carrega o JSZip assincronamente (importante para compactar múltiplos PDFs)
        const scriptJSZip = document.createElement('script');
        scriptJSZip.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
        scriptJSZip.onload = () => console.log('JSZip carregado!');
        scriptJSZip.onerror = () => showStatus('Erro ao carregar JSZip. PDFs serão baixados individualmente.', 'error');
        document.head.appendChild(scriptJSZip);