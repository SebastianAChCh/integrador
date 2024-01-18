const socket = io();

// Obtén elementos del DOM que ya han sido creados
const chatForm = document.getElementById('chat-form');
const backButton = document.querySelector('.back-button');
const chatTitle = document.querySelector('.chat-header h2');
const transactionComplete = document.getElementById('transactionComplete');

let messageInput;
let chatMessages;
let Form;
let createPayload;

//Aqui se guardaran los id de stripe de cada usuario para el manejo de los pagos
let titlePurchase = null;

let purchaser = null;

let seller = null;

//se guardara la cantidad a pagar
let quantityToPay = null;

//El usuario actual con el que este hablando el usuario
let currentUser = '';

//Sera true si estamos en un nuevo usuario, false si no es asi
let newUser = false;

//Lugar donde se almacenaran los usuarios que enviaron mensajes
let Contacts = [];

//Obtener el correo electronico almacenado en las cookies
let userEmail = null;

//Obten el correo electronico del usuario de las cookies
for (let i = 0; i < document.cookie.split(';').length; i++) {
  if (document.cookie.split(';')[i].startsWith(' userEmail'))
    userEmail = document.cookie.split(';')[i].split('=')[1].replace('%40', '@');
}

//Funcion para guardar los contactos o usuarios que te mandaron mensajes anteriormente
const saveContact = (email, User) =>
  !Contacts.some((user) => user.Email === email) && Contacts.push(User);

//Se encargara manejar los mensajes, es decir, de asegurarse de enviarlo, mostrarlos y alamcenarlos en la base de datos
//siempre y cuando estos sean texto, de lo contrario, otra funcion sera la encargada del manejo de ese tipo de mensajes
const handleSendMessages = (receiver) => {
  addEventToEachUser();

  Form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (e.target.messageInput.value) {
      const messageText = e.target.messageInput.value.trim();

      let container = 'message-container',
        child = 'sent-message';

      displayMessage({ text: messageText, type: 'text', container, child });

      socket.emit('message', {
        receiver: receiver,
        sender: userEmail,
        message: e.target.messageInput.value,
        type: 'text',
      });

      saveMessagesDB({
        receiver: receiver,
        sender: userEmail,
        message: e.target.messageInput.value,
        type: 'text',
      });

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    messageInput.value = '';
  });
};

//Esta funcion sera la encargada de cuando se entre a un nuevo chat, cargar el formulario, y cuando se le abra un chat a un vendedor
//cargar en automatico el formulario para el envio de mensajes
const loadForm = () => {
  chatForm.innerHTML = `
  <button class="attach-button" id="attach-button">+</button>
  <form id="form" class="form">
  <input type="text" name="messageInput" id="message-input" placeholder="Escribe un mensaje..."/>
  <input type="submit" value="Send" id="send-button" />
  </form>`;

  //Obtenemos todos los elementos del formulario
  Form = document.getElementById('form');
  const attachButton = document.getElementById('attach-button');

  attachButton.addEventListener('click', () => fileInput.click());

  messageInput = document.getElementById('message-input');
  chatMessages = document.getElementById('chat-messages');

  handleSendMessages(currentUser);
};

//funcion flecha para cargar los mensajes que fueron enviados con anterioridad
const loadMessages = async (email) => {
  const messagesResponse = await fetch(`${location.origin}/loadMessages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      me: userEmail,
      other: email,
    }),
  });

  const messages = await messagesResponse.json();

  //Si no existen mensajes, entonces sal de la funcion, de lo contrario, dara un error
  if (messages.messages === '') return;

  let container = '',
    child = '';

  chatMessages.innerHTML = '';

  //SI existen mensajes, distingue cuales envio el usuario actual y cuales le enviaron al usuario actual
  messages.messages.forEach((message) => {
    if (message.EMAIL_SENDER === userEmail) {
      container = 'message-container';
      child = 'sent-message';
    } else {
      container = 'received-container';
      child = 'received-message';
    }

    //Dependiendo de que tipo de mensaje fue, se mostrara de distintas maneras
    if (message.Type === 'image') {
      displayMessage({
        url: '..\\' + message.Message.slice(7),
        type: 'image',
        container,
        child,
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else if (message.Type === 'file') {
      displayMessage({
        url: '..\\' + message.Message.slice(7),
        type: 'file',
        fileName: message.OriginalName,
        container,
        child,
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      displayMessage({
        text: message.Message,
        type: 'text',
        container,
        child,
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
};

// Función para cambiar de chat y cargar los mensajes existentes, si es que existen, claro
const changeChat = async (userName, email) => {
  chatTitle.textContent = 'Chat with ' + userName;

  currentUser = email;

  loadForm();

  chatMessages.innerHTML = '';

  loadMessages(email);
  chatTitle.classList.remove('disspear');
};

// Agrega un evento clic a cada elemento de usuario en la lista de chats
const addEventToEachUser = () => {
  const userList = document.querySelectorAll('.user');

  userList.forEach((user) => {
    user.addEventListener('click', () => {
      const userName = user.textContent.trim();
      changeChat(userName, user.getAttribute('email'));
    });
  });
};

//Funcion para cargar los datos del usuario que te envio un mensaje
const loadUserData = async (email) => {
  const chatList = document.getElementById('chat-list');
  const response = await fetch(`${location.origin}/userData/${email}`, {
    method: 'GET',
  });

  const data = await response.json();

  data.userInfo.forEach((user) => {
    saveContact(user.Email, user);
    chatList.innerHTML += `
    <li id="user" isNew="false" email="${user.Email}" class="user">
      <img src="${
        newUser ? '../' + user.AVATAR : '../' + user.AVATAR
      }" class="imagen" alt="Imagen de el Usuario ${user.Names}" />
      ${user.Names}
    </li>`;
  });

  addEventToEachUser();
};

//Cargar los usuarios que le mandaron mensaje anteriormente
const loadUsers = async (email) => {
  const response = await fetch(`${location.origin}/loadContacts/${email}`, {
    method: 'GET',
  });

  const data = await response.json();

  if (data.users === '') return;

  data.users.forEach(
    (user) =>
      !Contacts.some(
        (contact) =>
          contact.EMAIL_SENDER === user.EMAIL_SENDER ||
          contact.EMAIL_RECEIVER === user.EMAIL_SENDER
      ) && Contacts.push(user)
  );

  Contacts = Contacts.map((contact) =>
    contact.EMAIL_RECEIVER === userEmail
      ? { Email: contact.EMAIL_SENDER }
      : { Email: contact.EMAIL_RECEIVER }
  );

  Contacts.forEach((contact) => loadUserData(contact.Email));
  chatTitle.innerText = 'Chats';
  chatTitle.classList.add('disspear');
};

//Funcion para guardar los mensajes en la base de datos
const saveMessagesDB = async (data) => {
  if (data.type === 'text') {
    await fetch(`${location.origin}/saveMessages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiver: data.receiver,
        sender: data.sender,
        message: data.message,
        type: data.type,
      }),
    });
  } else {
    const formData = new FormData();

    formData.append('receiver', data.receiver);
    formData.append('sender', data.sender);
    formData.append('type', data.type);
    formData.append('file', data.message);

    const fileResponse = await fetch(`${location.origin}/saveFiles`, {
      method: 'POST',
      body: formData,
    });

    const file = await fileResponse.json();

    return file;
  }
};

// Función para mostrar un mensaje en el área de mensajes
const displayMessage = (messageData) => {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add(messageData.container);

  if (messageData.type === 'file') {
    const fileLink = document.createElement('a');
    fileLink.href = '../' + messageData.url;
    fileLink.target = '_blank';
    fileLink.textContent = 'Archivo Adjunto: ' + messageData.fileName;
    messageContainer.appendChild(fileLink);
  } else if (messageData.type === 'image') {
    const img = document.createElement('img');
    if (messageData.url.startsWith('blob:')) {
      messageData.url = messageData.url.slice(5);
    }
    img.src = messageData.url;
    img.classList.add('image-preview');
    img.classList.add(messageData.child);
    img.classList.add('openDialog');
    messageContainer.appendChild(img);
  } else if (messageData.type === 'html') {
    const containerForm = document.createElement('button');
    containerForm.classList.add('message');
    containerForm.classList.add(messageData.child);
    containerForm.innerText = 'pay';
    containerForm.addEventListener('click', (e) => {
      e.preventDefault();
      transactionComplete.showModal();

      const transaction = document.getElementById('transaction');

      transaction.addEventListener('click', (e) => {
        const modalDimensions = transaction.getBoundingClientRect();
        if (
          e.clientX < modalDimensions.left ||
          e.clientX > modalDimensions.right ||
          e.clientY < modalDimensions.top ||
          e.clientY > modalDimensions.bottom
        ) {
          transaction.close();
        }
      });

      transaction.addEventListener('submit', async (e) => {
        e.preventDefault();
        const response = await fetch(`${location.origin}/savePurchaseSales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            seller,
            purchaser,
            title: titlePurchase,
            quantity: quantityToPay,
          }),
        });

        const data = await response.json();

        if (data.response === 'ok') {
          transactionComplete.close();
          location.reload();
        }
      });
    });
    messageContainer.appendChild(containerForm);
  } else {
    const messageElement = document.createElement('div');
    messageElement.textContent = messageData.text;
    messageElement.classList.add('message');
    messageElement.classList.add(messageData.child);
    messageContainer.appendChild(messageElement);
  }

  chatMessages.appendChild(messageContainer);

  const openDialogImg = document.querySelectorAll('.openDialog');

  openDialogImg.forEach((image) => {
    const modal = document.getElementById('image-popups');
    image.addEventListener('click', (e) => {
      modal.innerHTML = `<img heigh='200px' width='200px' src='${e.target.currentSrc}'>`;
      modal.showModal();
    });

    modal.addEventListener('click', (e) => {
      const modalDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < modalDimensions.left ||
        e.clientX > modalDimensions.right ||
        e.clientY < modalDimensions.top ||
        e.clientY > modalDimensions.bottom
      ) {
        modal.close();
      }
    });
  });
};

//Cuando el usuario entre al chat, emite un connected con su correo
socket.emit('connected', userEmail);

socket.on('formPayment', async ({ sender, receiver, title, amount }) => {
  !Contacts.some(
    (users) => users.Email === sender || users.Email === receiver
  ) && loadUserData(sender);

  let container = 'received-container',
    child = 'received-message';

  seller = sender;
  purchaser = receiver;
  titlePurchase = title;
  quantityToPay = amount;

  if (sender === currentUser) {
    displayMessage({ text: amount, type: 'html', container, child });
  }
});

//Cuando se reciba un mensaje, guardalo y muestralo
socket.on(
  'messageTo',
  async ({ receiver, sender, message, type, fileName }) => {
    !Contacts.some(
      (users) => users.Email === sender || users.Email === receiver
    ) && loadUserData(sender);

    let container = 'received-container',
      child = 'received-message';

    if (sender === currentUser) {
      if (type === 'text') {
        displayMessage({ text: message, type, container, child });
      } else if (type === 'file') {
        displayMessage({
          url: message.slice(7),
          type,
          fileName,
          container,
          child,
        });
      } else {
        displayMessage({
          url: message,
          type,
          container,
          child,
        });
      }

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
);

//Carga los contanctos que le mandaron mensajes
loadUsers(userEmail);

//Verifica si el usuario abrio un chat por primera vez a alguien
const usersList = document.querySelectorAll('.user');

usersList.forEach(async (user) => {
  if (user.getAttribute('isNew') === 'true') {
    currentUser = user.innerText;
    const userExistResponse = await fetch(`${location.origin}/loadMessages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        me: userEmail,
        other: currentUser,
      }),
    });

    const userExist = await userExistResponse.json();

    if (userExist.messages !== '') {
      const userDelete = document.querySelector('.newUser');
      userDelete.remove();
      return;
    }

    const response = await fetch(`${location.origin}/userData/${currentUser}`, {
      method: 'GET',
    });

    const data = await response.json();
    document.querySelector('.chat-header h2').innerText =
      data.userInfo[0].Names;
    Contacts.push({ Email: data.userInfo[0].Email });
    user.innerHTML = `<img src="../avatar/userDefault.png" class="imagen" alt="Imagen de Usuario 1"/>${data.userInfo[0].Names}`;
    newUser = true;
    loadForm();
  }
});

//Para retroceder a la anterior pagina
backButton.addEventListener('click', () => history.back());

// Resto del código para el input de archivo y adjuntar archivos, igual que en el ejemplo anterior

// Crear el elemento input de archivo
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'file-input';
fileInput.style.display = 'none'; // Ocultar el input de archivo inicialmente

// Agregar el elemento fileInput al documento
document.body.appendChild(fileInput);

// Escuchar el cambio en el input de archivo
fileInput.addEventListener('change', async () => {
  let container = 'message-container',
    child = 'sent-message';

  const selectedFile = fileInput.files[0];

  if (selectedFile) {
    if (selectedFile.type.startsWith('image/')) {
      saveMessagesDB({
        receiver: currentUser,
        sender: userEmail,
        message: selectedFile,
        type: 'image',
      });

      //Cuando una imagen sea enviada o se este cargando de la base de datos, entonces muestrala a los usuarios
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target.result;

        displayMessage({
          type: 'image',
          url: dataURL,
          fileName: selectedFile.name,
          container,
          child,
        });

        socket.emit('message', {
          receiver: currentUser,
          sender: userEmail,
          message: dataURL,
          type: 'image',
        });
      };

      reader.readAsDataURL(selectedFile);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      const file = await saveMessagesDB({
        receiver: currentUser,
        sender: userEmail,
        message: selectedFile,
        type: 'file',
      });

      displayMessage({
        type: 'file',
        url: URL.createObjectURL(selectedFile),
        fileName: selectedFile.name,
        container,
        child,
      });

      socket.emit('message', {
        receiver: currentUser,
        sender: userEmail,
        fileName: selectedFile.name,
        message: file.file,
        type: 'file',
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Limpiar el valor del input de archivo para permitir la selección de múltiples archivos
    fileInput.value = '';
  }
});
