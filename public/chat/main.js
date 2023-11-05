import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

const socket = io();

const users = document.getElementById('users');
const containerForm = document.getElementById('chat');
const messages = document.getElementById('messages');

let userEmail = null;

for (let i = 0; i < document.cookie.split(';').length; i++)
  if (document.cookie.split(';')[i].startsWith(' useEmail'))
    userEmail = document.cookie.split(';')[i].split('=')[1].replace('%40', '@');

const loadUser = (user) => {
  users.innerHTML += `<li>${user}</li>`;
};

const loadMessage = (message) => {
  messages.innerHTML += `<li>${message}</li>`;
};

const openNewChat = () => {
  const NewUser = document.getElementById('NewUser');

  if (NewUser) {
    containerForm.innerHTML = `
        <form id='formChat'>
          <input type='text' name='message' />
          <input type='submit' value='send message' />
        </form>`;

    const formChat = document.getElementById('formChat');

    formChat.addEventListener('submit', (e) => {
      e.preventDefault();

      if (e.target.message.value) {
        socket.emit('message', {
          receiver: NewUser.innerText,
          sender: userEmail,
          message: e.target.message.value,
        });
      }
    });
  }
};

socket.emit('connected', { userEmail });

socket.on('messageTo', (data) => {
  loadMessage(data);
  console.log('se envio un dato', data);
});

openNewChat();
