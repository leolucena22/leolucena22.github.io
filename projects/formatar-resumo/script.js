function formatarTexto() {
    let texto = document.getElementById("inputTexto").value;
    
    // Expressão regular para identificar títulos e colocar em negrito
    let textoFormatado = texto.replace(/(Introdução|Objetivo|Materiais e Métodos|Resultados|Conclusão):/g, function(match) {
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
        alert("Texto copiado para a área de transferência!");
    });
}