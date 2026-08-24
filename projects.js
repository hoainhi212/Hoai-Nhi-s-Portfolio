const menuButton = document.getElementById("menuButton");
const menuPanel = document.getElementById("menuPanel");

menuButton.addEventListener("click", function () {

    menuPanel.classList.toggle("open");

});


document.addEventListener("click", function (event) {

    if (
        !menuButton.contains(event.target) &&
        !menuPanel.contains(event.target)
    ) {

        menuPanel.classList.remove("open");

    }

});