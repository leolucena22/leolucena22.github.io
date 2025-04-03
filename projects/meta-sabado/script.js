// Formatar valores monetários em Reais
function formatarMoeda(input) {
    // Remove todos os caracteres não numéricos
    let valor = input.value.replace(/\D/g, '');
    
    // Se for vazio, retorna vazio
    if (valor === '') {
        input.value = '';
        return;
    }
    
    // Converte para número e formata como moeda
    valor = parseFloat(valor) / 100;
    input.value = valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Remover formatação de moeda e converter para número
function converterValorParaNumero(valorFormatado) {
    if (!valorFormatado) return 0;
    return parseFloat(valorFormatado.replace(/[^\d,.-]/g, '').replace(',', '.'));
}

// Função principal para calcular as metas de sábados
function calcularMetasSabados() {
    // Obter os valores dos inputs
    const nomeEvento = document.getElementById('evento').value;
    const valorPainelFormatado = document.getElementById('valorPainel').value;
    const trabalhosAprovados = parseInt(document.getElementById('trabalhos').value) || 0;
    const inscritos = parseInt(document.getElementById('inscritos').value) || 0;
    
    // Converter o valor do painel para número
    const valorPainel = converterValorParaNumero(valorPainelFormatado);
    
    // Calcular os valores de metas conforme as regras
    const valorBasico = (trabalhosAprovados * 100) + inscritos;
    const valorMeta1 = valorBasico; // Para 1 sábado
    const valorMeta2 = valorBasico * 1.05; // Para 2 sábados (valor básico + 5%)
    const valorMeta3 = valorBasico * 1.08; // Para 3 sábados (valor básico + 8%)
    const valorMeta4 = valorBasico * 1.08; // Para 4 sábados (valor básico + 8%, mas com meta diferente)
    
    // Verificar quantos sábados foram atingidos comparando o valor do painel com as metas
    const sabadosAtingidos = calcularSabadosAtingidos(valorPainel);
    
    // Calcular valores faltantes para cada nível
    const faltante1 = Math.max(25000 - valorPainel, 0);
    const faltante2 = Math.max(28000 - valorPainel, 0);
    const faltante3 = Math.max(28000 - valorPainel, 0);
    const faltante4 = Math.max(30000 - valorPainel, 0);
    
    // Exibir o resultado
    exibirResultado(nomeEvento, sabadosAtingidos, valorMeta1, valorMeta2, valorMeta3, valorMeta4, valorPainel, faltante1, faltante2, faltante3, faltante4);
    
    // Mostrar o resultado com animação
    const resultadoBox = document.getElementById('resultado-box');
    resultadoBox.classList.add('show');
}

// Calcular quantos sábados foram atingidos baseado no valor do painel
function calcularSabadosAtingidos(valorPainel) {
    if (valorPainel > 30000) {
        return 4;
    } else if (valorPainel > 28000) {
        return 3;
    } else if (valorPainel > 28000) { // Nota: O critério para 2 e 3 sábados é o mesmo (28.000)
        return 2;
    } else if (valorPainel > 25000) {
        return 1;
    } else {
        return 0;
    }
}

// Exibir os resultados na interface
function exibirResultado(nomeEvento, sabadosAtingidos, valorMeta1, valorMeta2, valorMeta3, valorMeta4, valorPainel, faltante1, faltante2, faltante3, faltante4) {
    const resultadoElement = document.getElementById('resultado');
    const faltando1Element = document.getElementById('faltando1');
    const faltando2Element = document.getElementById('faltando2');
    const faltando3Element = document.getElementById('faltando3');
    const faltando4Element = document.getElementById('faltando4');
    
    // Definir a mensagem principal de acordo com o número de sábados atingidos
    if (sabadosAtingidos === 0) {
        resultadoElement.innerHTML = `<span class="text-red-500">😔 Nenhum sábado de folga</span>`;
        resultadoElement.className = 'text-lg font-semibold text-red-500';
    } else {
        resultadoElement.innerHTML = `<span class="text-green-500">🥳 ${nomeEvento} atingiu ${sabadosAtingidos} sábado(s) de folga!</span>`;
        resultadoElement.className = 'text-lg font-semibold text-green-500';
    }
    
    // Formatar valores para exibição
    const formatarValor = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // Verificar status de cada meta com base no valor do painel
    const statusMeta1 = valorPainel > 25000 ? "✅" : "❌";
    const statusMeta2 = valorPainel > 28000 ? "✅" : "❌";
    const statusMeta3 = valorPainel > 28000 ? "✅" : "❌";
    const statusMeta4 = valorPainel > 30000 ? "✅" : "❌";
    
    // Exibir informações detalhadas sobre cada meta
    faltando1Element.innerHTML = `1 Sábado ${statusMeta1}: Meta calculada ${formatarValor(valorMeta1)} > 25.000`;
    faltando2Element.innerHTML = `2 Sábados ${statusMeta2}: Meta calculada ${formatarValor(valorMeta2)} > 28.000`;
    faltando3Element.innerHTML = `3 Sábados ${statusMeta3}: Meta calculada ${formatarValor(valorMeta3)} > 28.000`;
    faltando4Element.innerHTML = `4 Sábados ${statusMeta4}: Meta calculada ${formatarValor(valorMeta4)} > 30.000`;
    
    // Adicionar informações sobre valores faltantes, se aplicável
    if (faltante1 > 0) {
        faltando1Element.innerHTML += ` <span class="text-red-500">(Faltam ${formatarValor(faltante1)})</span>`;
    }
    
    if (faltante2 > 0) {
        faltando2Element.innerHTML += ` <span class="text-red-500">(Faltam ${formatarValor(faltante2)})</span>`;
    }
    
    if (faltante3 > 0) {
        faltando3Element.innerHTML += ` <span class="text-red-500">(Faltam ${formatarValor(faltante3)})</span>`;
    }
    
    if (faltante4 > 0) {
        faltando4Element.innerHTML += ` <span class="text-red-500">(Faltam ${formatarValor(faltante4)})</span>`;
    }
}