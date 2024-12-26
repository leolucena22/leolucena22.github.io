var deadline = new Date('2024-12-24T16:00:00').getTime();

var x = setInterval(function () {
  var now = new Date().getTime();
  var t = deadline - now;

  var dayElem = document.getElementById('day');
  var hourElem = document.getElementById('hour');
  var minuteElem = document.getElementById('minute');
  var secondElem = document.getElementById('second');

  if (t >= 0) {
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);

    if (dayElem) dayElem.innerHTML = days;
    if (hourElem) hourElem.innerHTML = hours;
    if (minuteElem) minuteElem.innerHTML = minutes;
    if (secondElem) secondElem.innerHTML = seconds;
  } else {
    clearInterval(x);
    // Atualiza todos os elementos com 0 quando a contagem acabar
    if (dayElem) dayElem.innerHTML = '0';
    if (hourElem) hourElem.innerHTML = '0';
    if (minuteElem) minuteElem.innerHTML = '0';
    if (secondElem) secondElem.innerHTML = '0';

    // Exibe uma mensagem no lugar do título ou em algum espaço específico
    document.querySelector('h1').textContent = 'Férias!!! WOW';
  }
}, 1000);
