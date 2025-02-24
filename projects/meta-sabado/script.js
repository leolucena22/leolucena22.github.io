function calcularFolgas() {
    const evento = document.getElementById('evento').value.trim();
    const valorPainel = parseFloat(document.getElementById('valorPainel').value) || 0;
    const trabalhos = parseInt(document.getElementById('trabalhos').value) || 0;
    const inscritos = parseInt(document.getElementById('inscritos').value) || 0;

    // Cálculo do total de pontos
    const totalPontos = (trabalhos * 100) + inscritos + valorPainel;

    // Metas para ganhar sábados
    const meta1 = 25000;
    const meta2 = meta1 * 1.05; // +5%
    const meta3 = meta1 * 1.08; // +8%
    const meta4 = 30000; // Última meta fixa

    let folgas = 0;

    if (totalPontos >= meta1) folgas = 1;
    if (totalPontos >= meta2) folgas = 2;
    if (totalPontos >= meta3) folgas = 3;
    if (totalPontos >= meta4) folgas = 4;

    const resultadoBox = document.getElementById('resultado-box');
    const resultado = document.getElementById('resultado');
    const faltando1 = document.getElementById('faltando1');
    const faltando2 = document.getElementById('faltando2');
    const faltando3 = document.getElementById('faltando3');
    const faltando4 = document.getElementById('faltando4');

    resultadoBox.classList.remove("show"); // Reseta animação
    setTimeout(() => {
        resultadoBox.classList.add("show"); // Exibe a saída

        let eventoTexto = evento ? `para o evento <strong>*${evento}</strong>` : "para o evento";

        if (folgas > 0) {
            resultado.innerHTML = `🎉 Você ganhou <span class="font-bold">${folgas} sábado(s) de folga</span> ${eventoTexto}!`;
            resultado.classList.remove("text-red-600");
            resultado.classList.add("text-green-600");
        } else {
            resultado.innerHTML = `❌ <span class="font-bold">Meta não alcançada</span> ${eventoTexto}. Continue trabalhando!`;
            resultado.classList.remove("text-green-600");
            resultado.classList.add("text-red-600");
        }

        // Exibe os valores que faltam para cada nível de folga
        faltando1.innerHTML = `🔹 Faltam <span class="font-bold">R$${Math.max(0, meta1 - totalPontos).toLocaleString()}</span> para 1 sábado.`;
        faltando2.innerHTML = `🔹 Faltam <span class="font-bold">R$${Math.max(0, meta2 - totalPontos).toLocaleString()}</span> para 2 sábados.`;
        faltando3.innerHTML = `🔹 Faltam <span class="font-bold">R$${Math.max(0, meta3 - totalPontos).toLocaleString()}</span> para 3 sábados.`;
        faltando4.innerHTML = `🔹 Faltam <span class="font-bold">R$${Math.max(0, meta4 - totalPontos).toLocaleString()}</span> para 4 sábados.`;
        
    }, 100);
}