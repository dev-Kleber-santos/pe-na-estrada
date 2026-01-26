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