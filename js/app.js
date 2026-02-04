// Seleção dos elementos para a animação
var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");
var body = document.querySelector("body");

// Mantendo as tuas funções de animação originais
if (btnSignin) {
    btnSignin.addEventListener("click", function () {
        body.className = "sign-in-js";
    });
}

if (btnSignup) {
    btnSignup.addEventListener("click", function () {
        body.className = "sign-up-js";
    });
}

// Lógica do formulário de login padrão
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("Login realizado com sucesso!");
        window.location.href = "../index.html"; 
    });
}

// INICIALIZAÇÃO DO GOOGLE E EVENTOS DE CARREGAMENTO
window.onload = () => {
    // 1. Configuração do Google OAuth
    google.accounts.id.initialize({
        client_id: "1029751874127-knqsj2vj48g1q3qg2pjs37k0ekgc38eu.apps.googleusercontent.com",
        callback: handleGoogleResponse,
        ux_mode: "popup" 
    });

    // 2. Opções visuais do botão (Estilo Shopee)
    const options = { 
        type: "standard",    
        shape: "rectangular",
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: "250",
        logo_alignment: "left" 
    };

    // 3. Renderização nos containers do teu HTML
    const signupBtn = document.getElementById("google-auth-signup");
    const loginBtn = document.getElementById("google-auth-login");

    if (signupBtn) google.accounts.id.renderButton(signupBtn, options);
    if (loginBtn) google.accounts.id.renderButton(loginBtn, options);
    
    // Ativa o prompt flutuante opcional
    google.accounts.id.prompt();
};