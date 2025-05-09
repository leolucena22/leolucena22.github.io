let currentData = [];

document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('nomeEvento').addEventListener('input', updateTable);
document.getElementById('mensagemPersonalizada').addEventListener('input', updateTable);

function insertTag(tag) {
    const textarea = document.getElementById("mensagemPersonalizada");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + tag + text.substring(end);
    textarea.focus();
    updateTable();
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

function getRandomMessage(row) {
    const nome = row.nome ? `*${row.nome.toUpperCase()}*` : '*Participante*';
    const titulo = row.titulo ? `*${row.titulo.toUpperCase()}*` : '*seu trabalho*';
    const evento = `*${document.getElementById('nomeEvento').value.trim() || 'o evento'}*`;

    const mensagens = document.getElementById('mensagemPersonalizada').value
        .split('\n')
        .map(m => m.trim())
        .filter(m => m.length > 0);

    const modelo = mensagens[Math.floor(Math.random() * mensagens.length)] ||
        "Olá {{nome}}, seu trabalho {{titulo}} foi recebido com sucesso em {{evento}}.";

    return modelo
        .replace(/{{\s*nome\s*}}/gi, nome)
        .replace(/{{\s*titulo\s*}}/gi, titulo)
        .replace(/{{\s*evento\s*}}/gi, evento);
}

function enviarMensagem(index) {
    const row = currentData[index];
    const telefone = row.telefone.replace(/\D/g, '');
    const mensagem = getRandomMessage(row);
    const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    salvarEnviado(telefone);
    window.open(link, '_blank');
    setTimeout(() => renderTable(currentData), 100);
}

function updateTable() {
    if (currentData.length > 0) renderTable(currentData);
}

function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
            type: 'array'
        });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(sheet, {
            range: 1
        });

        currentData = raw.map(row => {
            const lowerKeys = Object.keys(row).reduce((acc, key) => {
                acc[key.toLowerCase().trim()] = row[key];
                return acc;
            }, {});

            const produto = (lowerKeys['produto'] || '').toString().toLowerCase();
            const telefone = (lowerKeys['telefone'] || '').toString().replace(/\D/g, '');

            if (produto.includes('premium') || produto.includes('plus') || produto.includes('combo')) return null;

            return {
                nome: lowerKeys['autor'] || lowerKeys['nome'] || '',
                telefone: telefone,
                email: lowerKeys['e-mail'] || lowerKeys['email'] || '',
                titulo: lowerKeys['título'] || lowerKeys['titulo'] || '',
                tipo: lowerKeys['tipo'] || '', // <- ESSENCIAL
                apresentacao: lowerKeys['apresentação'] || lowerKeys['apresentacao'] || '',
                produto: lowerKeys['produto'] || ''
            };
        }).filter(Boolean);

        renderTable(currentData);
    };

    reader.readAsArrayBuffer(file);
}

function renderTable(data) {
    const enviados = getEnviados().map(t => t.replace(/\D/g, ''));
    const container = document.getElementById('tableContainer');

    let html = `
  <table class="min-w-full text-sm border border-gray-300 dark:border-gray-700">
    <thead class="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
      <tr>
        <th class="px-4 py-2 border">Nome</th>
        <th class="px-4 py-2 border">Telefone</th>
        <th class="px-4 py-2 border">E-mail</th>
        <th class="px-4 py-2 border">Título</th>
        <th class="px-4 py-2 border">Tipo do Resumo</th>
        <th class="px-4 py-2 border">Apresentação</th>
        <th class="px-4 py-2 border">Produto</th>
        <th class="px-4 py-2 border">Enviado</th>
        <th class="px-4 py-2 border">Contato</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-300 dark:divide-gray-600">
`;

    data.forEach((row, index) => {
        const telefone = row.telefone.replace(/\D/g, '');
        const jaEnviado = enviados.includes(telefone);
        const rowClass = jaEnviado ? 'bg-green-100 dark:bg-green-800' : '';
        const status = jaEnviado ? '✔️' : '❌';

        html += `
    <tr class="${rowClass}">
      <td class="px-4 py-2 border">${row.nome}</td>
      <td class="px-4 py-2 border">${row.telefone}</td>
      <td class="px-4 py-2 border">${row.email}</td>
      <td class="px-4 py-2 border">${row.titulo}</td>
      <td class="px-4 py-2 border">${row.tipo}</td> <!-- nova coluna -->
      <td class="px-4 py-2 border">${row.apresentacao}</td>
      <td class="px-4 py-2 border">${row.produto}</td>
      <td class="px-4 py-2 border text-center font-bold">${status}</td>
      <td class="px-4 py-2 border text-center">
        <button onclick="enviarMensagem(${index})"
  		class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded shadow">
  		WhatsApp
		</button>
      </td>
    </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}