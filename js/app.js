
var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");

var body = document.querySelector("body");

btnSignin.addEventListener("click", function () {
    body.className = "sign-in-js";
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
});

// Dentro do seu app.js
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aqui você faria a validação de e-mail e senha
        console.log("Login realizado com sucesso!");

        // Redireciona para a página inicial
        window.location.href = "index.html"; 
    });
}