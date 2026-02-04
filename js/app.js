var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");
var body = document.querySelector("body");

btnSignin.addEventListener("click", function () {
    body.className = "sign-in-js";
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("Login realizado com sucesso!");
        window.location.href = "../index.html"; 
    });
}

// INICIALIZAÇÃO DO GOOGLE
window.onload = () => {
    google.accounts.id.initialize({
        client_id: "1029751874127-knqsj2vj48g1q3qg2pjs37k0ekgc38eu.apps.googleusercontent.com", //
        callback: handleGoogleResponse
    });

    const options = { 
        type: "standard",    
        shape: "rectangular",
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: "250",
        logo_alignment: "left" 
    };

    // Renderiza nos dois locais
    google.accounts.id.renderButton(document.getElementById("google-auth-signup"), options);
    google.accounts.id.renderButton(document.getElementById("google-auth-login"), options);
};