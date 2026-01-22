class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
    }

    animateLinks() {
        this.navLinks.forEach((link, index) => {
            link.style.animation
                ? (link.style.animation = "")
                : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`);
        });
    }

    handleClick() {
        // Verifica se os elementos existem antes de tentar alternar classes
        if (this.navList && this.mobileMenu) {
            this.navList.classList.toggle(this.activeClass);
            this.mobileMenu.classList.toggle(this.activeClass);
            this.animateLinks();
        }
    }

    addClickEvent() {
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener("click", this.handleClick);
        }
    }

    Init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }
}

// Inicializa o menu após o DOM estar carregado
document.addEventListener("DOMContentLoaded", () => {
    const mobileNavbar = new MobileNavbar(
        ".mobile-menu",
        ".nav-list",
        ".nav-list li",
    );
    mobileNavbar.Init();

    // Lógica dos Cards (Flip) - Melhorada para evitar erros
    document.querySelectorAll('.card .btn').forEach(button => {
        button.addEventListener('click', (event) => {
            // Previne que o clique dispare outras ações indesejadas
            event.preventDefault();
            
            // Tenta encontrar o .card-inner subindo a árvore do DOM
            const card = button.closest('.card');
            if (card) {
                const cardInner = card.querySelector('.card-inner');
                if (cardInner) {
                    cardInner.classList.toggle('flipped');
                }
            }
        });
    });
});