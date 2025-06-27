function normalizarSecao(secao) {
    const equivalencias = {
        "introducao": "Introdução",
        "introdução": "Introdução",
        "objetivo": "Objetivo",
        "objetivos": "Objetivos",
        "metodologia": "Metodologia",
        "metodologias": "Metodologia",
        "material e metodos": "Material e Métodos",
        "material e métodos": "Material e Métodos",
        "material e metodo": "Material e Método",
        "material e método": "Material e Método",
        "materiais e metodos": "Materiais e Métodos",
        "materiais e métodos": "Materiais e Métodos",
        "metodo": "Método",
        "método": "Método",
        "metodos": "Métodos",
        "métodos": "Métodos",
        "resultado": "Resultados",
        "resultados": "Resultados",
        "relato de caso": "Relato",
        "relatos de caso": "Relato",
        "relato de experiencia": "Relato",
        "relato de experiência": "Relato",
        "relatos de experiencia": "Relato",
        "relatos de experiência": "Relato",
        "conclusao": "Conclusão",
        "conclusão": "Conclusão",
        "conclusoes": "Conclusão",
        "conclusões": "Conclusão"
    };

    // Normalizar texto: remover acentos, converter para minúsculo, remover caracteres especiais
    const normalized = secao
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim();
    
    return equivalencias[normalized] || null;
}

function mostrarErro(mensagem) {
    // Remove alertas anteriores se existirem
    const alertaAnterior = document.querySelector('.alerta-erro');
    if (alertaAnterior) {
        alertaAnterior.remove();
    }
    
    // Criar div de erro
    const divErro = document.createElement('div');
    divErro.className = 'alerta-erro bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4';
    divErro.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div>
                <strong>Erro:</strong><br>
                ${mensagem.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
    
    // Inserir após o botão de formatar
    const botaoFormatar = document.querySelector('button[onclick="formatarTexto()"]');
    botaoFormatar.parentNode.insertBefore(divErro, botaoFormatar.nextSibling);
    
    // Remover após 8 segundos
    setTimeout(() => {
        if (divErro.parentNode) {
            divErro.remove();
        }
    }, 8000);
}

function mostrarSucesso(mensagem) {
    // Remove alertas anteriores se existirem
    const alertaAnterior = document.querySelector('.alerta-sucesso');
    if (alertaAnterior) {
        alertaAnterior.remove();
    }
    
    // Criar div de sucesso
    const divSucesso = document.createElement('div');
    divSucesso.className = 'alerta-sucesso bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4';
    divSucesso.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>${mensagem}</span>
        </div>
    `;
    
    // Inserir no início do resultado
    const resultadoContainer = document.getElementById('resultadoContainer');
    resultadoContainer.insertBefore(divSucesso, resultadoContainer.firstChild);
    
    // Remover após 4 segundos
    setTimeout(() => {
        if (divSucesso.parentNode) {
            divSucesso.remove();
        }
    }, 4000);
}

function formatarTexto() {
    // Remove alertas anteriores
    const alertas = document.querySelectorAll('.alerta-erro, .alerta-sucesso');
    alertas.forEach(alerta => alerta.remove());

    const texto = document.getElementById("inputTexto").value.trim();
    const tipoResumo = document.getElementById("tipoResumo").value;

    if (!texto) {
        mostrarErro("Por favor, insira um texto para formatar.");
        return;
    }

    // Estruturas esperadas - agora aceita todas as variações
    const estruturaPesquisa = ["Introdução", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Relato", "Conclusão"];
    // Adiciona objetivo/objetivos e metodologia dependendo do que foi encontrado
    const estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    // Regex mais abrangente para capturar títulos de seções
    const regexTitulos = /(\b(?:INTRODU[CÇ][AÃ]O|OBJETIVO[S]?|METODOLOGIA[S]?|MATERIAL(?:IS)?\s+E\s+M[EÉ]TODO[S]?|M[EÉ]TODO[S]?|RESULTADO[S]?|RELATO[S]?\s+DE\s+(?:CASO|EXPERIÊNCIA)|CONCLUS[AÃ]O|CONCLUS[OÕ]ES))(\s*:?\s*)/gi;

    // Encontrar todas as seções no texto
    const matches = [...texto.matchAll(regexTitulos)];
    
    if (matches.length === 0) {
        mostrarErro("Nenhuma seção foi identificada no texto.\n\nCertifique-se de que as seções estão claramente marcadas:\n• INTRODUÇÃO:\n• OBJETIVOS:\n• METODOLOGIA: (ou MATERIAL E MÉTODOS:)\n• RESULTADOS:\n• CONCLUSÃO:");
        return;
    }

    // Normalizar seções encontradas
    let secoesEncontradas = [];
    for (let match of matches) {
        const secaoOriginal = match[1].trim();
        const secaoNormalizada = normalizarSecao(secaoOriginal);
        if (secaoNormalizada && !secoesEncontradas.includes(secaoNormalizada)) {
            secoesEncontradas.push(secaoNormalizada);
        }
    }

    // Ajustar para estrutura esperada - mantém o original e agrupa metodologias
    if (tipoResumo === "relato") {
        // Para relato, metodologias vira "Relato"
        secoesEncontradas = secoesEncontradas.map(sec => {
            if (sec === "Metodologia" || sec === "Material e Métodos" || sec === "Material e Método" || 
                sec === "Materiais e Métodos" || sec === "Método" || sec === "Métodos" || sec === "Resultados") {
                return "Relato";
            }
            return sec;
        });
    }

    // Remover duplicatas
    secoesEncontradas = [...new Set(secoesEncontradas)];

    // Verificar seções faltantes - incluindo objetivos e metodologia na validação
    const temObjetivo = secoesEncontradas.includes("Objetivo");
    const temObjetivos = secoesEncontradas.includes("Objetivos");
    const temMetodologia = secoesEncontradas.includes("Metodologia");
    const temMaterialMetodos = secoesEncontradas.includes("Material e Métodos");
    const temMaterialMetodo = secoesEncontradas.includes("Material e Método");
    const temMateriaisMetodos = secoesEncontradas.includes("Materiais e Métodos");
    const temMetodo = secoesEncontradas.includes("Método");
    const temMetodos = secoesEncontradas.includes("Métodos");
    
    // Adicionar objetivo/objetivos à estrutura esperada baseado no que foi encontrado
    if (temObjetivo) {
        estruturaEsperada.splice(1, 0, "Objetivo");
    } else if (temObjetivos) {
        estruturaEsperada.splice(1, 0, "Objetivos");
    } else {
        // Se não tem nenhum, adiciona baseado no tipo
        estruturaEsperada.splice(1, 0, tipoResumo === "pesquisa" ? "Objetivos" : "Objetivo");
    }
    
    // Para pesquisa, adicionar metodologia baseado no que foi encontrado
    if (tipoResumo === "pesquisa") {
        if (temMetodologia) {
            estruturaEsperada.splice(2, 0, "Metodologia");
        } else if (temMaterialMetodos) {
            estruturaEsperada.splice(2, 0, "Material e Métodos");
        } else if (temMaterialMetodo) {
            estruturaEsperada.splice(2, 0, "Material e Método");
        } else if (temMateriaisMetodos) {
            estruturaEsperada.splice(2, 0, "Materiais e Métodos");
        } else if (temMetodo) {
            estruturaEsperada.splice(2, 0, "Método");
        } else if (temMetodos) {
            estruturaEsperada.splice(2, 0, "Métodos");
        } else {
            // Se não tem nenhum, adiciona "Metodologia" como padrão
            estruturaEsperada.splice(2, 0, "Metodologia");
        }
    }
    
    const secoesFaltantes = estruturaEsperada.filter(sec => !secoesEncontradas.includes(sec));
    
    if (secoesFaltantes.length > 0) {
        const tipoTexto = tipoResumo === "pesquisa" ? "Pesquisa" : "Relato de Caso/Experiência";
        mostrarErro(`Seções faltantes para o tipo "${tipoTexto}":\n• ${secoesFaltantes.join("\n• ")}\n\nEstrutura esperada:\n• ${estruturaEsperada.join("\n• ")}`);
        return;
    }

    // Formatar o texto - mantém formato original de todas as seções
    let textoFormatado = texto.replace(regexTitulos, (match, secao, separador) => {
        const secaoNormalizada = normalizarSecao(secao.trim());
        let tituloFormatado;
        
        if (secaoNormalizada) {
            if (tipoResumo === "relato" && 
                (secaoNormalizada === "Metodologia" || secaoNormalizada === "Material e Métodos" || 
                 secaoNormalizada === "Material e Método" || secaoNormalizada === "Materiais e Métodos" || 
                 secaoNormalizada === "Método" || secaoNormalizada === "Métodos" || secaoNormalizada === "Resultados")) {
                tituloFormatado = "Relato";
            } else {
                // Mantém o formato original encontrado
                tituloFormatado = secaoNormalizada;
            }
        } else {
            // Manter formatação original se não conseguir normalizar
            tituloFormatado = secao.charAt(0).toUpperCase() + secao.slice(1).toLowerCase();
        }
        
        return `<strong>${tituloFormatado}:</strong> `;
    });

    // Mostrar resultado
    document.getElementById("outputTexto").innerHTML = textoFormatado;
    document.getElementById("resultadoContainer").classList.remove("hidden");
    
    // Scroll suave para o resultado
    document.getElementById("resultadoContainer").scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    mostrarSucesso("✅ Texto formatado com sucesso!");
}

function copiarTexto() {
    const outputDiv = document.getElementById("outputTexto");
    
    // Criar versão temporária
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = outputDiv.innerHTML;

    // Tentar copiar como HTML e texto
    if (navigator.clipboard && navigator.clipboard.write) {
        navigator.clipboard.write([
            new ClipboardItem({
                "text/html": new Blob([tempDiv.innerHTML], { type: "text/html" }),
                "text/plain": new Blob([tempDiv.textContent], { type: "text/plain" })
            })
        ]).then(() => {
            mostrarSucesso("✅ Texto formatado copiado para a área de transferência!");
        }).catch(() => {
            copiarTextoFallback(tempDiv.textContent);
        });
    } else {
        copiarTextoFallback(tempDiv.textContent);
    }
}

function copiarTextoFallback(texto) {
    const textarea = document.createElement("textarea");
    textarea.value = texto;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand("copy");
        mostrarSucesso("✅ Texto copiado (formato simples)");
    } catch (err) {
        mostrarErro("Erro ao copiar texto. Selecione manualmente o texto formatado.");
    }
    
    document.body.removeChild(textarea);
}