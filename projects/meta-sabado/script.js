function formatarMoeda(campo) {
    let valor = campo.value.replace(/\D/g, "");
    valor = (parseFloat(valor) / 100).toLocaleString("pt-BR", { 
        style: "currency", 
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    campo.value = valor;
}

function calcularFolgas() {
    const evento = document.getElementById('evento').value.trim();
    let valorPainel = document.getElementById('valorPainel').value;
    const trabalhos = parseInt(document.getElementById('trabalhos').value) || 0;
    const inscritos = parseInt(document.getElementById('inscritos').value) || 0;

    // Converter valorPainel para número (base)
    valorPainel = parseFloat(
        valorPainel.replace(/[^\d,]/g, "")
        .replace(",", ".")
    ) || 0;

    // Metas conforme a imagem (usando valorPainel como base)
    const METAS = [
        { valor: 25000, bonus: 0 },    // Meta 1: base >25k
        { valor: 28000, bonus: 0.05 }, // Meta 2: base*1.05 >28k
        { valor: 28000, bonus: 0.08 }, // Meta 3: base*1.08 >28k
        { valor: 30000, bonus: 0.10 }  // Meta 4: base*1.10 >30k
    ];

    let folgas = 0;
    for (let i = 0; i < METAS.length; i++) {
        const valorRequerido = valorPainel * (1 + METAS[i].bonus);
        if (valorRequerido >= METAS[i].valor) {
            folgas = i + 1;
        } else {
            break;
        }
    }

    // Atualizar interface
    const resultadoBox = document.getElementById('resultado-box');
    const resultado = document.getElementById('resultado');
    const [f1, f2, f3, f4] = ['faltando1', 'faltando2', 'faltando3', 'faltando4'].map(id => document.getElementById(id));

    resultadoBox.classList.remove("show");
    setTimeout(() => {
        resultadoBox.classList.add("show");

        const formatar = valor => valor.toLocaleString("pt-BR", { 
            style: "currency", 
            currency: "BRL" 
        });

        // Mensagem principal
        resultado.innerHTML = folgas > 0 
            ? `🎉 ${folgas} SÁBADOS LIBERADOS!` 
            : "❌ NENHUM SÁBADO LIBERADO";
        resultado.className = folgas > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold";

        // Detalhamento das metas
        METAS.forEach((meta, index) => {
            const valorRequerido = valorPainel * (1 + meta.bonus);
            const alcancado = valorRequerido >= meta.valor;
            const faltando = meta.valor - valorRequerido;
            
            document.getElementById(`faltando${index + 1}`).innerHTML = 
                `🔹 Meta ${index + 1}: ${alcancado ? "✅" : `❌ (Faltam ${formatar(faltando > 0 ? faltando : 0)})`}`;
        });

    }, 100);
}