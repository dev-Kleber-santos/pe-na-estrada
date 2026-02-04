// Configuração Global do Google
const GOOGLE_CLIENT_ID = "1029751874127-knqsj2vj48g1q3qg2pjs37k0ekgc38eu.apps.googleusercontent.com";

// Função para decodificar o Token (JWT)
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

// Função executada após o login com sucesso
function handleGoogleResponse(response) {
    const payload = parseJwt(response.credential);
    
    // Salva os dados no localStorage
    localStorage.setItem('usuario_logado', JSON.stringify({
        nome: payload.name,
        email: payload.email,
        foto: payload.picture
    }));

    // Se estiver na página de pagamento, preenche os inputs automaticamente
    const inputNome = document.getElementById('cliente-nome');
    const inputEmail = document.getElementById('cliente-email');
    
    if (inputNome && inputEmail) {
        inputNome.value = payload.name;
        inputEmail.value = payload.email;
    } else {
        // Se for a página de login, manda para a home
        window.location.href = "../index.html";
    }
}

// Inicializa o Google One Tap ou Botão
function inicializarGoogle(elementId) {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
    });
    
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
        google.accounts.id.renderButton(targetElement, {
            theme: "outline",
            size: "large",
            width: "100%"
        });
    }
}