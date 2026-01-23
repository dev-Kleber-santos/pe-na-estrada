// Função para trocar abas de pagamento
function changeTab(method) {
    document.getElementById('card-area').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('pix-content').style.display = method === 'pix' ? 'block' : 'none';
    document.getElementById('boleto-content').style.display = method === 'boleto' ? 'block' : 'none';
}

const cardInner = document.getElementById('card-inner-credit');

// 1. Máscara e exibição do Número
document.getElementById('input-number').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    v = v.replace(/(\d{4})(?=\d)/g, '$1 '); // Adiciona espaço a cada 4 números
    e.target.value = v;
    document.getElementById('display-number').innerText = v || "#### #### #### ####";
    
    // Detecta Bandeira (Simples)
    const brand = v.startsWith('4') ? 'VISA' : v.startsWith('5') ? 'MASTERCARD' : 'VISA';
    document.getElementById('card-brand').innerText = brand;
});

// 2. Exibição do Nome
document.getElementById('input-name').addEventListener('input', (e) => {
    document.getElementById('display-name').innerText = e.target.value.toUpperCase() || "NOME NO CARTÃO";
});

// 3. Máscara de Validade (MM/AA)
document.getElementById('input-expiry').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.substring(0,2) + '/' + v.substring(2,4);
    e.target.value = v;
    document.getElementById('display-expiry').innerText = v || "MM/AA";
});

// 4. Lógica do CVV e GIRO do cartão
const inputCVV = document.getElementById('input-cvv');

inputCVV.addEventListener('focus', () => {
    cardInner.style.transform = 'rotateY(180deg)';
});

inputCVV.addEventListener('blur', () => {
    cardInner.style.transform = 'rotateY(0deg)';
});

inputCVV.addEventListener('input', (e) => {
    document.getElementById('display-cvv').innerText = e.target.value || "***";
});