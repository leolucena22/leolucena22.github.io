function calcular() {
  let peso = document.querySelector("#peso").value
  let altura = document.querySelector("#altura").value

  let imc = peso / (altura * altura)

  const resultado = document.querySelector("#resultado")

  if (imc < 18.5) {
    resultado.innerHTML = imc.toFixed(2) + " | Abaixo do peso"
  }
  else if (imc >= 18.6 && imc < 24.9) {
    resultado.innerHTML = imc.toFixed(2) + " | Peso normal"
  }
  else if (imc >= 25.0 && imc < 29.9) {
    resultado.innerHTML = imc.toFixed(2) + " | Sobrepeso"
  }
  else if (imc >= 30.0 && imc < 34.9) {
    resultado.innerHTML = imc.toFixed(2) + " | Obesidade Grau I"
  }
  else if (imc >= 35.0 && imc < 39.9) {
    resultado.innerHTML = imc.toFixed(2) + " | Obesidade Grau II"
  }
  else if (imc > 39.9) {
    resultado.innerHTML = imc.toFixed(2) + " | Obesidade Grau III"
  } 
  else {
    resultado.innerHTML = "Informe valores válidos!"
  }

  document.querySelector(".box-resultado").classList.remove("disable")

}

document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    calcular()
  }
});