// Elementos do DOM
const initialDepositInput = document.getElementById('initialDeposit');
const monthlyDepositInput = document.getElementById('monthlyDeposit');
const cdiRateInput = document.getElementById('cdiRate');
const percentCDIInput = document.getElementById('percentCDI');
const timePeriodInput = document.getElementById('timePeriod');
const taxRateInput = document.getElementById('taxRate');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsCard = document.getElementById('resultsCard');


// Define valores padrão
const defaults = {
    initialDeposit: '1000,00',
    monthlyDeposit: '500,00',
    cdiRate: '12,75',
    percentCDI: '110',
    timePeriod: '12',
    taxRate: '15'
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Define o tema baseado na preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.setAttribute('data-theme', 'light');
    }

    // Inicializa inputs com valores padrão
    initialDepositInput.value = defaults.initialDeposit;
    monthlyDepositInput.value = defaults.monthlyDeposit;
    cdiRateInput.value = defaults.cdiRate;
    percentCDIInput.value = defaults.percentCDI;
    timePeriodInput.value = defaults.timePeriod;
    taxRateInput.value = defaults.taxRate;

    // Adiciona formatação automática para inputs monetários
    setupCurrencyInput(initialDepositInput);
    setupCurrencyInput(monthlyDepositInput);
    
    // Adiciona formatação para percentuais
    setupPercentInput(cdiRateInput);
    setupPercentInput(percentCDIInput);
    setupPercentInput(taxRateInput);
    
    // Adiciona validação para número inteiro
    setupIntegerInput(timePeriodInput);
});

// Formatação de entrada monetária
function setupCurrencyInput(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value === '') return e.target.value = '';
        value = parseInt(value, 10) / 100;
        e.target.value = value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    });
}

// Formatação de entrada percentual
function setupPercentInput(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d,]/g, '');
        value = value.replace(',', '.');
        if (value === '') return e.target.value = '';
        if (isNaN(parseFloat(value))) return;
        e.target.value = parseFloat(value).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace(',00', '');
    });
}

// Formatação de entrada inteira
function setupIntegerInput(input) {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Formatação monetária
const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

// Formatação percentual
const formatPercent = (value) => {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + '%';
};

// Validação de formulário
const validateForm = () => {
    let isValid = true;
    
    // Validar valor inicial
    const initialDeposit = parseFloat(initialDepositInput.value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(initialDeposit) || initialDeposit < 0) {
        document.getElementById('initialDepositError').textContent = 'Valor inicial inválido';
        initialDepositInput.closest('.form-group').classList.add('input-error');
        isValid = false;
    } else {
        initialDepositInput.closest('.form-group').classList.remove('input-error');
    }
    
    // Validar depósito mensal
    const monthlyDeposit = parseFloat(monthlyDepositInput.value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(monthlyDeposit) || monthlyDeposit < 0) {
        document.getElementById('monthlyDepositError').textContent = 'Depósito mensal inválido';
        monthlyDepositInput.closest('.form-group').classList.add('input-error');
        isValid = false;
    } else {
        monthlyDepositInput.closest('.form-group').classList.remove('input-error');
    }
    
    // Validar taxa CDI
    const cdiRate = parseFloat(cdiRateInput.value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(cdiRate) || cdiRate <= 0 || cdiRate > 100) {
        document.getElementById('cdiRateError').textContent = 'Taxa CDI deve estar entre 0 e 100%';
        cdiRateInput.closest('.form-group').classList.add('input-error');
        isValid = false;
    } else {
        cdiRateInput.closest('.form-group').classList.remove('input-error');
    }
    
    // Validar percentual CDI
    const percentCDI = parseFloat(percentCDIInput.value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(percentCDI) || percentCDI <= 0) {
        document.getElementById('percentCDIError').textContent = 'Percentual CDI deve ser maior que 0';
        percentCDIInput.closest('.form-group').classList.add('input-error');
        isValid = false;
    } else {
        percentCDIInput.closest('.form-group').classList.remove('input-error');
    }
    
    // Validar período
    const timePeriod = parseInt(timePeriodInput.value);
    if (isNaN(timePeriod) || timePeriod <= 0 || timePeriod > 600) { // Máximo 50 anos
        document.getElementById('timePeriodError').textContent = 'Período deve estar entre 1 e 600 meses';
        timePeriodInput.closest('.form-group').classList.add('input-error');
        isValid = false;
    } else {
        timePeriodInput.closest('.form-group').classList.remove('input-error');
    }
    
    // Validar alíquota IR
    const taxRate = parseFloat(taxRateInput.value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
        document.getElementById('taxRateError').textContent = 'Alíquota deve estar entre 0 e 100%';
        taxRateInput.closest('.form-group').classList.add('input-error');
        isValid = false;
    } else {
        taxRateInput.closest('.form-group').classList.remove('input-error');
    }
    
    return isValid;
};

// Cálculos CDI
const calculateCDI = () => {
    if (!validateForm()) {
        return;
    }
    
    // Extrai valores do formulário
    const initialDeposit = parseFloat(initialDepositInput.value.replace(/\./g, '').replace(',', '.'));
    const monthlyDeposit = parseFloat(monthlyDepositInput.value.replace(/\./g, '').replace(',', '.'));
    const cdiRate = parseFloat(cdiRateInput.value.replace(/\./g, '').replace(',', '.'));
    const percentCDI = parseFloat(percentCDIInput.value.replace(/\./g, '').replace(',', '.'));
    const timePeriod = parseInt(timePeriodInput.value);
    const taxRate = parseFloat(taxRateInput.value.replace(/\./g, '').replace(',', '.')) / 100;
    
    // Cálculo da taxa efetiva
    const effectiveRate = (cdiRate / 100) * (percentCDI / 100);
    
    // Taxas de rendimento
    const monthlyRate = Math.pow(1 + effectiveRate, 1/12) - 1;
    
    // Simulação completa
    let balance = initialDeposit;
    let totalInvested = initialDeposit;
    const monthlyBalances = [initialDeposit];
    
    for (let month = 1; month <= timePeriod; month++) {
        // Aplica rendimento mensal
        const monthlyEarning = balance * monthlyRate;
        balance += monthlyEarning;
        
        // Adiciona depósito mensal
        if (month < timePeriod) {
            balance += monthlyDeposit;
            totalInvested += monthlyDeposit;
        }
        
        monthlyBalances.push(balance);
    }
    
    const finalValue = balance;
    const totalReturn = finalValue - totalInvested;
    const taxAmount = totalReturn * taxRate;
    const netReturn = totalReturn - taxAmount;
    
    // Exibe resultados
    document.getElementById('totalReturn').textContent = formatCurrency(totalReturn);
    document.getElementById('taxAmount').textContent = formatCurrency(taxAmount);
    document.getElementById('netReturn').textContent = formatCurrency(netReturn);
    document.getElementById('finalValue').textContent = formatCurrency(finalValue);
    document.getElementById('totalInvested').textContent = formatCurrency(totalInvested);
    document.getElementById('effectiveRate').textContent = formatPercent(effectiveRate * 100);
    document.getElementById('averageMonthlyReturn').textContent = formatCurrency(totalReturn / timePeriod);
    
    const totalWithNetReturn = totalInvested + netReturn;
    document.getElementById('totalWithNetReturn').textContent = formatCurrency(totalWithNetReturn);


    // Mostra card de resultados com animação
    resultsCard.style.display = 'block';
    resultsCard.classList.add('fade-in');
    
    // Cria gráfico
    createChart(monthlyBalances, timePeriod);
    
    // Rola suavemente até os resultados
    resultsCard.scrollIntoView({ behavior: 'smooth' });
};

// Limpar formulário
const resetForm = () => {
    initialDepositInput.value = defaults.initialDeposit;
    monthlyDepositInput.value = defaults.monthlyDeposit;
    cdiRateInput.value = defaults.cdiRate;
    percentCDIInput.value = defaults.percentCDI;
    timePeriodInput.value = defaults.timePeriod;
    taxRateInput.value = defaults.taxRate;
    
    // Remove indicadores de erro
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('input-error');
    });
    
    // Esconde resultados
    resultsCard.style.display = 'none';
};

// Observador de mudança de tema do sistema
if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Atualiza o tema quando a preferência do sistema mudar
    colorSchemeQuery.addEventListener('change', (e) => {
        document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
}

// Gráfico de crescimento
let growthChart = null;
const createChart = (data, months) => {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    // Obtém o tema atual para definir cores do gráfico
    const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#e0e0e0' : '#333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    if (growthChart) {
        growthChart.destroy();
    }
    
    // Cria labels para os meses
    const labels = [];
    for (let i = 0; i <= months; i++) {
        labels.push(i === 0 ? 'Início' : `Mês ${i}`);
    }
    
    // Separa os dados entre montante investido e rendimentos
    const investedData = [];
    const totalData = data.slice();
    
    let invested = parseFloat(initialDepositInput.value.replace(/\./g, '').replace(',', '.'));
    investedData.push(invested);
    
    const monthlyDeposit = parseFloat(monthlyDepositInput.value.replace(/\./g, '').replace(',', '.'));
    
    for (let i = 1; i <= months; i++) {
        // Acrescenta apenas o depósito mensal, sem rendimentos
        if (i < months) {
            invested += monthlyDeposit;
        }
        investedData.push(invested);
    }
    
    // Configurações do gráfico
    growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Valor Total',
                    data: totalData,
                    borderColor: '#00c853',
                    backgroundColor: 'rgba(0, 200, 83, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: 'Valor Investido',
                    data: investedData,
                    borderColor: '#2196f3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.3,
                    fill: true,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            family: "'Montserrat', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
                        }
                    },
                    padding: 10,
                    backgroundColor: isDarkMode ? '#2d2d2d' : 'rgba(255, 255, 255, 0.9)',
                    titleColor: isDarkMode ? '#e0e0e0' : '#333',
                    bodyColor: isDarkMode ? '#e0e0e0' : '#333',
                    borderColor: isDarkMode ? '#444' : '#ddd',
                    borderWidth: 1,
                    titleFont: {
                        family: "'Montserrat', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Montserrat', sans-serif",
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        },
                        color: textColor,
                        font: {
                            family: "'Montserrat', sans-serif"
                        }
                    },
                    grid: {
                        color: gridColor
                    },
                    title: {
                        display: true,
                        text: 'Valor (R$)',
                        color: textColor,
                        font: {
                            family: "'Montserrat', sans-serif",
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        font: {
                            family: "'Montserrat', sans-serif"
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: gridColor
                    },
                    title: {
                        display: true,
                        text: 'Período',
                        color: textColor,
                        font: {
                            family: "'Montserrat', sans-serif",
                            size: 12
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
};

// Ajusta o gráfico quando o tamanho da janela muda
window.addEventListener('resize', () => {
    if (growthChart) {
        growthChart.resize();
    }
});

// Atualiza o gráfico quando o tema muda
const observer = new MutationObserver(() => {
    if (growthChart && resultsCard.style.display !== 'none') {
        calculateCDI();
    }
});

observer.observe(document.body, { 
    attributes: true, 
    attributeFilter: ['data-theme'] 
});

// Atualiza automaticamente a alíquota com base no período
timePeriodInput.addEventListener('change', () => {
    const months = parseInt(timePeriodInput.value) || 0;
    let taxRate;
    
    if (months <= 6) {
        taxRate = '22,5';
    } else if (months <= 12) {
        taxRate = '20';
    } else if (months <= 24) {
        taxRate = '17,5';
    } else {
        taxRate = '15';
    }
    
    taxRateInput.value = taxRate;
});

// Event listeners
calculateBtn.addEventListener('click', calculateCDI);
resetBtn.addEventListener('click', resetForm);

// Permitir cálculo com a tecla Enter
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateCDI();
        }
    });
});