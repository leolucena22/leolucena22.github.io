function formatarMoeda(campo) {
    let valor = campo.value.replace(/\D/g, ""); 
    valor = (parseFloat(valor) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    campo.value = valor;
}

function calcularFolgas() {
    const evento = document.getElementById('evento').value.trim();
    let valorPainel = document.getElementById('valorPainel').value;
    const trabalhos = parseInt(document.getElementById('trabalhos').value) || 0;
    const inscritos = parseInt(document.getElementById('inscritos').value) || 0;

    // Remover R$ e formatar para número
    valorPainel = parseFloat(valorPainel.replace(/[^\d,]/g, "").replace(",", ".") || 0);

    // Metas para ganhar sábados
    const meta1 = 25000; 
    const meta2 = 28000; 
    const meta3 = meta2 * 1.08; 
    const meta4 = 30000; 

    let folgas = 0;

    if (valorPainel > meta1) folgas = 1;
    if (valorPainel > meta2) folgas = 2;
    if (valorPainel > meta3) folgas = 3;
    if (valorPainel > meta4) folgas = 4;

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

        faltando1.innerHTML = `🔹 Faltam <span class="font-bold">${(meta1 - valorPainel > 0) ? (meta1 - valorPainel).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 1 sábado.`;
        faltando2.innerHTML = `🔹 Faltam <span class="font-bold">${(meta2 - valorPainel > 0) ? (meta2 - valorPainel).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 2 sábados.`;
        faltando3.innerHTML = `🔹 Faltam <span class="font-bold">${(meta3 - valorPainel > 0) ? (meta3 - valorPainel).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 3 sábados.`;
        faltando4.innerHTML = `🔹 Faltam <span class="font-bold">${(meta4 - valorPainel > 0) ? (meta4 - valorPainel).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "✅"}</span> para 4 sábados.`;

    }, 100);
}