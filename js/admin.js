// Nova função com compressão para evitar erros no celular
function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; // Redimensiona para no máximo 800px de largura
                const scaleSize = MAX_WIDTH / img.width;
                
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Exporta como JPEG com 70% de qualidade (fica leve e nítido para o site)
                const base64Comprimido = canvas.toDataURL('image/jpeg', 0.7);
                resolve(base64Comprimido);
            };
        };
        reader.onerror = error => reject(error);
    });
}

async function salvarViagem() {
    try {
        const campoCidade = document.getElementById('cidade');
        const campoInfo = document.getElementById('info');
        const campoValor = document.getElementById('valor');
        const campoData = document.getElementById('data-viagem');
        const campoImagem = document.getElementById('imagem');

        const editIndex = campoCidade.dataset.editIndex;

        if (!campoCidade || !campoData || !campoValor) {
            console.error("Erro: Um ou mais campos não encontrados.");
            return;
        }

        let imagemFinal = "";

        // Se houver arquivo selecionado, comprime. Se não, tenta manter a anterior (caso edição)
        if (campoImagem.files && campoImagem.files[0]) {
            imagemFinal = await converterParaBase64(campoImagem.files[0]);
        } else if (editIndex !== undefined) {
            const banco = JSON.parse(localStorage.getItem('viagens_db')) || [];
            imagemFinal = banco[editIndex].imagem;
        }

        if (!campoCidade.value || !campoValor.value || !campoData.value || !imagemFinal) {
            alert("Por favor, preencha todos os campos e selecione uma imagem.");
            return;
        }

        const novaViagem = {
            cidade: campoCidade.value,
            info: campoInfo.value,
            valor: campoValor.value,
            data: campoData.value,
            imagem: imagemFinal
        };

        let banco = JSON.parse(localStorage.getItem('viagens_db')) || [];

        if (editIndex !== undefined) {
            banco[editIndex] = novaViagem;
            delete campoCidade.dataset.editIndex;
        } else {
            banco.push(novaViagem);
        }

        // Tenta salvar e trata o erro de memória cheia
        try {
            localStorage.setItem('viagens_db', JSON.stringify(banco));
            alert("Viagem salva com sucesso!");
            location.reload();
        } catch (e) {
            alert("Erro: A memória do navegador está cheia. Tente usar uma foto menor ou excluir viagens antigas.");
        }

    } catch (erro) {
        console.error("Erro ao salvar:", erro);
    }
}

function renderizarAdmin() {
    const lista = document.getElementById('lista-gerenciamento');
    if (!lista) return;

    const banco = JSON.parse(localStorage.getItem('viagens_db')) || [];
    
    lista.innerHTML = banco.map((v, i) => `
        <div style="background: #343444; padding: 15px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; color: white; border: 1px solid #444;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${v.imagem}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div>
                    <strong>${v.cidade}</strong>
                    <br><small style="color: #bbb;">Data: ${v.data ? v.data.split('-').reverse().join('/') : '---'}</small>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="prepararEdicao(${i})" style="background: #ffa500; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">Editar</button>
                <button onclick="excluirViagem(${i})" style="background: #ff4d4d; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">Excluir</button>
            </div>
        </div>
    `).join('');
}

function prepararEdicao(index) {
    const banco = JSON.parse(localStorage.getItem('viagens_db'));
    const v = banco[index];

    document.getElementById('cidade').value = v.cidade;
    document.getElementById('info').value = v.info;
    document.getElementById('valor').value = v.valor;
    document.getElementById('data-viagem').value = v.data;
    
    document.getElementById('cidade').dataset.editIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function excluirViagem(index) {
    if (confirm("Excluir esta viagem?")) {
        let banco = JSON.parse(localStorage.getItem('viagens_db'));
        banco.splice(index, 1);
        localStorage.setItem('viagens_db', JSON.stringify(banco));
        renderizarAdmin();
    }
}

window.onload = renderizarAdmin;