import { Router } from 'express';
import {
  authUser,
  authSeller,
  userExist,
  sellerExist,
} from '../middlewares/auth.js';
import { join } from 'path';

const route = Router();

route.get('/', (req, res) => {
  const { normalUser } = req.cookies;
  let navBar = '';
  if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('MainPage', 'index'), {
    navBar,
  });
});

route.get('/post/:project', (req, res) => {
  const { normalUser } = req.cookies;
  let { project } = req.params;

  let navBar = '';
  if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  res.render(join('post', 'index'), {
    navBar,
    project,
  });
});

route.get('/createPublications', authUser, authSeller, (req, res) => {
  const { normalUser } = req.cookies;
  let navBar = '';
  if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('CreatePosts', 'index'), {
    navBar,
  });
});

//Iniciar sesion
route.get('/SignIn', userExist, (req, res) => {
  let navBar = 'NoAccount.ejs';

  return res.render(join('logIn', 'index'), {
    navBar,
  });
});

//Crear cuentas
route.get('/CreateAccount', userExist, (_req, res) => {
  let navBar = 'NoAccount.ejs';

  return res.render(join('signUp', 'index'), {
    navBar,
  });
});

route.get('/BecomeSeller', sellerExist, (req, res) => {
  return res.sendFile('index.html', {
    root: join(process.cwd(), 'public', 'Account', 'accountSeller'),
  });
});

route.get('/chats/:email', (req, res) => {
  const { email } = req.params;

  res.render(join('chat', 'index'), {
    email,
  });
});

route.get('/chats', authUser, (req, res) => {
  let email = null;
  return res.render(join('chat', 'index'), {
    email,
  });
});

route.get('/profile/:seller', authUser, async (req, res) => {
  const { seller } = req.params;
  const { normalUser } = req.cookies;

  let navBar = '';
  if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('profiles', 'index'), {
    navBar,
    seller,
  });
});

export default route;
