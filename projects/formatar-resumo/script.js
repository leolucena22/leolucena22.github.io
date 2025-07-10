// Mapeamento de termos expandido - mantém capitalização original
const termMappings = {
    'introdução': ['introdução', 'introducao', 'introdução:', 'introducao:'],
    'objetivos': ['objetivos', 'objetivo', 'objetivos:', 'objetivo:'],
    'metodologia': ['metodologia', 'material e métodos', 'materiais e métodos', 'métodos', 'método', 'metodologia:', 'material e métodos:', 'materiais e métodos:', 'métodos:', 'método:'],
    'resultados': ['resultados', 'resultado', 'resultados:', 'resultado:'],
    'conclusão': ['conclusão', 'conclusao', 'considerações finais', 'consideracoes finais', 'conclusão:', 'conclusao:', 'considerações finais:', 'consideracoes finais:'],
    'relato de caso': ['relato de caso', 'caso clínico', 'caso clinico', 'descrição do caso', 'descricao do caso', 'relato de caso:', 'caso clínico:', 'caso clinico:', 'descrição do caso:', 'descricao do caso:'],
    'relato de experiência': ['relato de experiência', 'relato de experiencia', 'descrição da experiência', 'descricao da experiencia', 'desenvolvimento da experiência', 'desenvolvimento da experiencia', 'relato de experiência:', 'relato de experiencia:', 'descrição da experiência:', 'descricao da experiencia:', 'desenvolvimento da experiência:', 'desenvolvimento da experiencia:']
};

// Estruturas específicas para cada tipo
const estruturaCientifica = ['introdução', 'objetivos', 'metodologia', 'resultados', 'conclusão'];
const estruturaRelatoCaso = ['introdução', 'objetivos', 'relato de caso', 'conclusão'];
const estruturaRelatoExperiencia = ['introdução', 'objetivos', 'relato de experiência', 'conclusão'];

// Função melhorada para identificar estrutura
function identifyStructure(text) {
    const lowerText = text.toLowerCase();
    
    // Verifica se há seção específica "relato de caso"
    const hasRelatoCasoSection = /\b(relato\s+de\s+caso|caso\s+clínico|caso\s+clinico|descrição\s+do\s+caso|descricao\s+do\s+caso):/i.test(text);
    
    // Verifica se há seção específica "relato de experiência"
    const hasRelatoExperienciaSection = /\b(relato\s+de\s+experiência|relato\s+de\s+experiencia|descrição\s+da\s+experiência|descricao\s+da\s+experiencia|desenvolvimento\s+da\s+experiência|desenvolvimento\s+da\s+experiencia):/i.test(text);
    
    // Verifica menções no texto (para casos onde não há seção específica mas é mencionado)
    const mentionsRelatoCaso = /\b(relato\s+de\s+caso|caso\s+clínico|caso\s+clinico)\b/i.test(text);
    const mentionsRelatoExperiencia = /\b(relato\s+de\s+experiência|relato\s+de\s+experiencia)\b/i.test(text);
    
    // Prioriza seções específicas
    if (hasRelatoCasoSection) return 'relato_caso';
    if (hasRelatoExperienciaSection) return 'relato_experiencia';
    
    // Se não há seções específicas, usa menções no texto
    if (mentionsRelatoCaso && !mentionsRelatoExperiencia) return 'relato_caso';
    if (mentionsRelatoExperiencia && !mentionsRelatoCaso) return 'relato_experiencia';
    
    // Se menciona ambos ou nenhum, verifica qual estrutura o texto segue
    if (mentionsRelatoCaso && mentionsRelatoExperiencia) {
        // Se menciona ambos, verifica qual seção está presente
        if (lowerText.includes('metodologia') || lowerText.includes('material e método')) {
            return 'relato_experiencia'; // Relato de experiência usa metodologia
        }
        return 'relato_caso'; // Default para relato de caso
    }
    
    return 'cientifico'; // Estrutura científica padrão
}

// Função expandida para extração de seções - MANTÉM CAPITALIZAÇÃO ORIGINAL
function extractSections(text) {
    const sections = {};
    
    // Regex expandida para incluir todos os tipos de seção
    const sectionRegex = /\b(introdução|introducao|objetivos?|objetivo|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|método|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|caso\s+clínico|caso\s+clinico|descrição\s+do\s+caso|descricao\s+do\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|descrição\s+da\s+experiência|descricao\s+da\s+experiencia|desenvolvimento\s+da\s+experiência|desenvolvimento\s+da\s+experiencia):\s*(.*?)(?=\b(?:introdução|introducao|objetivos?|objetivo|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|método|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|caso\s+clínico|caso\s+clinico|descrição\s+do\s+caso|descricao\s+do\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|descrição\s+da\s+experiência|descricao\s+da\s+experiencia|desenvolvimento\s+da\s+experiência|desenvolvimento\s+da\s+experiencia):|$)/gis;
    
    let match;
    while ((match = sectionRegex.exec(text)) !== null) {
        const sectionName = match[1].toLowerCase().trim();
        let content = match[2].trim();
        
        // Remove quebras de linha extras mas mantém a formatação original
        content = content.replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').trim();
        
        if (content && content.length > 5) {
            sections[sectionName] = content; // MANTÉM O CONTEÚDO ORIGINAL
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
            
            // Procura por títulos de seção (case insensitive) - regex expandida
            const sectionMatch = trimmedLine.match(/^(introdução|introducao|objetivos?|objetivo|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|método|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|caso\s+clínico|caso\s+clinico|descrição\s+do\s+caso|descricao\s+do\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|descrição\s+da\s+experiência|descricao\s+da\s+experiencia|desenvolvimento\s+da\s+experiência|desenvolvimento\s+da\s+experiencia):\s*(.*)/i);
            
            if (sectionMatch) {
                // Salva seção anterior se existir
                if (currentSection && currentContent.trim()) {
                    sections[currentSection] = currentContent.trim(); // MANTÉM O CONTEÚDO ORIGINAL
                }
                
                // Nova seção encontrada
                currentSection = sectionMatch[1].toLowerCase().trim();
                currentContent = sectionMatch[2] || '';
            } else {
                // Verifica se é apenas um título de seção (sem dois pontos ou conteúdo)
                const titleMatch = trimmedLine.match(/^(introdução|introducao|objetivos?|objetivo|metodologia|material\s+e\s+métodos?|materiais\s+e\s+métodos?|métodos?|método|resultados?|conclusão|conclusao|considerações\s+finais|consideracoes\s+finais|relato\s+de\s+caso|caso\s+clínico|caso\s+clinico|descrição\s+do\s+caso|descricao\s+do\s+caso|relato\s+de\s+experiência|relato\s+de\s+experiencia|descrição\s+da\s+experiência|descricao\s+da\s+experiencia|desenvolvimento\s+da\s+experiência|desenvolvimento\s+da\s+experiencia):?\s*$/i);
                
                if (titleMatch) {
                    // Salva seção anterior se existir
                    if (currentSection && currentContent.trim()) {
                        sections[currentSection] = currentContent.trim(); // MANTÉM O CONTEÚDO ORIGINAL
                    }
                    
                    // Nova seção (título apenas)
                    currentSection = titleMatch[1].toLowerCase().trim();
                    currentContent = '';
                } else if (currentSection) {
                    // Adiciona conteúdo à seção atual MANTENDO FORMATAÇÃO ORIGINAL
                    if (currentContent) currentContent += ' ';
                    currentContent += trimmedLine; // MANTÉM O TEXTO ORIGINAL
                }
            }
        }
        
        // Salva última seção
        if (currentSection && currentContent.trim()) {
            sections[currentSection] = currentContent.trim(); // MANTÉM O CONTEÚDO ORIGINAL
        }
    }
    
    console.log('Seções encontradas:', sections);
    return sections;
}

// Função de mapeamento expandida
function mapSectionName(sectionName) {
    const normalizedName = sectionName.toLowerCase().trim();
    
    for (let [standard, variants] of Object.entries(termMappings)) {
        if (variants.includes(normalizedName)) {
            return standard;
        }
    }
    
    return normalizedName;
}

// Função principal - MANTÉM CAPITALIZAÇÃO ORIGINAL
function formatResume() {
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        alert('Por favor, insira um texto para formatar.');
        return;
    }

    try {
        // Identifica estrutura específica
        const structureType = identifyStructure(inputText);
        
        // Seleciona estrutura apropriada
        let targetStructure;
        let structureLabel;
        
        switch(structureType) {
            case 'relato_caso':
                targetStructure = estruturaRelatoCaso;
                structureLabel = 'Relato de Caso';
                break;
            case 'relato_experiencia':
                targetStructure = estruturaRelatoExperiencia;
                structureLabel = 'Relato de Experiência';
                break;
            default:
                targetStructure = estruturaCientifica;
                structureLabel = 'Artigo Científico';
        }
        
        console.log(`Estrutura identificada: ${structureLabel}`, targetStructure);
        
        // Extrai seções
        const sections = extractSections(inputText);
        
        // Mapeia nomes das seções - MANTÉM CONTEÚDO ORIGINAL
        const mappedSections = {};
        for (let [key, value] of Object.entries(sections)) {
            const mappedKey = mapSectionName(key);
            mappedSections[mappedKey] = value; // MANTÉM O CONTEÚDO ORIGINAL SEM ALTERAÇÕES
        }
        
        console.log('Seções mapeadas:', mappedSections);
        
        // Constrói o resumo formatado
        let formattedText = '';
        const missingSections = [];
        
        for (let section of targetStructure) {
            // Verifica se a seção existe diretamente ou se é "objetivos" e existe "objetivo"
            let sectionContent = null;
            
            if (mappedSections[section]) {
                sectionContent = mappedSections[section];
            } else if (section === 'objetivos' && mappedSections['objetivo']) {
                sectionContent = mappedSections['objetivo'];
            }
            
            if (sectionContent) {
                if (formattedText) formattedText += ' ';
                // MANTÉM A CAPITALIZAÇÃO ORIGINAL DO TÍTULO DA SEÇÃO
                const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
                formattedText += `**${sectionTitle}:** ${sectionContent}`; // CONTEÚDO MANTÉM FORMATAÇÃO ORIGINAL
            } else {
                missingSections.push(section);
            }
        }
        
        // Adiciona seções extras encontradas que não estão na estrutura padrão
        for (let [key, value] of Object.entries(mappedSections)) {
            // Evita duplicar "objetivo" se já foi incluído como "objetivos"
            if (!targetStructure.includes(key) && !(key === 'objetivo' && targetStructure.includes('objetivos'))) {
                if (formattedText) formattedText += ' ';
                // MANTÉM A CAPITALIZAÇÃO ORIGINAL DO TÍTULO DA SEÇÃO
                const sectionTitle = key.charAt(0).toUpperCase() + key.slice(1);
                formattedText += `**${sectionTitle}:** ${value}`; // CONTEÚDO MANTÉM FORMATAÇÃO ORIGINAL
            }
        }
        
        // Exibe resultado
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
        
        // Adiciona informação sobre a estrutura identificada
        status += ` | Estrutura: ${structureLabel}`;
        
        document.getElementById('statusIndicator').textContent = `Status: ${status}`;
        
        // Animação de sucesso
        outputDiv.classList.add('fade-in');
        
    } catch (error) {
        alert('Erro na formatação. Verifique se o texto está estruturado corretamente.');
        console.error(error);
    }
}

function updateWordCount() {
    const text = document.getElementById('inputText').value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    document.getElementById('wordCount').textContent = `Palavras: ${words} | Caracteres: ${chars}`;
}

function copyToClipboard() {
    const outputDiv = document.getElementById('outputText');
    const outputHTML = outputDiv.innerHTML;

    if (!outputHTML || outputHTML.includes('O resumo formatado aparecerá aqui')) {
        alert('Nenhum texto formatado para copiar.');
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = outputHTML;
    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
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
        navigator.clipboard.writeText(outputDiv.innerText).then(() => {
            alert('Copiado como texto simples (formatação pode ser perdida).');
        }).catch(() => {
            alert('Erro ao copiar. Tente selecionar o texto manualmente.');
        });
    } finally {
        document.body.removeChild(tempDiv);
        selection.removeAllRanges();
    }
}

function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').innerHTML = '<div class="text-slate-400 text-center italic">O resumo formatado aparecerá aqui...</div>';
    document.getElementById('wordCount').textContent = 'Palavras: 0 | Caracteres: 0';
    document.getElementById('formattedWordCount').textContent = 'Palavras formatadas: 0';
    document.getElementById('statusIndicator').textContent = 'Status: Aguardando texto';
}

// Event listeners
document.getElementById('inputText').addEventListener('input', function() {
    updateWordCount();
});