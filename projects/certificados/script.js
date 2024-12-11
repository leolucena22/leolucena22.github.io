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

document.getElementById("gerarCertificado").addEventListener("click", () => {
  const tipo = document.getElementById("tipoCertificado").value;
  const nomeEvento = document.getElementById("nomeEvento").value;
  const dataEvento = document.getElementById("dataEvento").value;
  const nomeRevista = document.getElementById("nomeRevista").value;

  let texto = "";

  switch (tipo) {
    case "participacao":
      texto = `Certificamos para os devidos fins que <strong>:nome</strong> participou do <strong>${nomeEvento}</strong>, na modalidade <strong>on-line</strong>, no período de <strong>${dataEvento}</strong>, com carga horária total de <strong>40 horas</strong>.`;
      break;
    case "participacaoAtividades":
      texto = `Certificamos para os devidos fins que <strong>:nome</strong>, participou do minicurso <strong>:atividade</strong>, ofertado durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>. Carga horária: 4 horas.`;
      break;
    case "apresentacao":
      texto = `Certificamos para os devidos fins que o trabalho intitulado "<strong>:resumo_titulo</strong>", de autoria de <strong>:nome</strong>, :coautor foi apresentado na modalidade "<strong>:modalidade_de_apresentacao</strong>" durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>.`;
      break;
    case "publicacao":
      texto = `Certificamos que o trabalho intitulado <strong>:resumo_titulo</strong> do tipo <strong>:tipo_resumo</strong> de autoria de <strong>:nome</strong>, :coautor foi aprovado e publicado nos anais do evento <strong>${nomeEvento}</strong>, através da <strong>${nomeRevista}</strong> (ISSN: XXXX-XXXX) no seu Volume X, número X, sob registro DOI <strong>:doi_ref</strong>.`;
      break;
    case "revisor":
      texto = `Certificamos para os devidos fins que <strong>:nome</strong> participou como revisor(a) dos trabalhos submetidos ao evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>. Carga horária: 80 horas.`;
      break;
    case "ministrante":
      texto = `Certificamos para os devidos fins que <strong>:nome</strong> ministrou o minicurso "<strong>:atividade</strong>", com carga horária de 4 horas, durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>.`;
      break;
    case "palestrante":
      texto = `Certificamos para os devidos fins que <strong>:nome</strong> ministrou a palestra intitulada "<strong>:palestra</strong>", durante o evento <strong>${nomeEvento}</strong>, realizado no período de <strong>${dataEvento}</strong>. Carga horária: 2 horas.`;
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
