// --- 1. LÓGICA DO RESUMO DA RESERVA COM EDIÇÃO DE QUANTIDADE ---

function carregarResumoReserva() {
    const listaReservas = document.getElementById('lista-reservas-resumo');
    const totalDisplay = document.getElementById('total-pagamento');
    const carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];

    if (!listaReservas) return;

    if (carrinho.length === 0) {
        listaReservas.innerHTML = "<p style='color: #888; text-align: center;'>Seu carrinho está vazio.</p>";
        totalDisplay.innerText = "0,00";
        return;
    }

    //contar passagens
    const contagem = {};
    carrinho.forEach(item => {
        const chave = item.cidade + "|" + item.valor;
        if (!contagem[chave]) {
            contagem[chave] = { ...item, qtd: 0 };
        }
        contagem[chave].qtd++;
    });

    let totalGeral = 0;
    const itensAgrupados = Object.values(contagem);

    listaReservas.innerHTML = itensAgrupados.map((item) => {
        const valorLimpo = item.valor.replace(/\./g, '').replace(',', '.');
        const valorNumerico = parseFloat(valorLimpo);
        const subtotalItem = valorNumerico * item.qtd;
        totalGeral += subtotalItem;

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding: 15px 0; font-size: 0.9rem;">
                <div>
                    <strong>${item.cidade}</strong><br>
                    <small style="color: #888;">Unitário: R$ ${item.valor}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; background: #343444; border-radius: 20px; padding: 2px 10px;">
                        <button onclick="alterarQtd('${item.cidade}', -1)" style="background:none; border:none; color:white; cursor:pointer; font-weight:bold; font-size:1.2rem;">-</button>
                        <span style="min-width: 20px; text-align: center; font-weight: bold;">${item.qtd}</span>
                        <button onclick="alterarQtd('${item.cidade}', 1)" style="background:none; border:none; color:white; cursor:pointer; font-weight:bold; font-size:1.2rem;">+</button>
                    </div>
                    
                    <strong style="min-width: 100px; text-align: right;">R$ ${subtotalItem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    
                    <button onclick="removerAgrupado('${item.cidade}')" style="background:none; border:none; color:#ff4d4d; cursor:pointer; margin-left:10px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    totalDisplay.innerText = totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// Adiciona ou remove 1 unidade no carrinho
function alterarQtd(cidade, operacao) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];
    
    if (operacao === 1) {
        const modelo = carrinho.find(i => i.cidade === cidade);
        if (modelo) carrinho.push({ ...modelo });
    } else {
        const index = carrinho.findIndex(i => i.cidade === cidade);
        if (index !== -1) carrinho.splice(index, 1);
    }

    localStorage.setItem('carrinho_aero', JSON.stringify(carrinho));
    carregarResumoReserva();
    if (typeof atualizarContadorCarrinho === "function") atualizarContadorCarrinho();
}

function removerAgrupado(cidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];
    const novoCarrinho = carrinho.filter(item => item.cidade !== cidade);
    localStorage.setItem('carrinho_aero', JSON.stringify(novoCarrinho));
    carregarResumoReserva();
    if (typeof atualizarContadorCarrinho === "function") atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];
        contador.innerText = carrinho.length;
    }
}

// --- 2. LÓGICA DE PAGAMENTO E BANDEIRAS ---

function changeTab(method) {
    document.getElementById('card-area').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('pix-content').style.display = method === 'pix' ? 'block' : 'none';
    document.getElementById('boleto-content').style.display = method === 'boleto' ? 'block' : 'none';
}

const cardInner = document.getElementById('card-inner-credit');

document.getElementById('input-number').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, ''); 
    v = v.replace(/(\d{4})(?=\d)/g, '$1 '); 
    e.target.value = v;
    document.getElementById('display-number').innerText = v || "#### #### #### ####";
    
    const rawNumber = v.replace(/\s/g, '');
    const cardBrandDisplay = document.getElementById('card-brand');
    
    const patterns = {
        elo: /^(4011|4312|4389|4514|4573|4576|5041|5066|5090|6277|6362|6363|6504|6505|6507|6509|6516|6550)/,
        visa: /^4/,
        mastercard: /^5[1-5]|^2[2-7]/,
        amex: /^3[47]/,
        hipercard: /^6062|^3841/
    };

    if (patterns.elo.test(rawNumber)) {
        cardBrandDisplay.innerHTML = 'ELO';
        cardBrandDisplay.style.color = "#ffcb05";
    } else if (patterns.visa.test(rawNumber)) {
        cardBrandDisplay.innerHTML = '<i class="fa-brands fa-cc-visa"></i> VISA';
        cardBrandDisplay.style.color = "#1a1f71";
    } else if (patterns.mastercard.test(rawNumber)) {
        cardBrandDisplay.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i> MASTER';
        cardBrandDisplay.style.color = "#eb001b";
    } else if (patterns.amex.test(rawNumber)) {
        cardBrandDisplay.innerHTML = '<i class="fa-brands fa-cc-amex"></i> AMEX';
        cardBrandDisplay.style.color = "#016fd0";
    } else if (patterns.hipercard.test(rawNumber)) {
        cardBrandDisplay.innerHTML = 'HIPER';
        cardBrandDisplay.style.color = "#b01111";
    } else {
        cardBrandDisplay.innerHTML = 'BANK';
        cardBrandDisplay.style.color = "white";
    }
});

document.getElementById('input-name').addEventListener('input', (e) => {
    document.getElementById('display-name').innerText = e.target.value.toUpperCase() || "NOME NO CARTÃO";
});

document.getElementById('input-expiry').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.substring(0,2) + '/' + v.substring(2,4);
    e.target.value = v;
    document.getElementById('display-expiry').innerText = v || "MM/AA";
});

const inputCVV = document.getElementById('input-cvv');
inputCVV.addEventListener('focus', () => cardInner.style.transform = 'rotateY(180deg)');
inputCVV.addEventListener('blur', () => cardInner.style.transform = 'rotateY(0deg)');
inputCVV.addEventListener('input', (e) => {
    document.getElementById('display-cvv').innerText = e.target.value || "***";
});

function finalizarPagamentoInterno() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];
    
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const container = document.querySelector('.checkout-container');
    const botao = document.querySelector('.btn-finish');

    // Feedback visual de carregamento
    botao.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processando...';
    botao.style.opacity = "0.7";
    botao.disabled = true;

    setTimeout(() => {
        // Limpa o carrinho do banco de dados
        localStorage.removeItem('carrinho_aero');

        // Mostra mensagem de sucesso
        container.innerHTML = `
            <div style="text-align: center; color: white; padding: 50px 20px; background: #23232e; border-radius: 15px; border: 1px solid #28a745;">
                <i class="fa-solid fa-circle-check" style="font-size: 70px; color: #28a745; margin-bottom: 20px;"></i>
                <h2 style="margin-bottom: 15px;">Reserva Confirmada!</h2>
                <p style="color: #bbb; margin-bottom: 30px; line-height: 1.6;">Obrigado por escolher a ADM Viagens. Você receberá um e-mail com todos os detalhes da sua partida em instantes.</p>
                <button onclick="window.location.href='../index.html'" class="btn-finish" style="width: auto; padding: 12px 40px;">Voltar para o Início</button>
            </div>
        `;

        // Zera o contador do carrinho
        if (typeof atualizarContadorCarrinho === "function") atualizarContadorCarrinho();
    }, 2500);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarResumoReserva();
    atualizarContadorCarrinho();
});