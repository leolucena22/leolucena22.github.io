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

    const normalized = secao
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim();
    
    return equivalencias[normalized] || secao.charAt(0).toUpperCase() + secao.slice(1).toLowerCase();
}

function formatarTexto() {
    const texto = document.getElementById("inputTexto").value;
    const tipoResumo = document.getElementById("tipoResumo").value;

    const estruturaPesquisa = ["Introdução", "Objetivos", "Metodologias", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Objetivos", "Relato", "Conclusão"];
    const estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    const regexTitulos = /(\bINTRODU[CÇ][AÃ]O|\bOBJETIVO(S?)|\bMETODOLOGIA(S?)|\bRESULTAD[OA]S?|\bCONCLUS[AÃ]O(S?)|\bMATERIAIS?\sE\sM[EÉ]TODOS?|\bRELATO|\bM[EÉ]TODO(S?))(:\s*)/gi;

    const secoesPresentes = texto.match(regexTitulos) || [];

    if (secoesPresentes.length === 0) {
        alert("Erro: Nenhuma seção identificada no texto!");
        return;
    }

    let secoesEncontradas = secoesPresentes.map(secao => {
        const secaoLimpa = secao.replace(/:\s*$/, '').trim();
        return normalizarSecao(secaoLimpa);
    });

    // Conversões obrigatórias
    secoesEncontradas = secoesEncontradas.map(sec => {
        if (sec === "Objetivo") return "Objetivos";
        if (sec === "Resultado") return "Resultados";
        if (sec === "Metodologia") return "Metodologias";
        return sec;
    });

    secoesEncontradas = [...new Set(secoesEncontradas)];
    const secoesFaltantes = estruturaEsperada.filter(sec => !secoesEncontradas.includes(sec));
    
    if (secoesFaltantes.length > 0) {
        alert(`ERRO: Seções faltantes:\n${secoesFaltantes.join("\n")}`);
        return;
    }

    // Formatação com espaçamento correto
    const textoFormatado = texto.replace(regexTitulos, (match, p1) => {
        const titulo = p1
            .toLowerCase()
            .replace(/(^|:?\s+)(\w)/g, (_, espaco, letra) => espaco + letra.toUpperCase())
            .replace(/ De /g, " de ")
            .replace(/ E /g, " e ");
        
        return `<strong>${titulo}:</strong> `; // Espaço após os dois pontos
    });

    document.getElementById("outputTexto").innerHTML = textoFormatado;
    document.getElementById("resultadoContainer").classList.remove("hidden");
}

function copiarTexto() {
    const outputDiv = document.getElementById("outputTexto");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = outputDiv.innerHTML.replace(/<\/strong>/g, "</strong> "); // Garante espaçamento

    navigator.clipboard.write([
        new ClipboardItem({
            "text/html": new Blob([tempDiv.innerHTML], { type: "text/html" }),
            "text/plain": new Blob([tempDiv.textContent], { type: "text/plain" })
        })
    ]).then(() => {
        alert("✅ Texto copiado com formatação perfeita!");
    }).catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = tempDiv.textContent.replace(/(:\s*)/g, ": "); // Fallback
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("✅ Texto copiado (versão simplificada)");
    });
}