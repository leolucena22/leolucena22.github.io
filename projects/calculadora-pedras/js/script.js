let pedras = document.querySelector('#qtd-pedras')

let resultado = document.querySelector('#result')

function imprimeResultado(valor) {
  resultado.innerHTML = `${valor} Metros`
}

function limpar() {
  pedras.value = ''
  resultado.innerHTML = ''
}

function vinteQuarenta() {
  let calculo = Number(pedras.value) / 12.5
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}

function trinta() {
  let calculo = Number(pedras.value) / 11.11
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}

function quarenta() {
  let calculo = Number(pedras.value) / 6.25
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}

function cinquenta() {
  let calculo = Number(pedras.value) / 4.0
  let metros_total = Number(pedras * 4.0)
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}
