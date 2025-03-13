function normalizarSecao(secao) {
    const equivalencias = {
        "objetivo": "Objetivos",
        "metodologia": "Metodologias",
        "metodologias": "Metodologias",
        "materiais e métodos": "Metodologias",
        "material e métodos": "Metodologias",
        "resultado": "Resultados",
        "relato de caso": "Relato",
        "relatos de caso": "Relato",
        "relato de experiência": "Relato",
        "relatos de experiência": "Relato",
        "conclusão": "Conclusão",
        "conclusões": "Conclusão"
    };
    return equivalencias[secao.toLowerCase()] || toTitleCase(secao);
}

function toTitleCase(str) {
    const lowerWords = ['e', 'de', 'da', 'do', 'das', 'dos', 'em', 'para', 'com'];
    return str.toLowerCase().split(' ')
        .map((word, index) => (index === 0 || !lowerWords.includes(word)) 
            ? word.charAt(0).toUpperCase() + word.slice(1) 
            : word)
        .join(' ');
}

function formatarTexto() {
    let texto = document.getElementById("inputTexto").value;
    let tipoResumo = document.getElementById("tipoResumo").value;

    const estruturaPesquisa = ["Introdução", "Objetivos", "Metodologias", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Objetivos", "Relato", "Conclusão"];
    let estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    // Regex atualizada com grupos capturadores
    let regexTitulos = /(\bIntrodução|\bObjetivo|\bObjetivos|\bMetodologia|\bMetodologias|\bMaterial\s+e\s+Métodos|\bMateriais\s+e\s+Métodos|\bResultado|\bResultados|\bRelato\s+de\s+Caso|\bRelatos\s+de\s+Caso|\bRelato\s+de\s+Experiência|\bRelatos\s+de\s+Experiência|\bConclusão|\bConclusões)(:)/gi;
    
    let secoesPresentes = texto.match(regexTitulos);

    if (!secoesPresentes) {
        alert("Erro: O resumo não contém nenhuma seção identificada.");
        return;
    }

    // Normalização para validação
    let secoesEncontradas = secoesPresentes.map(secao => {
        let secaoLimpa = secao.replace(":", "").trim();
        return normalizarSecao(secaoLimpa);
    });

    secoesEncontradas = [...new Set(secoesEncontradas)];
    let secoesFaltantes = estruturaEsperada.filter(secao => !secoesEncontradas.includes(secao));

    if (secoesFaltantes.length > 0) {
        alert(`Erro: Seu resumo está incompleto. As seguintes seções estão faltando: ${secoesFaltantes.join(", ")}`);
        return;
    }

    // Formatação com Capitalize Case
    let textoFormatado = texto.replace(regexTitulos, function(match, p1, p2) {
        return `<strong>${toTitleCase(p1)}${p2}</strong>`;
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
