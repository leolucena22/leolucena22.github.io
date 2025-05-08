const fileInput = document.getElementById('fileInput');
    const nomeEventoInput = document.getElementById('nomeEvento');
    const mensagemInput = document.getElementById('mensagemPersonalizada');

    fileInput.addEventListener('change', handleFile);
    mensagemInput.addEventListener('input', updateTable);
    nomeEventoInput.addEventListener('input', updateTable);

    function insertTag(tag) {
      const textarea = document.getElementById("mensagemPersonalizada");
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      textarea.value = text.substring(0, start) + tag + text.substring(end);
      textarea.focus();
      updateTable();
    }

    let currentData = [];

    function handleFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { range: 1 });
        currentData = json;
        renderTable(json);
      };

      reader.readAsArrayBuffer(file);
    }

    function getEnviados() {
  return JSON.parse(localStorage.getItem("contatosEnviados") || "[]");
}

function salvarEnviado(telefone) {
  const normalizado = telefone.replace(/\D/g, '');
  const enviados = getEnviados();
  if (!enviados.includes(normalizado)) {
    enviados.push(normalizado);
    localStorage.setItem("contatosEnviados", JSON.stringify(enviados));
  }
}

function renderTable(data) {
    const container = document.getElementById('tableContainer');
    const enviados = getEnviados();
  
    let html = `
      <table class="min-w-full text-sm border border-gray-300 dark:border-gray-700">
        <thead class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
          <tr>
            <th class="px-4 py-2 border">Autor</th>
            <th class="px-4 py-2 border">Telefone</th>
            <th class="px-4 py-2 border">E-mail</th>
            <th class="px-4 py-2 border">Título</th>
            <th class="px-4 py-2 border">Tipo</th>
            <th class="px-4 py-2 border">Apresentação</th>
            <th class="px-4 py-2 border">Enviado</th>
            <th class="px-4 py-2 border">Contato</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300 dark:divide-gray-600">
    `;
  
    data.forEach((row, index) => {
      const telefoneBruto = (row["Telefone"] || '').toString();
      const telefone = telefoneBruto.replace(/\D/g, '');
  
      const autor = row["Autor"] || '';
      const email = row["E-mail"] || '';
      const titulo = (row["Título"] || '').toUpperCase();
      const tipo = row["Tipo"] || '';
      const apresentacao = row["Apresentação"] || '';
  
      const jaEnviado = enviados.includes(telefone);
      const rowClass = jaEnviado ? 'bg-green-100 dark:bg-green-800' : '';
      const status = jaEnviado ? '✔️' : '❌';
  
      html += `
        <tr class="${rowClass}">
          <td class="px-4 py-2 border">${autor}</td>
          <td class="px-4 py-2 border">${telefone}</td>
          <td class="px-4 py-2 border">${email}</td>
          <td class="px-4 py-2 border">${titulo}</td>
          <td class="px-4 py-2 border">${tipo}</td>
          <td class="px-4 py-2 border">${apresentacao}</td>
          <td class="px-4 py-2 border text-center font-bold">${status}</td>
          <td class="px-4 py-2 border text-center">
            <button onclick="enviarMensagem(${index})" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
              WhatsApp
            </button>
          </td>
        </tr>`;
    });
  
    html += `</tbody></table>`;
    container.innerHTML = html;
  }
  

  function enviarMensagem(index) {
    const row = currentData[index];
    const telefone = (row["Telefone"] || '').toString().replace(/\D/g, '');
    const mensagem = getRandomMessage(row);
    const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    salvarEnviado(telefone);
    window.open(link, '_blank');
    renderTable(currentData); // atualiza com a cor
  }

    function getRandomMessage(row) {
      const nome = `*${row["Autor"] || ''}*`;
      const titulo = `*${(row["Título"] || '').toUpperCase()}*`;
      const evento = `*${document.getElementById('nomeEvento').value.trim() || 'o evento'}*`;

      const mensagens = document.getElementById('mensagemPersonalizada').value
        .split('\n')
        .map(msg => msg.trim())
        .filter(msg => msg.length > 0);

      const selecionada = mensagens[Math.floor(Math.random() * mensagens.length)];

      return selecionada
        .replace(/{{\s*nome\s*}}/gi, nome)
        .replace(/{{\s*titulo\s*}}/gi, titulo)
        .replace(/{{\s*evento\s*}}/gi, evento);
    }

    function enviarMensagem(index) {
  const row = currentData[index];
  const telefone = (row["Telefone"] || '').toString().replace(/\D/g, '');
  const mensagem = getRandomMessage(row);
  const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
  salvarEnviado(telefone);
  window.open(link, '_blank');
  setTimeout(() => renderTable(currentData), 100); // garantir atualização após click
}


    function updateTable() {
      if (currentData.length > 0) {
        renderTable(currentData);
      }
    }