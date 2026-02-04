// --- 1. LÓGICA DO RESUMO DA RESERVA ---

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
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding: 15px 0; font-size: 0.9rem; color: white;">
                <div>
                    <strong>${item.cidade}</strong><br>
                    <small style="color: #888;">Unitário: R$ ${item.valor}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 8px; background: #343444; border-radius: 20px; padding: 2px 10px;">
                        <button onclick="alterarQtd('${item.cidade}', -1)" style="background:none; border:none; color:white; cursor:pointer; font-weight:bold;">-</button>
                        <span>${item.qtd}</span>
                        <button onclick="alterarQtd('${item.cidade}', 1)" style="background:none; border:none; color:white; cursor:pointer; font-weight:bold;">+</button>
                    </div>
                    <strong style="min-width: 100px; text-align: right;">R$ ${subtotalItem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
            </div>
        `;
    }).join('');

    totalDisplay.innerText = totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

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
}

// --- 2. CONTROLE DE ABAS (PIX, CARTÃO, BOLETO) ---

function changeTab(method) {
    const cardArea = document.getElementById('card-area');
    const pixContent = document.getElementById('pix-content');
    const boletoContent = document.getElementById('boleto-content');
    const btnAlternativo = document.getElementById('btn-container-alternativo');

    cardArea.style.display = method === 'card' ? 'block' : 'none';
    pixContent.style.display = method === 'pix' ? 'block' : 'none';
    boletoContent.style.display = method === 'boleto' ? 'block' : 'none';
    
    // Mostra o botão extra na coluna da esquerda se não for cartão
    btnAlternativo.style.display = method === 'card' ? 'none' : 'block';
}

// --- 3. INTERAÇÃO DO CARTÃO EM TEMPO REAL ---

const cardInnerCredit = document.getElementById('card-inner-credit');

document.getElementById('input-number').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, ''); 
    v = v.replace(/(\d{4})(?=\d)/g, '$1 '); 
    e.target.value = v;
    document.getElementById('display-number').innerText = v || "#### #### #### ####";
    
    // Detecção de Bandeiras
    const rawNumber = v.replace(/\s/g, '');
    const cardBrandDisplay = document.getElementById('card-brand');
    
    if (/^4/.test(rawNumber)) {
        cardBrandDisplay.innerHTML = '<i class="fa-brands fa-cc-visa"></i> VISA';
        cardBrandDisplay.style.color = "#1a1f71";
    } else if (/^5[1-5]|^2[2-7]/.test(rawNumber)) {
        cardBrandDisplay.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i> MASTER';
        cardBrandDisplay.style.color = "#eb001b";
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
inputCVV.addEventListener('focus', () => cardInnerCredit.style.transform = 'rotateY(180deg)');
inputCVV.addEventListener('blur', () => cardInnerCredit.style.transform = 'rotateY(0deg)');
inputCVV.addEventListener('input', (e) => {
    document.getElementById('display-cvv').innerText = e.target.value || "***";
});

// Máscaras de CPF e Telefone
document.getElementById('cliente-tel').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = v;
});

document.getElementById('cliente-cpf').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
});

// --- 4. FINALIZAÇÃO COM MODAL ---

function finalizarPagamentoInterno() {
    const nome = document.getElementById('cliente-nome').value;
    const email = document.getElementById('cliente-email').value;
    const carrinho = JSON.parse(localStorage.getItem('carrinho_aero')) || [];

    if (!nome || !email) {
        alert("Por favor, preencha seus dados de identificação.");
        return;
    }

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Feedback visual no botão
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;

    setTimeout(() => {
        // Preenche o modal
        document.getElementById('modal-cliente-nome').innerText = nome;
        document.getElementById('modal-cliente-email').innerText = email;
        
        // Abre o modal
        document.getElementById('modal-sucesso').style.display = 'flex';
        
        // Limpa tudo
        localStorage.removeItem('carrinho_aero');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarResumoReserva();
});