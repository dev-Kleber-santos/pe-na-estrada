// Função auxiliar para converter o arquivo do PC em uma string (Base64)
// Isso permite que o localStorage salve a imagem real
function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Função para salvar ou atualizar - AGORA É ASYNC
async function salvarViagem() {
    const cidade = document.getElementById('cidade').value;
    const info = document.getElementById('info').value;
    const valor = document.getElementById('valor').value;
    const inputImagem = document.getElementById('imagem'); // Referência ao input de arquivo
    const editIndex = document.getElementById('cidade').dataset.editIndex;

    let imagemFinal = "";

    // 1. Lógica para tratar a imagem
    if (inputImagem.files && inputImagem.files[0]) {
        // Se o usuário selecionou um NOVO arquivo do PC
        imagemFinal = await converterParaBase64(inputImagem.files[0]);
    } else if (editIndex !== undefined) {
        // Se estiver editando e não subiu foto nova, mantém a que já existia no banco
        const bancoAntigo = JSON.parse(localStorage.getItem('viagens_db'));
        imagemFinal = bancoAntigo[editIndex].imagem;
    }

    if (!cidade || !valor || !imagemFinal) return alert("Preencha os campos e selecione uma imagem!");

    let banco = JSON.parse(localStorage.getItem('viagens_db')) || [];

    const dadosViagem = { cidade, info, valor, imagem: imagemFinal };

    if (editIndex !== undefined) {
        banco[editIndex] = dadosViagem; // Atualiza o existente
        delete document.getElementById('cidade').dataset.editIndex;
    } else {
        banco.push(dadosViagem); // Adiciona novo
    }
    
    localStorage.setItem('viagens_db', JSON.stringify(banco));
    alert("Operação realizada!");
    location.reload();
}

// Função para carregar dados no formulário para editar
function prepararEdicao(index) {
    const banco = JSON.parse(localStorage.getItem('viagens_db'));
    const v = banco[index];

    document.getElementById('cidade').value = v.cidade;
    document.getElementById('info').value = v.info;
    document.getElementById('valor').value = v.valor;
    // Nota: Por segurança, o navegador não permite "preencher" um input de arquivo com um caminho.
    // O usuário verá o nome do arquivo vazio, mas o código acima garante que a foto antiga não se perca.
    
    document.getElementById('cidade').dataset.editIndex = index;
    window.scrollTo(0, 0); 
}

// Função para excluir
function excluirViagem(index) {
    if (confirm("Deseja realmente excluir esta viagem?")) {
        let banco = JSON.parse(localStorage.getItem('viagens_db'));
        banco.splice(index, 1);
        localStorage.setItem('viagens_db', JSON.stringify(banco));
        renderizarAdmin();
    }
}

// Mostra a lista de viagens no painel admin
function renderizarAdmin() {
    const lista = document.getElementById('lista-gerenciamento');
    const banco = JSON.parse(localStorage.getItem('viagens_db')) || [];
    
    lista.innerHTML = banco.map((v, i) => `
        <div style="background: #343444; padding: 10px; margin-bottom: 10px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center; color: white;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${v.imagem}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                <span>${v.cidade}</span>
            </div>
            <div>
                <button onclick="prepararEdicao(${i})" style="background: orange; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Editar</button>
                <button onclick="excluirViagem(${i})" style="background: red; border: none; padding: 5px 10px; cursor: pointer; color: white; border-radius: 3px;">Excluir</button>
            </div>
        </div>
    `).join('');
}

window.onload = renderizarAdmin;