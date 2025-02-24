function calcularFolgas() {
    const evento = document.getElementById('evento').value.trim();
    const trabalhos = parseInt(document.getElementById('trabalhos').value) || 0;
    const inscritos = parseInt(document.getElementById('inscritos').value) || 0;

    const meta1 = (trabalhos * 100) + inscritos;
    const meta2 = (trabalhos * 100 * 1.05) + inscritos;
    const meta3 = (trabalhos * 100 * 1.08) + inscritos;
    const meta4 = (trabalhos * 100 * 1.10) + inscritos;

    let folgas = 0;
    let metaAlvo = 0;

    if (meta1 > 25000) { folgas = 1; metaAlvo = 25000; }
    if (meta2 > 28000) { folgas = 2; metaAlvo = 28000; }
    if (meta3 > 28000) { folgas = 3; metaAlvo = 28000; }
    if (meta4 > 30000) { folgas = 4; metaAlvo = 30000; }

    const resultadoBox = document.getElementById('resultado-box');
    const resultado = document.getElementById('resultado');
    const faltando = document.getElementById('faltando');
    const projecao = document.getElementById('projecao');

    resultadoBox.classList.remove("show"); // Remove a classe antes para resetar a animação
    setTimeout(() => {
        resultadoBox.classList.add("show"); // Exibe a saída com animação

        let eventoTexto = evento ? `para o evento <strong>${evento}</strong>` : "para o evento";

        if (folgas > 0) {
            resultado.innerHTML = `🎉 Você ganhou <span class="font-bold">${folgas} sábado(s) de folga</span> ${eventoTexto}!`;
            resultado.classList.remove("text-red-600");
            resultado.classList.add("text-green-600");
            faltando.textContent = "";
            projecao.textContent = "";
        } else {
            resultado.innerHTML = `❌ <span class="font-bold">Meta não alcançada</span> ${eventoTexto}. Continue trabalhando!`;
            resultado.classList.remove("text-green-600");
            resultado.classList.add("text-red-600");

            let proximaMeta = 25000;
            if (meta1 >= 25000) proximaMeta = 28000;
            if (meta2 >= 28000) proximaMeta = 28000;
            if (meta3 >= 28000) proximaMeta = 30000;

            let diferenca = proximaMeta - meta1;
            faltando.innerHTML = `🔹 Faltam <span class="font-bold">${diferenca.toLocaleString()}</span> pontos para atingir a próxima meta.`;
            faltando.classList.add("text-yellow-500");

            let trabalhosNecessarios = Math.ceil(diferenca / 100);
            let inscritosNecessarios = diferenca;

            let trabalhosCombinados = Math.ceil(trabalhosNecessarios * 0.6);
            let inscritosCombinados = Math.ceil(inscritosNecessarios * 0.4);

            projecao.innerHTML = `
                📌 Para atingir a próxima meta no evento <strong>${evento || "atual"}</strong>*, você pode:
                <ul class="mt-2 text-gray-700 dark:text-gray-300 text-left text-sm">
                    <li>✔ Aprovar mais <span class="font-bold">${trabalhosNecessarios}</span> trabalhos</li>
                    <li>✔ Conseguir mais <span class="font-bold">${inscritosNecessarios}</span> inscritos</li>
                    <li>✔ <span class="font-bold">Combinação ideal:</span> Aprovar <span class="font-bold">${trabalhosCombinados}</span> trabalhos e conseguir <span class="font-bold">${inscritosCombinados}</span> inscritos</li>
                </ul>
            `;
        }
    }, 100); // Pequeno delay para ativar a animação corretamente
}