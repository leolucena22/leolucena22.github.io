function formatarTexto() {
    let texto = document.getElementById("inputTexto").value;
    let tipoResumo = document.getElementById("tipoResumo").value;

    // Estruturas esperadas (aceitando singular e plural)
    const estruturaPesquisa = ["Introdução", "Objetivos", "Metodologia", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Objetivo", "Relato de caso", "Relato de experiência", "Conclusão"];

    let estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    // Mapeamento para normalização (singular/plural equivalentes)
    const equivalencias = {
        "Objetivo": "Objetivos",
        "Objetivos": "Objetivos",
        "Metodologia": "Metodologia",
        "Metodologias": "Metodologia",
        "Relato de caso": "Relato de caso",
        "Relatos de caso": "Relato de caso",
        "Relato de experiência": "Relato de experiência",
        "Relatos de experiência": "Relato de experiência",
    };

    // Captura as seções presentes no texto
    let regexTituloss = /(Introdução|Objetivo|Objetivos|Metodologia|Metodologias|Resultados|Relato de caso|Relatos de caso|Relato de experiência|Relatos de experiência|Conclusão):/g;
    let secoesPresentes = texto.match(regexTituloss);

    if (!secoesPresentes) {
        alert("Erro: O resumo não contém nenhuma seção identificada.");
        return;
    }

    let secoesEncontradas = secoesPresentes.map(secao => secao.replace(":", "").trim());

    // Normalizar seções encontradas para o formato esperado (mapeando singular/plural)
    let secoesNormalizadas = secoesEncontradas.map(secao => equivalencias[secao] || secao);

    // Verificar quais seções estão faltando
    let secoesFaltantes = estruturaEsperada.filter(secao => !secoesNormalizadas.includes(secao));

    if (secoesFaltantes.length > 0) {
        alert("Erro: Seu resumo está incompleto. As seguintes seções estão faltando: " + secoesFaltantes.join(", "));
        return;
    }

    // Formata os títulos e coloca em negrito mantendo a forma original
    let textoFormatado = texto.replace(regexTituloss, function(match) {
        return `<strong>${match}</strong>`;
    });

    // Exibir texto formatado
    let outputDiv = document.getElementById("outputTexto");
    outputDiv.innerHTML = textoFormatado;
    outputDiv.style.textAlign = "justify"; // Justificar texto

    // Mostrar a saída formatada
    document.getElementById("resultadoContainer").classList.remove("hidden");
}

function copiarTexto() {
    let outputDiv = document.getElementById("outputTexto");

    // Criar um elemento temporário para copiar
    let tempElement = document.createElement("div");
    tempElement.innerHTML = outputDiv.innerHTML;

    // Remover estilos inline e classes desnecessárias
    let elementos = tempElement.querySelectorAll("*");
    elementos.forEach(el => {
        el.removeAttribute("style");
        el.removeAttribute("class");
    });

    // Criar um Blob (formato HTML) e copiar corretamente
    let blob = new Blob([tempElement.innerHTML], { type: "text/html" });
    let data = [new ClipboardItem({ "text/html": blob })];

    navigator.clipboard.write(data).then(() => {
        alert("✅ Texto formatado copiado com sucesso!");
    }).catch(err => {
        console.error("Erro ao copiar o texto:", err);
        alert("❌ Falha ao copiar o texto.");
    });
}
