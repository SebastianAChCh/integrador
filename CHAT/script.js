// Obtén elementos del DOM
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatMessages = document.getElementById("chat-messages");
const chatTitle = document.querySelector(".chat-header h2");
const userList = document.querySelectorAll(".user");

// Objeto para almacenar los mensajes por usuario
const userMessages = {};

// Agrega un evento clic a cada elemento de usuario en la lista de chats
userList.forEach((user) => {
  user.addEventListener("click", () => {
    const userName = user.textContent.trim();
    changeChat(userName);
  });
});

// Función para mostrar una previsualización de la imagen adjunta
function displayImagePreview(messageData, isSent) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  const img = document.createElement("img");
  img.src = messageData.url;
  img.classList.add("image-preview");
  if (isSent) {
    img.classList.add("sent-image");
  } else {
    img.classList.add("received-image");
  }

  messageContainer.appendChild(img);
  chatMessages.appendChild(messageContainer);

  img.addEventListener("click", () => {
    openImagePopup(messageData.url);
  });
}

// Función para abrir la vista emergente de imagen
function openImagePopup(imageUrl) {
  const imagePopup = document.getElementById("image-popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.src = imageUrl;
  imagePopup.style.display = "block";
}

// Función para cerrar la vista emergente de imagen
function closeImagePopup() {
  const imagePopup = document.getElementById("image-popup");
  const popupContent = document.getElementById("popup-content");
  popupContent.src = "";
  imagePopup.style.display = "none";
}

// Agregar manejador de eventos para cerrar la vista emergente al hacer clic en la "X"
const closePopup = document.getElementById("close-popup");
closePopup.addEventListener("click", closeImagePopup);

// Función para cambiar de chat y cargar los mensajes existentes
function changeChat(userName) {
  // Cambia el título del chat al nombre del usuario
  chatTitle.textContent = "Chat con " + userName;

  // Borra los mensajes anteriores del área de mensajes
  chatMessages.innerHTML = "";

  // Carga los mensajes existentes del usuario, si los hay
  if (userMessages[userName]) {
    userMessages[userName].forEach((message) => {
      displayMessage(message);
    });
  }
}

// Función para mostrar un mensaje en el área de mensajes
function displayMessage(messageData) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  if (messageData.type === "file") {
    const fileLink = document.createElement("a");
    fileLink.href = messageData.url;
    fileLink.target = "_blank";
    fileLink.textContent = "Archivo Adjunto: " + messageData.fileName;
    messageContainer.appendChild(fileLink);
  } else if (messageData.type === "image") {
    const img = document.createElement("img");
    img.src = messageData.url;
    img.classList.add("image-preview");
    messageContainer.appendChild(img);
  } else {
    const messageElement = document.createElement("div");
    messageElement.textContent = messageData.text;
    messageElement.classList.add("message");
    messageElement.classList.add("sent-message");
    messageContainer.appendChild(messageElement);
  }

  chatMessages.appendChild(messageContainer);
}

// Escucha el evento clic en el botón de enviar
sendButton.addEventListener("click", () => {
  const messageText = messageInput.value.trim();
  if (messageText !== "") {
    const userName = chatTitle.textContent.replace("Chat con ");

    // Guarda el mensaje en el objeto userMessages
    if (!userMessages[userName]) {
      userMessages[userName] = [{ text: messageText, type: "text" }];
    } else {
      userMessages[userName].push({ text: messageText, type: "text" });
    }

    displayMessage({ text: messageText, type: "text" });
    messageInput.value = "";
  }
});

// Resto del código para el input de archivo y adjuntar archivos, igual que en el ejemplo anterior

// Crear el elemento input de archivo
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.id = "file-input";
fileInput.style.display = "none"; // Ocultar el input de archivo inicialmente

// Agregar el elemento fileInput al documento
document.body.appendChild(fileInput);

// Obtener el botón de adjuntar por su ID
const attachButton = document.getElementById("attach-button");

// Escuchar el clic en el botón de adjuntar
attachButton.addEventListener("click", () => {
  fileInput.click(); // Al hacer clic en el botón de adjuntar, activamos el input de archivo
});

// Escuchar el cambio en el input de archivo
fileInput.addEventListener("change", () => {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    const userName = chatTitle.textContent.replace("Chat con ");

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const dataURL = event.target.result;

        const messages = userMessages[userName] || [];
        messages.push({
          type: "image",
          url: dataURL,
          fileName: selectedFile.name,
        });
        userMessages[userName] = messages;

        displayMessage({
          type: "image",
          url: dataURL,
          fileName: selectedFile.name,
        });
      };

      reader.readAsDataURL(selectedFile);
    } else {
      const messages = userMessages[userName] || [];
      messages.push({
        type: "file",
        url: URL.createObjectURL(selectedFile),
        fileName: selectedFile.name,
      });
      userMessages[userName] = messages;

      displayMessage({
        type: "file",
        url: URL.createObjectURL(selectedFile),
        fileName: selectedFile.name,
      });
    }

    // Limpiar el valor del input de archivo para permitir la selección de múltiples archivos
    fileInput.value = "";
  }
});
