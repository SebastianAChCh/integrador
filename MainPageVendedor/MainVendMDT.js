document.addEventListener("DOMContentLoaded", function () {
    // Obtener todas las instancias de la clase 'infopubli' (contenedores de información de publicaciones)
    const infopubliContainers = document.querySelectorAll('.infopubli');

    // Límite de caracteres para el título
    const limiteCaracteresTitulo = 10;

    // Límite de caracteres para la descripción
    const limiteCaracteresDescripcion = 50;

    // Iterar sobre cada contenedor de información de publicación
    infopubliContainers.forEach(function (infopubliContainer) {
        // Obtener el elemento del título dentro del contenedor
        const tituloElement = infopubliContainer.querySelector('.titulop');

        // Truncar el título si es necesario
        if (tituloElement.innerText.length > limiteCaracteresTitulo) {
            const tituloTruncado = tituloElement.innerText.substring(0, limiteCaracteresTitulo - 3) + "...";
            tituloElement.innerText = tituloTruncado;
        }

        // Obtener el elemento de la descripción dentro del contenedor
        const descripcionElement = infopubliContainer.querySelector('.descripcionp');

        // Truncar la descripción si es necesario
        if (descripcionElement.innerText.length > limiteCaracteresDescripcion) {
            const descripcionTruncada = descripcionElement.innerText.substring(0, limiteCaracteresDescripcion - 3) + "...";
            descripcionElement.innerText = descripcionTruncada;
        }
    });
});