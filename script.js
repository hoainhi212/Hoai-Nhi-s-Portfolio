const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

const menuLinks = document.querySelectorAll(".menu a");


// Open / close menu

menuButton.addEventListener("click", () => {

    menu.classList.toggle("active");

});


// Close menu when clicking a link

menuLinks.forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");

    });

});