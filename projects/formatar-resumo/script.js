function normalizarSecao(secao) {
    const equivalencias = {
        "introducao": "Introdução",
        "introdução": "Introdução",
        "objetivo": "Objetivos",
        "objetivos": "Objetivos",
        "metodologia": "Metodologias",
        "metodologias": "Metodologias",
        "material e metodos": "Metodologias",
        "materiais e metodos": "Metodologias",
        "método": "Metodologias",
        "métodos": "Metodologias",
        "resultado": "Resultados",
        "resultados": "Resultados",
        "relato de caso": "Relato",
        "relatos de caso": "Relato",
        "conclusao": "Conclusão",
        "conclusão": "Conclusão",
        "conclusoes": "Conclusão",
        "conclusões": "Conclusão"
    };

    // Normalização avançada
    const normalized = secao
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9\s]/g, "") // Remove caracteres especiais
        .trim();
    
    return equivalencias[normalized] || capitalizeFirstLetter(secao.toLowerCase());
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatarTexto() {
    let texto = document.getElementById("inputTexto").value;
    let tipoResumo = document.getElementById("tipoResumo").value;

    const estruturaPesquisa = ["Introdução", "Objetivos", "Metodologias", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Objetivos", "Relato", "Conclusão"];
    let estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    // Padrão regex abrangente
    let regexTitulos = /(\bINTRODU[CÇ][AÃ]O|\bOBJETIVO|\bMETODOLOGIA|\bRESULTAD[OA]|\bCONCLUS[AÃ]O|\bM[EÉ]TODO|\bRELATO|\bINTRODUÇÃO|\bOBJETIVOS|\bMETODOLOGIAS|\bRESULTADOS|\bCONCLUSÕES)(\s*:)/gi;
    
    let secoesPresentes = texto.match(regexTitulos);

    if (!secoesPresentes) {
        alert("Erro: O resumo não contém nenhuma seção identificada.");
        return;
    }

    // Normalizar seções
    let secoesEncontradas = secoesPresentes.map(secao => {
        let secaoLimpa = secao.replace(/:\s*$/, '').trim();
        return normalizarSecao(secaoLimpa);
    });

    // Tratamento especial para Resultado/Resultados
    if (secoesEncontradas.includes("Resultado") && !secoesEncontradas.includes("Resultados")) {
        secoesEncontradas.push("Resultados");
    }
    secoesEncontradas = secoesEncontradas.filter(sec => sec !== "Resultado");
    
    // Remover duplicatas e verificar estrutura
    secoesEncontradas = [...new Set(secoesEncontradas)];
    let secoesFaltantes = estruturaEsperada.filter(secao => !secoesEncontradas.includes(secao));

    if (secoesFaltantes.length > 0) {
        alert(`Erro: Seções faltantes: ${secoesFaltantes.join(", ")}`);
        return;
    }

    // Formatar texto (converte para minúsculas com primeira letra maiúscula)
    let textoFormatado = texto.replace(regexTitulos, (match) => {
        const tituloFormatado = match.replace(/:\s*$/, '') // Remove os dois pontos
            .toLowerCase()
            .replace(/(^\w| [a-z])/g, letra => letra.toUpperCase());
        return `<strong>${tituloFormatado}:</strong>`;
    });

    document.getElementById("outputTexto").innerHTML = textoFormatado;
    document.getElementById("resultadoContainer").classList.remove("hidden");
}

function copiarTexto() {
    let outputDiv = document.getElementById("outputTexto");
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = outputDiv.innerHTML;

    // Adiciona a formatação de justificação no HTML copiado
    let formattedHTML = `<div style="text-align: justify;">${tempDiv.innerHTML}</div>`;

    navigator.clipboard.write([
        new ClipboardItem({
            "text/html": new Blob([formattedHTML], { type: "text/html" }),
            "text/plain": new Blob([tempDiv.textContent], { type: "text/plain" })
        })
    ]).then(() => {
        alert("✅ Texto copiado com justificação (se compatível)!");
    }).catch(() => {
        // Backup para copiar sem formatação caso o navegador não suporte
        const textarea = document.createElement("textarea");
        textarea.value = tempDiv.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("✅ Texto copiado (versão sem formatação)!");
    });
}
