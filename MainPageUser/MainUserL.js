document.addEventListener("DOMContentLoaded", function () {
    const fotoPerfil = document.querySelector(".Foto");
    const perfilOptions = document.querySelector(".perfil-options");

    perfilOptions.style.display = "none";

    fotoPerfil.addEventListener("click", function () {
        perfilOptions.style.display = perfilOptions.style.display === "none" ? "flex" : "none";

        // Ajustar para centrar horizontalmente
        const rect = fotoPerfil.getBoundingClientRect();
        const optionsRect = perfilOptions.getBoundingClientRect();
        const leftOffset = rect.left + rect.width / 2 - optionsRect.width / 2;
        
        perfilOptions.style.position = "fixed";
        perfilOptions.style.top = `${rect.bottom}px`;
        perfilOptions.style.left = `${leftOffset}px`;
    });

    document.addEventListener("click", function (event) {
        const target = event.target;
        if (!target.closest(".FotoPerfil") && target !== fotoPerfil) {
            perfilOptions.style.display = "none";
        }
    });
});
