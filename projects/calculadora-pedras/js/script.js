let metros = document.querySelector('#qtd-metros')

let resultado = document.querySelector('#result')

function imprimeResultado(valor) {
  resultado.innerHTML = `Quantidade🪨= ${valor} `
}

function limpar() {
  metros.value = ''
  resultado.innerHTML = ''
}

function vinteQuarenta() {
  let calculo = Number(metros.value) * 12.5
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}

function trinta() {
  let calculo = Number(metros.value) * 11.11
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}

function quarenta() {
  let calculo = Number(metros.value) * 6.25
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}

function cinquenta() {
  let calculo = Number(metros.value) * 4.0
  calculo <= 0
    ? (resultado.innerHTML = `Valor Inválido`)
    : imprimeResultado(calculo.toFixed(2))
}
