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
import Pool from '../db/db.js';

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

route.get('/profile/:email', authUser, async (req, res) => {
  const { Seller = '' } = req.cookies;
  const { email } = req.params;
  const userDataObject = {};
  const posts = {};

  try {
    const verify = jwt.verify(Seller, SECRET);
    if (Seller && verify) {
      const [sellerInfoOpinions] = await Pool.query(
        'CALL Profile_Seller_User_Opinions(?)',
        [email]
      );

      const [sellerPost] = await Pool.query(
        'SELECT * FROM posts WHERE Email = ?',
        [sellerInfoOpinions[0][0].Email]
      );

      if (!userDataObject[sellerInfoOpinions[0][0].Names]) {
        userDataObject[sellerInfoOpinions[0][0].Names] = {
          Names: sellerInfoOpinions[0][0].Names,
          Email: sellerInfoOpinions[0][0].Email,
          Description: sellerInfoOpinions[0][0].Description,
          Profession: sellerInfoOpinions[0][0].Profession,
          Opinions: [],
          Posts: [],
          Raiting: sellerInfoOpinions[0][0].Calificaciones,
          Avatar: sellerInfoOpinions[0][0].AVATAR,
        };
      }

      if (!sellerInfoOpinions[0].Opinion)
        sellerInfoOpinions[0].forEach((opinion) => {
          userDataObject[sellerInfoOpinions[0][0].Names].Opinions.push(
            opinion.Opinion
          );
        });

      if (sellerPost.length > 1) {
        if (!posts[sellerPost[0].Name_product]) {
          posts[sellerPost[0].Name_product] = {
            Name: sellerPost[0].Name_product,
            Description: sellerPost[0].Description,
            Email: sellerPost[0].Email,
            Model_Route: sellerPost[0].Model_Route,
            Screen_Model_Route: sellerPost[0].Screen_Model_Route,
            Type: sellerPost[0].Type,
            Images: [],
          };
        } else {
          sellerPost.forEach((post) => {
            posts[sellerPost.Name_product].Images.push(post);
          });
        }
        const postsObject = Object.values(posts);
        console.log(posts);
        userDataObject[sellerInfoOpinions[0][0].Names].Posts.push(postsObject);
      }

      console.log(userDataObject[sellerInfoOpinions[0][0].Names]);

      return res.render(join('profile', 'index'), {
        data: userDataObject[sellerInfoOpinions[0][0].Names],
      });
    } else {
    }
  } catch (error) {
    console.log('the error was', error);
  }
});

route.get('/editProfile/:email', authUser, async (req, res) => {
  const { Seller = '' } = req.cookies;
  const verify = jwt.verify(Seller, SECRET);
  try {
  } catch (error) {
    console.log(error);
  }
});

route.post('/editProfile', (req, res) => {});

export default route;
