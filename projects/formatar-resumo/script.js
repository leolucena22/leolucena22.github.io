function normalizarSecao(secao) {
    const equivalencias = {
        "objetivo": "Objetivos",
        "metodologia": "Metodologias",
        "metodologias": "Metodologias",
        "materiais e métodos": "Metodologias",
        "material e métodos": "Metodologias",
        "método": "Metodologias",  // Novo
        "métodos": "Metodologias",  // Novo
        "resultado": "Resultados",
        "relato de caso": "Relato",
        "relatos de caso": "Relato",
        "relato de experiência": "Relato",
        "relatos de experiência": "Relato",
        "conclusão": "Conclusão",
        "conclusões": "Conclusão"
    };
    return equivalencias[secao.toLowerCase()] || secao;
}

function formatarTexto() {
    let texto = document.getElementById("inputTexto").value;
    let tipoResumo = document.getElementById("tipoResumo").value;

    const estruturaPesquisa = ["Introdução", "Objetivos", "Metodologias", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Objetivos", "Relato", "Conclusão"];
    let estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    // Regex atualizada com "Método" e "Métodos"
    let regexTitulos = /(Introdução|Objetivo|Objetivos|Metodologia|Metodologias|Método|Métodos|Material\s*e\s*Métodos|Materiais\s*e\s*Métodos|Resultado|Resultados|Relato\s*de\s*Caso|Relatos\s*de\s*Caso|Relato\s*de\s*Experiência|Relatos\s*de\s*Experiência|Conclusão|Conclusões)\s*:/gi;
    
    let secoesPresentes = texto.match(regexTitulos);

    if (!secoesPresentes) {
        alert("Erro: O resumo não contém nenhuma seção identificada.");
        return;
    }

    // Normalização
    let secoesEncontradas = secoesPresentes.map(secao => {
        let secaoLimpa = secao.replace(/\s*:/, '').trim();
        return normalizarSecao(secaoLimpa);
    });

    // Verificação de estrutura
    secoesEncontradas = [...new Set(secoesEncontradas)];
    let secoesFaltantes = estruturaEsperada.filter(secao => !secoesEncontradas.includes(secao));

    if (secoesFaltantes.length > 0) {
        alert(`Erro: Seções faltantes: ${secoesFaltantes.join(", ")}`);
        return;
    }

    // Formatação
    let textoFormatado = texto.replace(regexTitulos, (match) => {
        return `<strong>${match.trim()}</strong>`;
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
