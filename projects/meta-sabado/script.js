function formatarMoeda(campo) {
    let valor = campo.value.replace(/\D/g, "");
    valor = (parseFloat(valor) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    campo.value = valor;
}

function calcularFolgas() {
    const evento = document.getElementById('evento').value.trim();
    let valorPainel = document.getElementById('valorPainel').value;
    const trabalhos = parseInt(document.getElementById('trabalhos').value) || 0;
    const inscritos = parseInt(document.getElementById('inscritos').value) || 0;

    valorPainel = parseFloat(valorPainel.replace(/[^\d,]/g, "").replace(",", ".") || 0);

    const valorBase = (trabalhos * 100) + inscritos;

    const meta1 = 25000;
    const meta2 = 28000;
    const meta3 = 28000;
    const meta4 = 30000;

    const alvo1 = valorBase;
    const alvo2 = valorBase * 1.05;
    const alvo3 = valorBase * 1.08;
    const alvo4 = valorBase * 1.10;

    let folgas = 0;

    if (valorBase > meta1 && valorPainel > alvo1) folgas = 1;
    if (valorBase > meta2 && valorPainel > alvo2) folgas = 2;
    if (valorBase > meta3 && valorPainel > alvo3) folgas = 3;
    if (valorBase > meta4 && valorPainel > alvo4) folgas = 4;

    const resultadoBox = document.getElementById('resultado-box');
    const resultado = document.getElementById('resultado');
    const faltando1 = document.getElementById('faltando1');
    const faltando2 = document.getElementById('faltando2');
    const faltando3 = document.getElementById('faltando3');
    const faltando4 = document.getElementById('faltando4');

    resultadoBox.classList.remove("show");
    setTimeout(() => {
        resultadoBox.classList.add("show");

        let eventoTexto = evento ? `para o evento <strong>${evento}</strong>` : "para o evento";

        if (folgas > 0) {
            resultado.innerHTML = `🎉 Você ganhou <span class="font-bold">${folgas} sábado(s) de folga</span> ${eventoTexto}!`;
            resultado.classList.remove("text-red-600");
            resultado.classList.add("text-green-600");
        } else {
            resultado.innerHTML = `❌ <span class="font-bold">Meta não alcançada</span> ${eventoTexto}. Continue trabalhando!`;
            resultado.classList.remove("text-green-600");
            resultado.classList.add("text-red-600");
        }

        const falta1 = (alvo1 - valorPainel > 0) ? (alvo1 - valorPainel) : 0;
        const falta2 = (alvo2 - valorPainel > 0) ? (alvo2 - valorPainel) : 0;
        const falta3 = (alvo3 - valorPainel > 0) ? (alvo3 - valorPainel) : 0;
        const falta4 = (alvo4 - valorPainel > 0) ? (alvo4 - valorPainel) : 0;

        faltando1.innerHTML = `🔹 Faltam <span class="font-bold">${falta1 > 0 ? falta1.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 1 sábado.`;
        faltando2.innerHTML = `🔹 Faltam <span class="font-bold">${falta2 > 0 ? falta2.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 2 sábados.`;
        faltando3.innerHTML = `🔹 Faltam <span class="font-bold">${falta3 > 0 ? falta3.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 3 sábados.`;
        faltando4.innerHTML = `🔹 Faltam <span class="font-bold">${falta4 > 0 ? falta4.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 4 sábados.`;

    }, 100);
}

document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calcularFolgas();
    }
});
