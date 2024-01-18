const editImg = document.getElementById('editImg');
const editName = document.getElementById('editName');
const deleteAccount = document.getElementById('deleteAccount');

editName.addEventListener('click', (e) => {
  const userName = document.getElementById('userName');
  userName.setAttribute('contenteditable', true);
  userName.classList.add('border');

  userName.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      userName.setAttribute('contenteditable', false);
      userName.classList.remove('border');
      const response = await fetch(`${location.origin}/editUserData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          names: e.target.innerText,
        }),
      });
      const data = await response.json();
    }
  });
});

editImg.addEventListener('click', () => {
  // Crear un elemento de entrada de archivos
  const formData = new FormData();
  const fileInput = document.createElement('input');
  fileInput.type = 'file';

  // Escuchar el evento de cambio en el archivo de entrada
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    formData.append('file', file);

    if (file) {
      // Crear un objeto de FileReader para leer la imagen seleccionada
      const reader = new FileReader();

      // Definir la lógica cuando se carga la imagen
      reader.onload = async (e) => {
        // Actualizar la imagen de perfil con la nueva imagen seleccionada
        await fetch(`${location.origin}/editUserPhoto`, {
          method: 'POST',
          body: formData,
        });

        document.getElementById('userProfile').src = e.target.result;
      };

      // Leer la imagen como una URL de datos
      reader.readAsDataURL(file);
    }
  });

  // Hacer clic en el elemento de entrada de archivos para abrir el cuadro de diálogo
  fileInput.click();
});

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

    if (data.status === 'ok') {
      document.cookie =
        'normalUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie =
        'Seller=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie =
        'userEmail=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      location.reload();
    } else console.log(data);
  });
});
