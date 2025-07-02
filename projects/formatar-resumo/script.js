// Mapeamento de termos similares
        const termMappings = {
        'metodologia': ['metodologia', 'material e métodos', 'materiais e métodos', 'método', 'métodos', 'material e método'],
        'objetivos': ['objetivos', 'objetivo'], // Já trata singular e plural
        'introdução': ['introdução', 'introducao'],
        'resultados': ['resultados', 'resultado'],
        'conclusão': ['conclusão', 'conclusao', 'considerações finais', 'consideracoes finais'],
        'relato de caso': ['relato de caso', 'relato de experiência', 'relato de experiencia', 'caso clínico', 'caso clinico'],
        'relato de experiência': ['relato de experiência', 'relato de experiencia', 'relato de caso']
        };


        // Estruturas padrão
        const estruturaCientifica = ['introdução', 'objetivos', 'metodologia', 'resultados', 'conclusão'];
        const estruturaRelato = ['introdução', 'objetivos', 'relato de caso', 'conclusão'];

        // Contador de palavras em tempo real
        document.getElementById('inputText').addEventListener('input', function() {
            updateWordCount();
        });

        function updateWordCount() {
            const text = document.getElementById('inputText').value;
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const chars = text.length;
            
            document.getElementById('wordCount').textContent = `Palavras: ${words} | Caracteres: ${chars}`;
        }

        function normalizeText(text) {
            // Converte maiúsculas para formato normal (primeira letra maiúscula)
            return text.split(' ').map(word => {
                if (word.length <= 3 && !['de', 'da', 'do', 'dos', 'das', 'e', 'ou'].includes(word.toLowerCase())) {
                    return word.toLowerCase();
                }
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
        }

        function identifyStructure(text) {
            const lowerText = text.toLowerCase();
            
            // Verifica se é relato de caso/experiência
            const relatoTerms = ['relato de caso', 'relato de experiência', 'relato de experiencia', 'caso clínico'];
            const isRelato = relatoTerms.some(term => lowerText.includes(term));
            
            return isRelato ? 'relato' : 'cientifico';
        }

        function extractSections(text) {
            const sections = {};
            
            // Primeira tentativa: usar regex para capturar seções com padrão mais flexível
            // Procura por palavras-chave seguidas de dois pontos e conteúdo até a próxima seção
            const sectionRegex = /\b(introdução|introducao|objetivos?|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|caso\s+clínico|caso\s+clinico):\s*(.*?)(?=\b(?:introdução|introducao|objetivos?|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|caso\s+clínico|caso\s+clinico):|$)/gis;
            
            let match;
            while ((match = sectionRegex.exec(text)) !== null) {
                const sectionName = match[1].toLowerCase().trim();
                let content = match[2].trim();
                
                // Remove quebras de linha extras e normaliza espaços
                content = content.replace(/\s+/g, ' ').trim();
                
                if (content && content.length > 5) {
                    sections[sectionName] = content;
                }
            }
            
            // Se não encontrou seções com regex, tenta método linha por linha
            if (Object.keys(sections).length === 0) {
                const lines = text.split('\n');
                let currentSection = '';
                let currentContent = '';
                
                for (let line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) continue;
                    
                    // Procura por títulos de seção (case insensitive)
                    const sectionMatch = trimmedLine.match(/^(introdução|introducao|objetivos?|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|caso\s+clínico|caso\s+clinico):\s*(.*)/i);
                    
                    if (sectionMatch) {
                        // Salva seção anterior se existir
                        if (currentSection && currentContent.trim()) {
                            sections[currentSection] = currentContent.trim();
                        }
                        
                        // Nova seção encontrada
                        currentSection = sectionMatch[1].toLowerCase().trim();
                        currentContent = sectionMatch[2] || '';
                    } else {
                        // Verifica se é apenas um título de seção (sem dois pontos ou conteúdo)
                        const titleMatch = trimmedLine.match(/^(introdução|introducao|objetivos?|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|caso\s+clínico|caso\s+clinico):?\s*$/i);
                        
                        if (titleMatch) {
                            // Salva seção anterior se existir
                            if (currentSection && currentContent.trim()) {
                                sections[currentSection] = currentContent.trim();
                            }
                            
                            // Nova seção (título apenas)
                            currentSection = titleMatch[1].toLowerCase().trim();
                            currentContent = '';
                        } else if (currentSection) {
                            // Adiciona conteúdo à seção atual
                            if (currentContent) currentContent += ' ';
                            currentContent += trimmedLine;
                        }
                    }
                }
                
                // Salva última seção
                if (currentSection && currentContent.trim()) {
                    sections[currentSection] = currentContent.trim();
                }
            }
            
            console.log('Seções encontradas:', sections);
            return sections;
        }

        function mapSectionName(sectionName) {
            const normalizedName = sectionName.toLowerCase().trim();
            
            for (let [standard, variants] of Object.entries(termMappings)) {
                if (variants.includes(normalizedName)) {
                    return standard;
                }
            }
            
            return normalizedName;
        }

        function formatResume() {
            const inputText = document.getElementById('inputText').value.trim();
            
            if (!inputText) {
                alert('Por favor, insira um texto para formatar.');
                return;
            }

            try {
                // Identifica estrutura
                const structureType = identifyStructure(inputText);
                const targetStructure = structureType === 'relato' ? estruturaRelato : estruturaCientifica;
                
                // Extrai seções
                const sections = extractSections(inputText);
                
                // Mapeia nomes das seções
                const mappedSections = {};
                for (let [key, value] of Object.entries(sections)) {
                    const mappedKey = mapSectionName(key);
                    mappedSections[mappedKey] = normalizeText(value);
                }
                
                // Constrói o resumo formatado em texto corrido
                let formattedText = '';
                const missingSections = [];
                
                for (let section of targetStructure) {
                    if (mappedSections[section]) {
                        const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
                        if (formattedText) formattedText += ' '; // Adiciona espaço entre seções
                        formattedText += `**${sectionTitle}:** ${mappedSections[section]}`;
                    } else {
                        missingSections.push(section);
                    }
                }
                
                // Adiciona seções extras encontradas
                for (let [key, value] of Object.entries(mappedSections)) {
                    if (!targetStructure.includes(key)) {
                        const sectionTitle = key.charAt(0).toUpperCase() + key.slice(1);
                        if (formattedText) formattedText += ' '; // Adiciona espaço entre seções
                        formattedText += `**${sectionTitle}:** ${value}`;
                    }
                }
                
                // Exibe resultado em texto corrido
                const outputDiv = document.getElementById('outputText');
                outputDiv.innerHTML = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                // Atualiza contadores e status
                const wordCount = formattedText.split(/\s+/).filter(word => word.trim()).length;
                document.getElementById('formattedWordCount').textContent = `Palavras formatadas: ${wordCount}`;
                
                let status = '';
                if (wordCount < 250) {
                    status = '⚠️ Abaixo do mínimo (250 palavras)';
                } else if (wordCount > 350) {
                    status = '⚠️ Acima do máximo (350 palavras)';
                } else {
                    status = '✅ Dentro do limite ideal';
                }
                
                if (missingSections.length > 0) {
                    status += ` | Seções faltantes: ${missingSections.join(', ')}`;
                }
                
                document.getElementById('statusIndicator').textContent = `Status: ${status}`;
                
                // Animação de sucesso
                outputDiv.classList.add('fade-in');
                
            } catch (error) {
                alert('Erro na formatação. Verifique se o texto está estruturado corretamente.');
                console.error(error);
            }
        }

function copyToClipboard() {
            const outputDiv = document.getElementById('outputText');
            const outputHTML = outputDiv.innerHTML; // Pegamos o innerHTML

            if (!outputHTML || outputHTML.includes('O resumo formatado aparecerá aqui')) {
                alert('Nenhum texto formatado para copiar.');
                return;
            }

            // Criar um elemento temporário para copiar o HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = outputHTML; // Atribuir o HTML completo
            document.body.appendChild(tempDiv); // Anexar ao body para que possa ser selecionado

            // Criar um range e selecioná-lo
            const range = document.createRange();
            range.selectNodeContents(tempDiv);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            try {
                // Tentar copiar o conteúdo selecionado
                document.execCommand('copy');
                
                const btn = document.getElementById('copyBtn');
                const originalText = btn.textContent;
                btn.textContent = '✅ Copiado!';
                btn.classList.remove('bg-emerald-600');
                btn.classList.add('bg-emerald-700');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('bg-emerald-700');
                    btn.classList.add('bg-emerald-600');
                }, 2000);

            } catch (err) {
                console.error('Erro ao copiar HTML: ', err);
                // Fallback para navegadores que não suportam document.execCommand para HTML
                // Ou para casos onde a cópia falha (por exemplo, permissões)
                // Neste caso, ainda podemos tentar copiar como texto puro
                navigator.clipboard.writeText(outputDiv.innerText).then(() => {
                    alert('Copiado como texto simples (formatação pode ser perdida).');
                }).catch(() => {
                    alert('Erro ao copiar. Tente selecionar o texto manualmente.');
                });
            } finally {
                // Remover o elemento temporário
                document.body.removeChild(tempDiv);
                selection.removeAllRanges(); // Limpar a seleção
            }
        }

        function clearAll() {
            document.getElementById('inputText').value = '';
            document.getElementById('outputText').innerHTML = '<div class="text-slate-400 text-center italic">O resumo formatado aparecerá aqui...</div>';
            document.getElementById('wordCount').textContent = 'Palavras: 0 | Caracteres: 0';
            document.getElementById('formattedWordCount').textContent = 'Palavras formatadas: 0';
            document.getElementById('statusIndicator').textContent = 'Status: Aguardando texto';
        }

        // Exemplo de uso ao carregar a página
        window.addEventListener('load', function() {
            // Adiciona exemplo se necessário
            const example = `INTRODUÇÃO: A diabetes mellitus é uma condição crônica que afeta milhões de pessoas no mundo.
OBJETIVOS: Avaliar a eficácia de um novo protocolo de tratamento.
METODOLOGIA: Estudo randomizado controlado com 100 participantes.
RESULTADOS: Houve redução significativa da glicemia em 85% dos casos.
CONCLUSÃO: O protocolo mostrou-se eficaz no controle glicêmico.`;
            
            // Descomente a linha abaixo para carregar exemplo automaticamente
            // document.getElementById('inputText').value = example;
        });
