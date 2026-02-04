class Viagem {
    constructor(cidade, info, valor, imagem, data) {
        this.cidade = cidade;
        this.info = info;
        this.valor = valor;
        this.imagem = imagem;
        this.data = data;
    }

    renderizar() {
        const dataFormatada = this.data ? this.data.split('-').reverse().join('/') : "Data a definir";
        const dadosSimples = JSON.stringify({ cidade: this.cidade, valor: this.valor });

        return `
            <div class="card">
                <div class="card-inner">
                    <div class="card-front" style="display: flex; flex-direction: column; height: 100%;">
                        <img src="${this.imagem}" alt="${this.cidade}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+Indisponível'">
                        
                        <div style="padding: 10px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; align-items: center;">
                            <h1 style="font-size: 1.2rem; margin: 0;">${this.cidade}</h1>
                            <p style="font-weight: bold; color: #ff4d4d; margin: 5px 0; font-size: 0.9rem; padding:0;">📅 ${dataFormatada}</p>
                            <p style="font-size: 0.8rem; margin: 0; line-height: 1.2; padding: 5px;">${this.info}</p>
                            
                            <div class="preco" style="margin: 5px 0;">
                                <span style="display:block; font-size: 10px; text-transform: uppercase;">Preço</span>
                                <strong style="font-size: 1.1rem;">R$ ${this.valor}</strong>
                            </div>
                            
                            <button class="btn" style="width: 90%; padding: 8px 0;" onclick="toggleFlip(this)">Mais Informações</button>
                        </div>
                    </div>

                    <div class="card-back" style="display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding: 20px; box-sizing: border-box;">
                        <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                            <h3 style="margin-bottom: 10px; font-size: 1.1rem;">Detalhes do Pacote</h3>
                            <p style="font-size: 0.85rem; padding: 5px;"><strong>Partida:</strong> ${dataFormatada}</p>
                            <p style="font-size: 0.85rem; padding: 5px;">Aproveite o melhor de ${this.cidade}. Suporte 24h e guia turístico incluso.</p>
                        </div>
                        
                        <div style="width: 100%;">
                            <button class="btn-reservar" style="width: 100%; margin-bottom: 10px;" onclick='adicionarAoCarrinho(${dadosSimples})'>
                                <i class="fa-solid fa-suitcase-rolling"></i> Reservar
                            </button>
                            <button class="btn" style="width: 100%; background: #555; padding: 8px 0;" onclick="toggleFlip(this)">Voltar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// --- BANCO DE DADOS INICIAL (VAI APARECER ASSIM QUE ABRIR) ---
function verificarDadosIniciais() {
    const dados = localStorage.getItem('viagens_db');

    if (!dados || JSON.parse(dados).length === 0) {
        const exemplos = [
            {
                cidade: "Lençóis Maranhenses, Maranhão",
                info: "Explore as lagoas cristalinas entre dunas infinitas no coração do Nordeste.",
                valor: "3.200,00",
                imagem: "https://images.unsplash.com/photo-1561420052-e8a2aec15846?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                data: "2026-06-15"
            },
            {
                cidade: "Gramado, Rio Grande do Sul",
                info: "O charme da Serra Gaúcha com gastronomia europeia e clima aconchegante.",
                valor: "2.800,00",
                imagem: "https://images.unsplash.com/photo-1690907938160-133874466bb0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                data: "2026-07-10"
            },
            {
                cidade: "Fernando de Noronha, Pernambuco",
                info: "Mergulhe em um dos santuários ecológicos mais bonitos e exclusivos do mundo.",
                valor: "5.500,00",
                imagem: "https://images.unsplash.com/photo-1614722860207-909e0e8dfd99?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                data: "2026-09-05"
            }
        ];
        localStorage.setItem('viagens_db', JSON.stringify(exemplos));
    }
}

// --- LOGICA DE RENDERIZAÇÃO E CARRINHO ---

function carregarViagens() {
    const vitrine = document.getElementById('vitrine-viagens');
    if (!vitrine) return;

    const dados = JSON.parse(localStorage.getItem('viagens_db')) || [];
    vitrine.innerHTML = dados.map(item => {
        const v = new Viagem(item.cidade, item.info, item.valor, item.imagem, item.data);
        return v.renderizar();
    }).join('');

    atualizarContadorCarrinho();
}

function adicionarAoCarrinho(item) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];
    carrinho.push(item);
    localStorage.setItem('carrinho_aero', JSON.stringify(carrinho));
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

function toggleFlip(botao) {
    const cardInner = botao.closest('.card-inner');
    cardInner.classList.toggle('flipped');
}

function filtrarCidades() {
    const input = document.getElementById('searchInput');
    const vitrine = document.getElementById('vitrine-viagens');
    if (!input || !vitrine) return;

    const termo = input.value.toLowerCase();
    const dados = JSON.parse(localStorage.getItem('viagens_db')) || [];

    const filtrados = dados.filter(item => item.cidade.toLowerCase().includes(termo));
    vitrine.innerHTML = filtrados.map(item => {
        const v = new Viagem(item.cidade, item.info, item.valor, item.imagem, item.data);
        return v.renderizar();
    }).join('');
}

// Inicialização
window.onload = () => {
    verificarDadosIniciais();
    carregarViagens();
};