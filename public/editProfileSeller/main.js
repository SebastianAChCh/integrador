// Obtener elementos DOM
const editNameBtn = document.getElementById('editname');
const editProfessionBtn = document.getElementById('editproffesion');
const editDescriptionBtn = document.getElementById('editdescripción');
const editPhotoBtn = document.getElementById('editphoto');
const photoElement = document.querySelector('.photo');
const returnBtn = document.querySelector('.return');
const deleteAccount = document.getElementById('deleteAccount');

// Función para manejar la edición del nombre
editNameBtn.addEventListener('click', () => {
  const nameElement = document.querySelector('.name');
  const newNameInput = createEditableElement(nameElement);
  applyStyles(newNameInput, nameElement); // Aplicar estilos
  replaceContent(nameElement, newNameInput);

  // Agregar event listener para el evento keydown
  newNameInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      console.log(newNameInput.value);
      await fetch(`${location.origin}/editSellerData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newNameInput.value,
        }),
      });
      nameElement.innerText = newNameInput.value;
    }
  });
});

// Función para manejar la edición de la profesión
editProfessionBtn.addEventListener('click', function () {
  const professionElement = document.querySelector('.proffession');
  const newProfessionInput = createEditableElement(professionElement);
  applyStyles(newProfessionInput, professionElement);
  replaceContent(professionElement, newProfessionInput);

  // Agregar event listener para el evento keydown
  newProfessionInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      await fetch(`${location.origin}/editSellerData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profession: newProfessionInput.value,
        }),
      });
      professionElement.innerText = newProfessionInput.value;
    }
  });
});

// Función para manejar la edición de la descripción
editDescriptionBtn.addEventListener('click', function () {
  const descriptionElement = document.querySelector('.description');
  const newDescriptionInput = createEditableElement(descriptionElement);
  applyStyles(newDescriptionInput, descriptionElement);
  replaceContent(descriptionElement, newDescriptionInput);

  // Agregar event listener para el evento keydown
  newDescriptionInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      await fetch(`${location.origin}/editSellerData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newDescriptionInput.value,
        }),
      });
      descriptionElement.innerText = newDescriptionInput.value;
    }
  });
});

// Función para manejar la edición de la foto de perfil
editPhotoBtn.addEventListener('click', function () {
  // Crear un elemento de entrada de archivos
  const formData = new FormData();
  const fileInput = document.createElement('input');
  fileInput.type = 'file';

  // Escuchar el evento de cambio en el archivo de entrada
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    formData.append('file', file);

    if (file) {
      // Crear un objeto de FileReader para leer la imagen seleccionada
      const reader = new FileReader();

      // Definir la lógica cuando se carga la imagen
      reader.onload = async (e) => {
        // Actualizar la imagen de perfil con la nueva imagen seleccionada
        await fetch(`${location.origin}/editSellerPhoto`, {
          method: 'POST',
          body: formData,
        });

        photoElement.src = e.target.result;
      };

      // Leer la imagen como una URL de datos
      reader.readAsDataURL(file);
    }
  });

  // Hacer clic en el elemento de entrada de archivos para abrir el cuadro de diálogo
  fileInput.click();
});

// Función para crear un elemento editable (input o textarea) según el tipo
function createEditableElement(originalElement) {
  const elementType = originalElement.tagName.toLowerCase();
  const newElement = document.createElement(
    elementType === 'div' ? 'textarea' : 'input'
  );
  newElement.value = originalElement.innerText;
  return newElement;
}

// Función para aplicar estilos al campo de entrada o área de texto
function applyStyles(inputElement, targetElement) {
  inputElement.style.width = '100%'; // Establecer el ancho al 100%
  inputElement.style.height = targetElement.offsetHeight + 'px';
  inputElement.style.fontSize = window.getComputedStyle(targetElement).fontSize;
  inputElement.style.backgroundColor =
    window.getComputedStyle(targetElement).backgroundColor;
  inputElement.style.color = window.getComputedStyle(targetElement).color;
  // Puedes agregar más estilos según sea necesario
}

// Función para reemplazar el contenido actual con el nuevo elemento
function replaceContent(targetElement, newElement) {
  targetElement.innerHTML = '';
  targetElement.appendChild(newElement);
  newElement.focus();
}

deleteAccount.addEventListener('click', (e) => {
  const dialogDeleteAccount = document.getElementById('dialogDeleteAccount');
  dialogDeleteAccount.showModal();

  const confirmDeleteAccount = document.getElementById('confirmDeleteAccount');
  confirmDeleteAccount.addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch(`${location.origin}/deleteAccount`, {
      method: 'GET',
    });
    const data = await response.json();

    if (data.status === 'ok') location.origin = '/';
    else console.log(data);
  });
});

returnBtn.addEventListener('click', () => {
  history.back();
});
