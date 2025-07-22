// Variável para armazenar o tipo de exibição (primeira ou retransmissao)
let tipoExibicaoSelecionado = 'primeira'; // Valor padrão

document.getElementById("tipoCertificado").addEventListener("change", () => {
    const tipo = document.getElementById("tipoCertificado").value;
    const nomeRevistaContainer = document.getElementById("nomeRevistaContainer");

    if (tipo === "publicacao") {
        nomeRevistaContainer.classList.remove("hidden");
    } else {
        nomeRevistaContainer.classList.add("hidden");
        document.getElementById("nomeRevista").value = ""; // Limpa o campo caso ele fique oculto
    }
});

// Event listeners para os novos botões de exibição
document.getElementById("btnPrimeiraExibicao").addEventListener("click", () => {
    tipoExibicaoSelecionado = 'primeira';
    alert("Modo: Primeira Exibição selecionado!");
});

document.getElementById("btnRetransmissao").addEventListener("click", () => {
    tipoExibicaoSelecionado = 'retransmissao';
    alert("Modo: Retransmissão selecionado!");
});


document.getElementById("gerarCertificado").addEventListener("click", () => {
    const tipo = document.getElementById("tipoCertificado").value;
    const nomeEvento = document.getElementById("nomeEvento").value;
    const dataEvento = document.getElementById("dataEvento").value;
    const nomeRevista = document.getElementById("nomeRevista").value;

    let texto = "";

    // Lógica para gerar o texto com base no tipo de certificado E no tipo de exibição
    switch (tipo) {
        case "participacao":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos para os devidos fins que :nome participou do <strong>${nomeEvento}</strong>, na modalidade on-line, no período de <strong>${dataEvento}</strong>, com carga horária total de 40 horas.`;
            } else { // Retransmissão
                texto = `Certificamos para os devidos fins que :nome participou da retransmissão do <strong>${nomeEvento}</strong>, na modalidade on-line, com carga horária total de 40 horas.`;
            }
            break;
        case "participacaoAtividades":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos para os devidos fins que :nome, participou do minicurso :atividade, ofertado durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>. Carga horária: 4 horas.`;
            } else { // Retransmissão
                texto = `Certificamos para os devidos fins que :nome, participou do minicurso :atividade, ofertado durante a retransmissão do evento <strong>${nomeEvento}</strong>. Carga horária: 4 horas.`;
            }
            break;
        case "apresentacao":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos para os devidos fins que o trabalho intitulado ":resumo_titulo", de autoria de :nome, :coautor foi apresentado na modalidade ":modalidade_de_apresentacao" durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>.`;
            } else { // Retransmissão
                texto = `Certificamos para os devidos fins que o trabalho intitulado ":resumo_titulo", de autoria de :nome, :coautor foi apresentado na modalidade ":modalidade_de_apresentacao" durante a retransmissão do evento <strong>${nomeEvento}</strong>.`;
            }
            break;
        case "publicacao":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos que o trabalho intitulado :resumo_titulo do tipo :tipo_resumo de autoria de :nome, :coautor foi aprovado e publicado nos anais do evento <strong>${nomeEvento}</strong>, através da ${nomeRevista} (ISSN: XXXX-XXXX) no seu Volume X, número X, sob registro DOI :doi_ref.`;
            } else { // Retransmissão
                texto = `Certificamos que o trabalho intitulado :resumo_titulo do tipo :tipo_resumo de autoria de :nome, :coautor foi aprovado e publicado nos anais do evento <strong>${nomeEvento}</strong>, através da ${nomeRevista} (ISSN: XXXX-XXXX) no seu Volume X, número X, sob registro DOI :doi_ref.`;
            }
            break;
        case "aceiteSubmissao":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos para os devidos fins que a submissão do trabalho intitulado :resumo_titulo do tipo :tipo_resumo de autoria de :nome, :coautor foi aprovado no <strong>${nomeEvento}</strong>, na modalidade on-line, que irá ocorrer no período de <strong>${dataEvento}</strong>.`
            } else { // Retransmissão
                texto = `Certificamos para os devidos fins que a submissão do trabalho intitulado :resumo_titulo do tipo :tipo_resumo de autoria de :nome, :coautor foi aprovado na retransmissão do <strong>${nomeEvento}</strong>, na modalidade on-line.`
            }
            break;
        case "revisor":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos para os devidos fins que :nome participou como membro da Comissão Científica na categoria de Revisor(a) dos trabalhos submetidos ao evento <strong>${nomeEvento}</strong>, na modalidade on-line, realizado no período de <strong>${dataEvento}</strong>. Carga horária: 80 horas.`;
            } else { // Retransmissão
                texto = `Certificamos para os devidos fins que :nome participou como membro da Comissão Científica na categoria de Revisor(a) dos trabalhos submetidos à retransmissão do evento <strong>${nomeEvento}</strong>, na modalidade on-line. Carga horária: 80 horas.`;
            }
            break;
        case "ministrante":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos para os devidos fins que :nome ministrou o minicurso ":atividade", com carga horária de 4 horas, durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>.`;
            } else { // Retransmissão
                texto = `Certificamos para os devidos fins que :nome ministrou o minicurso ":atividade", com carga horária de 4 horas, durante a retransmissão do evento <strong>${nomeEvento}</strong>.`;
            }
            break;
        case "palestrante":
            if (tipoExibicaoSelecionado === 'primeira') {
                texto = `Certificamos para os devidos fins que :nome ministrou a palestra intitulada ":palestra", durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>. Carga horária: 2 horas.`;
            } else { // Retransmissão
                texto = `Certificamos para os devidos fins que :nome ministrou a palestra intitulada ":palestra", durante a retransmissão do evento <strong>${nomeEvento}</strong>. Carga horária: 2 horas.`;
            }
            break;
    }

    document.getElementById("textoGerado").innerHTML = texto;
    document.getElementById("resultado").classList.remove("hidden");

    document.getElementById("copiarTexto").onclick = () => {
        navigator.clipboard.writeText(texto).then(() => {
            alert("Texto copiado para a área de transferência!");
        });
    };
});