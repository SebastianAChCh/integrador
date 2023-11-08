import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { join } from 'path';
import Sessions from './routes/Sessions.routes.js';
import Post from './routes/Post.routes.js';
import FrontEnd from './routes/frontEnd.routes.js';
import Payments from './routes/payloads.routes.js';
import UserPublicData from './routes/userPublicData.routes.js';
import Messages from './routes/messages.routes.js';

const app = express();

const server = createServer(app);

const io = new Server(server, {
  connectionStateRecovery: {},
  maxHttpBufferSize: 1e8,
});

app.use(express.static(join(process.cwd(), 'public')));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), 'public'));
app.use(express.json());
app.use(cookieParser());
app.use(Payments);
app.use(Sessions);
app.use(Post);
app.use(Messages);
app.use(UserPublicData);
app.use(FrontEnd);

let users = [];

const addUser = (username, socketId) => {
  !users.some((user) => user.user === username) &&
    users.push({ user: username, socketId });
};

const deleteUsers = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on('connection', (socket) => {
  socket.on('connected', (email) => {
    addUser(email, socket.id);
  });

  socket.on('disconnect', () => {
    deleteUsers(socket.id);
  });

  socket.on('message', ({ receiver, sender, message, type }) => {
    users.forEach((user) => {
      if (user.user === receiver)
        io.to(user.socketId).emit('messageTo', {
          message,
          sender,
          receiver,
          type,
        });
    });
  });
});

server.listen(4000, () => {
  console.log('listen on port 4000');
});
