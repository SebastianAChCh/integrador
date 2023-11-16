import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {
  authUser,
  authSeller,
  userExist,
  sellerExist,
} from '../middlewares/auth.js';
import { join } from 'path';
import { SECRET } from '../conf.js';

const route = Router();

route.get('/', (req, res) => {
  const { normalUser, Seller } = req.cookies;
  let navBar = '';
  if (Seller) {
    const sellerVerified = jwt.verify(Seller, SECRET);
    if (sellerVerified) {
      navBar = 'Seller.ejs';
    } else if (normalUser) navBar = 'NavBar.ejs';
    else navBar = 'NoAccount.ejs';
  } else if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('MainPage', 'index'), {
    navBar,
  });
});

route.get('/post/:project', (req, res) => {
  let { project } = req.params;

  return res.render(join('post', 'index'), {
    project,
  });
});

route.get('/createPublication', authUser, authSeller, (req, res) => {
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

route.get('/Sell', sellerExist, (req, res) => {
  return res.sendFile('index.html', {
    root: join(process.cwd(), 'public', 'Account', 'accountSeller'),
  });
});

route.get('/Chats/:email', authUser, (req, res) => {
  const { email } = req.params;

  return res.render(join('chat', 'index'), {
    email,
    separacion: true,
  });
});

route.get('/Chats', authUser, (req, res) => {
  let email = null;
  return res.render(join('chat', 'index'), {
    email,
    separacion: false,
  });
});

route.get('/profile/:seller', authUser, (req, res) => {
  const { seller } = req.params;
  const { normalUser } = req.cookies;

  let navBar = '';
  if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('profile', 'index'), {
    navBar,
    seller,
  });
});

route.get('/editProfile/:email', authUser, (req, res) => {});

export default route;
