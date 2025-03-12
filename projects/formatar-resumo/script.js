function formatarTexto() {
    let texto = document.getElementById("inputTexto").value;
    let tipoResumo = document.getElementById("tipoResumo").value;

    // Estruturas esperadas (aceitando singular e plural)
    const estruturaPesquisa = ["Introdução", "Objetivos", "Metodologia", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Objetivo", "Relato de caso", "Relato de experiência", "Conclusão"];

    let estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    // Captura as seções presentes no texto
    let regexTituloss = /(Introdução|Objetivo|Objetivos|Metodologia|Metodologias|Resultados|Relato de caso|Relatos de caso|Relato de experiência|Relatos de experiência|Conclusão):/g;
    let secoesPresentes = texto.match(regexTituloss);

    if (!secoesPresentes) {
        alert("Erro: O resumo não contém nenhuma seção identificada.");
        return;
    }

    let secoesEncontradas = secoesPresentes.map(secao => secao.replace(":", "").trim());

    // Normaliza os nomes das seções para evitar erro de singular/plural
    const normalizarSecao = secao => secao
        .replace("Objetivo", "Objetivos")
        .replace("Metodologia", "Metodologias")
        .replace("Relato de caso", "Relatos de caso")
        .replace("Relato de experiência", "Relatos de experiência");

    let secoesFaltantes = estruturaEsperada.filter(secao => 
        !secoesEncontradas.map(normalizarSecao).includes(normalizarSecao(secao))
    );

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
    let textoFormatado = document.getElementById("outputTexto").innerText;
    navigator.clipboard.writeText(textoFormatado).then(() => {
        alert("✅ Texto copiado para a área de transferência!");
    });
}