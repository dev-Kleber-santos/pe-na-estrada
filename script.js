class Viagem {
    constructor(cidade, info, valor, imagem) {
        this.cidade = cidade;
        this.info = info;
        this.valor = valor;
        this.imagem = imagem;
    }

    // Gera o HTML idêntico ao original para manter o CSS e a responsividade
    renderizar() {
        return `
            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${this.imagem}" alt="${this.cidade}">
                        <h1>${this.cidade}</h1>
                        <p>${this.info.replace(/\n/g, '<br>')}</p>
                        <p><span>Preço</span><br>R$ ${this.valor}</p>
                        <button class="btn" onclick="this.closest('.card-inner').classList.toggle('flipped')">Mais Informações</button>
                    </div>
                    <div class="card-back">
                        <h1>${this.cidade}</h1>
                        <p>Conheça as maravilhas de ${this.cidade}. Reserve agora!</p>
                        <button class="btn" onclick="this.closest('.card-inner').classList.toggle('flipped')">Voltar</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Função para buscar dados e mostrar na tela
function carregarViagens() {
    const vitrine = document.getElementById('vitrine-viagens');
    const dados = JSON.parse(localStorage.getItem('viagens_db')) || [];

    vitrine.innerHTML = dados.map(item => {
        const v = new Viagem(item.cidade, item.info, item.valor, item.imagem);
        return v.renderizar();
    }).join('');
}

function filtrarCidades() {
    // Pega o valor digitado e transforma em minúsculo
    const termoBusca = document.getElementById('searchInput').value.toLowerCase();
    
    // Seleciona todos os cards da página
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Busca o nome da cidade dentro do H1 ou H2 do card
        const nomeCidade = card.querySelector('h1').innerText.toLowerCase();

        //  Verifica se o termo de busca está contido no nome da cidade
        if (nomeCidade.includes(termoBusca)) {
            card.style.display = "block"; // Mostra o card
        } else {
            card.style.display = "none"; // Esconde o card
        }
    });
}

window.onload = carregarViagens;