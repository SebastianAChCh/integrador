import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

const socket = io();

const usersContainer = document.getElementById('users');
const containerForm = document.getElementById('chat');
const messages = document.getElementById('messages');

let userEmail = null;
let messagesStored = {};

for (let i = 0; i < document.cookie.split(';').length; i++)
  if (document.cookie.split(';')[i].startsWith(' useEmail'))
    userEmail = document.cookie.split(';')[i].split('=')[1].replace('%40', '@');

const loadUser = (user) => {
  let users = [];

  !users.some((userStore) => userStore === user) && users.push(user);

  if (users.length !== 0) {
    usersContainer.innerHTML = '';

    users.forEach((userStore) => {
      usersContainer.innerHTML += `<li><button>${userStore}</button></li>`;
    });
  }
};

const loadMessage = (message, receiver, sender) => {
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

socket.on('messageTo', ({ message, sender, receiver }) => {
  loadUser(sender);
});

openNewChat();
