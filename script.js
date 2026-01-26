class Viagem {
    constructor(cidade, info, valor, imagem, data) {
        this.cidade = cidade;
        this.info = info;
        this.valor = valor;
        this.imagem = imagem;
        this.data = data;
    }

    renderizar() {
        const infoFormatada = this.info ? this.info.replace(/\n/g, '<br>') : "";
        const dataFormatada = this.data ? this.data.split('-').reverse().join('/') : "Data a definir";
        
        // Transformamos o objeto em string para passar no clique do botão
        const dadosSimples = JSON.stringify({ cidade: this.cidade, valor: this.valor });

        return `
            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${this.imagem}" alt="${this.cidade}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+Indisponível'">
                        <h1>${this.cidade}</h1>
                        <p style="font-weight: bold; color: #ff4d4d; margin-bottom: 10px;">📅 Data: ${dataFormatada}</p>
                        <p>${infoFormatada}</p>
                        <p class="preco"><span>Preço</span><br>R$ ${this.valor}</p>
                        <button class="btn" onclick="toggleFlip(this)">Mais Informações</button>
                    </div>
                    <div class="card-back">
                        <h1>${this.cidade}</h1>
                        <p><strong>Partida prevista:</strong> ${dataFormatada}</p>
                        <p>Conheça as maravilhas de ${this.cidade}. Reserve agora e garanta sua vaga!</p>
                        
                        <button class="btn-reservar" onclick='adicionarAoCarrinho(${dadosSimples})'>
                            <i class="fa-solid fa- suitcase-rolling"></i> Reservar Passagem
                        </button>

                        <button class="btn" style="margin-top: 10px; background: #555;" onclick="toggleFlip(this)">Voltar</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// --- LÓGICA DO CARRINHO ---

function adicionarAoCarrinho(item) {
    // Busca o que já tem no carrinho ou cria array vazio
    let carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];
    
    // Adiciona o novo item
    carrinho.push(item);
    
    // Salva de volta
    localStorage.setItem('carrinho_aero', JSON.stringify(carrinho));
    
    // Atualiza o número no ícone do header
    atualizarContadorCarrinho();

    alert(`${item.cidade} adicionada às suas reservas!`);
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];
        contador.innerText = carrinho.length;
    }
}

// Funções existentes ajustadas
function toggleFlip(botao) {
    const cardInner = botao.closest('.card-inner');
    cardInner.classList.toggle('flipped');
}

function carregarViagens() {
    const vitrine = document.getElementById('vitrine-viagens');
    if (!vitrine) return;

    const dados = JSON.parse(localStorage.getItem('viagens_db')) || [];
    vitrine.innerHTML = dados.map(item => {
        const v = new Viagem(item.cidade, item.info, item.valor, item.imagem, item.data);
        return v.renderizar();
    }).join('');

    // Garante que o contador comece certo ao carregar a página
    atualizarContadorCarrinho();
}

// --- ADICIONADO APENAS A FUNÇÃO DE BUSCAR ---

function filtrarCidades() {
    const vitrine = document.getElementById('vitrine-viagens');
    const input = document.getElementById('searchInput');
    if (!vitrine || !input) return;

    const termo = input.value.toLowerCase();
    const dados = JSON.parse(localStorage.getItem('viagens_db')) || [];

    // Filtra os dados sem apagar o banco original
    const filtrados = dados.filter(item => 
        item.cidade.toLowerCase().includes(termo)
    );

    // Renderiza apenas os resultados da busca
    vitrine.innerHTML = filtrados.map(item => {
        const v = new Viagem(item.cidade, item.info, item.valor, item.imagem, item.data);
        return v.renderizar();
    }).join('');
}

window.onload = carregarViagens;