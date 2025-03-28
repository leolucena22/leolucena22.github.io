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

    // Remover R$ e formatar para número
    valorPainel = parseFloat(valorPainel.replace(/[^\d,]/g, "").replace(",", ".") || 0);
    const valorBase = (trabalhos * 100) + inscritos;

    // Comparações
    const base1 = valorBase;
    const base2 = valorBase * 1.05;
    const base3 = valorBase * 1.08;
    const base4 = valorBase * 1.10;

    let folgas = 0;
    if (valorPainel > base1) folgas = 1;
    if (valorPainel > base2) folgas = 2;
    if (valorPainel > base3) folgas = 3;
    if (valorPainel > base4) folgas = 4;

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

        // Cálculo do que falta
        const formatar = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

        faltando1.innerHTML = `🔹 Faltam <span class="font-bold">${(valorPainel < base1) ? formatar(base1 - valorPainel) : "✅"}</span> para 1 sábado.`;
        faltando2.innerHTML = `🔹 Faltam <span class="font-bold">${(valorPainel < base2) ? formatar(base2 - valorPainel) : "✅"}</span> para 2 sábados.`;
        faltando3.innerHTML = `🔹 Faltam <span class="font-bold">${(valorPainel < base3) ? formatar(base3 - valorPainel) : "✅"}</span> para 3 sábados.`;
        faltando4.innerHTML = `🔹 Faltam <span class="font-bold">${(valorPainel < base4) ? formatar(base4 - valorPainel) : "✅"}</span> para 4 sábados.`;
    }, 100);
}

document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        calcularFolgas();
    }
});
