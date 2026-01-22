class MobileNavbar {
    constructor(mobileMenu, navList, navLinks){
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList= document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
    }

    animateLinks(){
        this.navLinks.forEach((link, index) =>{
            link.style.animation
               ?(link.style.animation = "")
               :(link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`);
               
        });
    }

    handleClick() {
        console.log(this);
        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass);
        this.animateLinks();
    }

    
    addClickEvent(){
        this.mobileMenu.addEventListener("click", this.handleClick);
    }
    Init(){
        if(this.mobileMenu){
            this.addClickEvent();
        }
        return this;
    }
}

const mobileNavbar = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li",
);

mobileNavbar.Init();

// Seleciona todos os botões dentro dos cards
document.querySelectorAll('.card .btn').forEach(button => {
    button.addEventListener('click', () => {
        // Encontra o elemento interno do card e alterna a classe flipped
        const cardInner = button.closest('.card-inner');
        cardInner.classList.toggle('flipped');
    });
});