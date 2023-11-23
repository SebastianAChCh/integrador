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
import session from 'express-session';
import Email from './routes/email.routes.js';
import { SECRET } from './conf.js';
import MySQLStore from 'express-mysql-session';
import Pool from './db/db.js';

const app = express();

const server = createServer(app);

const sessionStore = new (MySQLStore(session))(
  {
    clearExpired: true,
    expiration: 1 * 24 * 60 * 60 * 1000,
    checkExpirationInterval: 1 * 24 * 60 * 60 * 1000,
    createDatabaseTable: true,
  },
  Pool
);

const io = new Server(server, {
  connectionStateRecovery: {},
  maxHttpBufferSize: 5e8,
});

app.use(express.static(join(process.cwd(), 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
  })
);

app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), 'public'));

app.use(express.json());
app.use(cookieParser());
app.use(Payments);
app.use(Sessions);
app.use(Post);
app.use(Messages);
app.use(UserPublicData);
app.use(Email);
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
    console.log(users);
  });

  socket.on('disconnect', () => {
    deleteUsers(socket.id);
  });

  socket.on('message', ({ receiver, sender, message, type, fileName = '' }) => {
    console.log(receiver, sender);
    users.forEach((user) => {
      if (user.user === receiver) {
        io.to(user.socketId).emit('messageTo', {
          message,
          sender,
          receiver,
          fileName,
          type,
        });
      }
    });
  });
});

server.listen(3000, () => {
  console.log('listen on port 3000');
});
