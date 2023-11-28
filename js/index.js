const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];

// Variáveis para controle do estado do arrastar (drag)
let isDragging = false, startX, startScrollLeft, timeoutId;

// Calcula o número de cartões visíveis no carrossel com base na largura do carrossel e do primeiro card
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Coloca os últimos cardPerView cartões no início do carrossel, para criar um efeito de ciclo infinito
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Coloca os primeiros cardPerView cartões no final do carrossel, para criar um efeito de ciclo infinito
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Adiciona event listeners para os botões de seta
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
});

// Função chamada quando o mouse é pressionado sobre o carrossel
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");

    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

// Função chamada quando o mouse é movido sobre o carrossel enquanto pressionado
const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

// Função chamada quando o mouse é solto após o arrastar
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

// Função que inicia a reprodução automática do carrossel
const autoPlay = () => {
    if (window.innerWidth < 800) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}

// Inicia a reprodução automática
autoPlay();

// Função que gerencia o efeito de ciclo infinito ao rolar o carrossel
const infiniteScroll = () => {
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Limpa o timeout para evitar múltiplas chamadas da função autoPlay
    clearTimeout(timeoutId);

    // Inicia a reprodução automática novamente, a menos que o mouse esteja sobre o carrossel
    if (!wrapper.matches(":hover")) autoPlay();
}

// Adiciona event listeners para os eventos relacionados ao mouse e ao carrossel
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todas as divs dentro de elementos com a classe "techs"
    var techsDivs = document.querySelectorAll('.techs div');

    // Adiciona event listeners para o mouse sobre as divs techs
    techsDivs.forEach(function (div) {
        div.addEventListener('mouseover', function () {
            // Adiciona a classe 'hovered' à div em que o mouse está sobre
            div.classList.add('hovered');

            // Adiciona a classe 'diminished' às outras divs
            techsDivs.forEach(function (otherDiv) {
                if (otherDiv !== div) {
                    otherDiv.classList.add('diminished');
                }
            });
        });

        // Adiciona event listeners para o mouse fora das divs techs
        div.addEventListener('mouseout', function () {
            // Remove a classe 'hovered' da div quando o mouse sai
            div.classList.remove('hovered');

            // Remove a classe 'diminished' de todas as divs
            techsDivs.forEach(function (otherDiv) {
                otherDiv.classList.remove('diminished');
            });
        });
    });
});


carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

carousel.addEventListener("scroll", infiniteScroll);



