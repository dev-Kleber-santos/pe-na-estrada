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
                    <div class="card-front">
                        <img src="${this.imagem}" alt="${this.cidade}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+Indisponível'">
                        
                        <div class="card-content">
                            <h1>${this.cidade}</h1>
                            <p class="card-date">📅 ${dataFormatada}</p>
                            <p class="card-info">${this.info}</p>
                            
                            <div class="card-price-container">
                                <span>Preço</span>
                                <strong class="card-price">R$ ${this.valor}</strong>
                            </div>
                            
                            <button class="btn btn-full" onclick="toggleFlip(this)">Mais Informações</button>
                        </div>
                    </div>

                    <div class="card-back">
                        <div class="card-content-back">
                            <h3>Detalhes do Pacote</h3>
                            <p><strong>Partida:</strong> ${dataFormatada}</p>
                            <p>Aproveite o melhor de ${this.cidade} com suporte e conforto.</p>
                        </div>
                        
                        <div class="card-actions-back">
                            <button class="btn-reservar" onclick='adicionarAoCarrinho(${dadosSimples})'>
                                <i class="fa-solid fa-suitcase-rolling"></i> Reservar
                            </button>
                            <button class="btn btn-back-toggle" onclick="toggleFlip(this)">Voltar</button>
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
                cidade: "Paris, França",
                info: "Conheça a Torre Eiffel e os melhores museus do mundo.",
                valor: "4.500,00",
                imagem: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80",
                data: "2026-05-20"
            },
            {
                cidade: "Tóquio, Japão",
                info: "Tecnologia, cultura milenar e uma gastronomia única.",
                valor: "6.200,00",
                imagem: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80",
                data: "2026-10-12"
            },
            {
                cidade: "Rio de Janeiro",
                info: "Sol, praia e a vista incrível do Cristo Redentor.",
                valor: "1.200,00",
                imagem: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=300&q=80",
                data: "2026-03-15"
            }
        ];
        localStorage.setItem('viagens_db', JSON.stringify(exemplos));
    }
}

// --- LOGICA DE RENDERIZAÇÃO E CARRINHO ---

function carregarViagens() {
    const vitrine = document.getElementById('vitrine-viagens'); // Verifique se o ID no HTML é este
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