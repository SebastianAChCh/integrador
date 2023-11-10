document.addEventListener("DOMContentLoaded", function () {
    const categoriasLink = document.getElementById("categorias-link");
    const submenu = document.getElementById("submenu");
    const publicacionesLista = document.getElementById("publicacionesLista");
    const vendedoresLista = document.getElementById("vendedoresLista");
    const searchBox = document.getElementById("searchBox");
    const temp = document.getElementById("temp")

    searchBox.style.display = "flex";
    submenu.style.display = "none";
    publicacionesLista.style.display = "none"; 
    vendedoresLista.style.display = "none"; 

    categoriasLink.addEventListener("click", function (event) {
       
        searchBox.style.display = searchBox.style.display === "none" ? "flex" : "none";
        submenu.style.display = submenu.style.display === "none" ? "flex" : "none";
            temp.style.display = temp.style.display ===  "none" ? "block" : "none";

       
        if (searchBox.style.display === "flex") {
            publicacionesLista.style.display = "none";
            vendedoresLista.style.display = "none";
        }

        event.stopPropagation();
    });

   
    const publicacionesLink = document.getElementById("publicacionesLink");
    const vendedoresLink = document.getElementById("vendedoresLink");

    publicacionesLink.addEventListener("click", function (event) {
        vendedoresLista.style.display = "none";
        publicacionesLista.style.display = publicacionesLista.style.display === "none" ? "flex" : "none";

        event.stopPropagation(); 
    });

    vendedoresLink.addEventListener("click", function (event) {
        publicacionesLista.style.display = "none";
        vendedoresLista.style.display = vendedoresLista.style.display === "none" ? "flex" : "none";

        event.stopPropagation(); 
    });

   
    document.addEventListener("click", function (event) {
        const target = event.target;
        if (
            !target.closest("#submenu") &&
            target !== categoriasLink &&
            target !== publicacionesLink &&
            target !== vendedoresLink &&
            !target.closest(".categorias-lista")
        ) {
            searchBox.style.display = "flex";
            submenu.style.display = "none";
            publicacionesLista.style.display = "none";
            vendedoresLista.style.display = "none";
            temp.style.display = "none";
        }
    });
});