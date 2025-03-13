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
        "relatos de experiência": "Relato"
    };
    return equivalencias[secao.toLowerCase()] || secao;
}

function formatarTexto() {
    let texto = document.getElementById("inputTexto").value;
    let tipoResumo = document.getElementById("tipoResumo").value;

    const estruturaPesquisa = ["Introdução", "Objetivos", "Metodologias", "Resultados", "Conclusão"];
    const estruturaRelato = ["Introdução", "Objetivos", "Relato", "Conclusão"];
    let estruturaEsperada = tipoResumo === "pesquisa" ? estruturaPesquisa : estruturaRelato;

    // Adicionei a flag 'i' para case-insensitive e ajustei os termos
    let regexTitulos = /(Introdução|Objetivo|Objetivos|Metodologia|Metodologias|Material e métodos|Materiais e métodos|Resultado|Resultados|Relato de caso|Relatos de caso|Relato de experiência|Relatos de experiência|Conclusão):/gi;
    let secoesPresentes = texto.match(regexTitulos);

    if (!secoesPresentes) {
        alert("Erro: O resumo não contém nenhuma seção identificada.");
        return;
    }

    // Normaliza as seções encontradas (tratamento case-insensitive)
    let secoesEncontradas = secoesPresentes.map(secao => {
        let secaoLimpa = secao.replace(":", "").trim();
        return normalizarSecao(secaoLimpa);
    });

    // Remove duplicatas (ex: múltiplas ocorrências de Metodologias)
    secoesEncontradas = [...new Set(secoesEncontradas)];

    let secoesFaltantes = estruturaEsperada.filter(secao => !secoesEncontradas.includes(secao));

    if (secoesFaltantes.length > 0) {
        alert(`Erro: Seu resumo está incompleto. As seguintes seções estão faltando: ${secoesFaltantes.join(", ")}`);
        return;
    }

    // Restante do código permanece igual...
    let textoFormatado = texto.replace(regexTitulos, function(match) {
        return `<strong>${match}</strong>`;
    });

    document.getElementById("outputTexto").innerHTML = textoFormatado;
    document.getElementById("resultadoContainer").classList.remove("hidden");
}

// As demais funções (copiarTexto) permanecem inalteradas

function copiarTexto() {
    let outputDiv = document.getElementById("outputTexto");

    let tempElement = document.createElement("div");
    tempElement.innerHTML = outputDiv.innerHTML;

    let elementos = tempElement.querySelectorAll("*");
    elementos.forEach(el => {
        el.removeAttribute("style");
        el.removeAttribute("class");
    });

    let blob = new Blob([tempElement.innerHTML], { type: "text/html" });
    let data = [new ClipboardItem({ "text/html": blob })];

    navigator.clipboard.write(data).then(() => {
        alert("✅ Texto formatado copiado com sucesso!");
    }).catch(err => {
        console.error("Erro ao copiar o texto:", err);
        alert("❌ Falha ao copiar o texto.");
    });
}