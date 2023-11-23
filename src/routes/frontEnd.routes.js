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
  const { normalUser, Seller, userEmail } = req.cookies;
  let navBar = '';
  req.session.saludo = 'this is a greeting from sebastian';

  if (Seller) {
    const sellerVerified = jwt.verify(Seller, SECRET);
    if (sellerVerified) navBar = 'Seller.ejs';
    else if (normalUser) navBar = 'NavBar.ejs';
    else navBar = 'NoAccount.ejs';
  } else if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('MainPage', 'index'), {
    navBar,
    profile: userEmail,
  });
});

route.get('/post/:project', (req, res) => {
  let { project } = req.params;

  return res.render(join('post', 'index'), {
    project,
  });
});

route.get('/createPublication', authUser, authSeller, async (req, res) => {
  try {
    const connection = await Pool.getConnection();
    const [result] = await connection.query('SELECT * FROM catalog_designs');

    connection.release();
    return res.render(join('CreatePosts', 'index'), {
      result,
    });
  } catch (error) {
    console.log(error);
  }
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
  return res.render(join('accountSeller', 'index'));
});

route.get('/Chats/:email', authUser, (req, res) => {
  const { email } = req.params;
  const userEmail = req.session.userEmail;
  return res.render(join('chat', 'index'), {
    email,
    separacion: true,
    userEmail,
  });
});

route.get('/Chats', authUser, (req, res) => {
  let email = null;
  const userEmail = req.session.userEmail;

  return res.render(join('chat', 'index'), {
    email,
    separacion: false,
    userEmail,
  });
});

route.get('/profile/:email', authUser, async (req, res) => {
  const { email } = req.params;
  const userDataObject = {};
  const posts = {};
  let sellerInfoOpinions = null;

  try {
    const [isNormalUser] = await Pool.query('CALL profile_user(?)', [email]);

    if (isNormalUser[0][0] && 'IsSeller' in isNormalUser[0][0]) {
      if (isNormalUser[0][0].IsSeller === 1) {
        const [sellerInfo] = await Pool.query(
          'CALL Profile_Seller_User_Opinions(?)',
          [email]
        );

        if (sellerInfo[0][0]) sellerInfoOpinions = sellerInfo[0][0];
        else sellerInfoOpinions = sellerInfo[1][0];

        const [sellerPost] = await Pool.query(
          'SELECT * FROM posts WHERE Email = ?',
          [sellerInfoOpinions.Email]
        );

        if (!userDataObject[sellerInfoOpinions.Names]) {
          userDataObject[sellerInfoOpinions.Names] = {
            Names: sellerInfoOpinions.Names,
            Email: sellerInfoOpinions.Email,
            Description: sellerInfoOpinions.Description,
            Profession: sellerInfoOpinions.Profession,
            Opinions: [],
            Posts: [],
            Raiting: sellerInfoOpinions.Calificaciones,
            Avatar: sellerInfoOpinions.AVATAR,
          };
        }

        if (sellerInfoOpinions.Opinion !== undefined)
          sellerInfo[0].forEach((opinion) => {
            userDataObject[sellerInfoOpinions.Names].Opinions.push(
              opinion.Opinion
            );
          });

        if (sellerPost.length > 1) {
          sellerPost.forEach((post) => {
            if (!posts[post.ID]) {
              posts[post.ID] = {
                Name: post.Name_product,
                Description: post.Description,
                Email: post.Email,
                Model_Route: post.Model_Route,
                Screen_Model_Route: post.Screen_Model_Route,
                Type: post.Type,
                Images: [post.Route],
              };
            } else {
              posts[post.ID].Images.push(post.Route);
            }
          });
          const postsObject = Object.values(posts);
          userDataObject[sellerInfoOpinions.Names].Posts = postsObject;
        }
        return res.render(join('profile', 'index'), {
          data: userDataObject[sellerInfoOpinions.Names],
        });
      }
    }

    return res.render(join('profile', 'normalUsers'), {
      data: isNormalUser[0][0],
    });
  } catch (error) {
    console.log('the error was', error);
  }
});

route.get('/editProfile', authUser, async (req, res) => {
  const userDataObject = {};
  const posts = {};
  const { Seller = '' } = req.cookies;
  const user = req.session.userEmail;
  const seller = jwt.verify(Seller, SECRET);
  let sellerInfo = null;

  try {
    if (seller) {
      const [sellersInfo] = await Pool.query(
        'CALL profile_seller_user_opinions(?)',
        [user]
      );

      const [sellerPost] = await Pool.query(
        'SELECT * FROM posts WHERE Email = ?',
        [user]
      );

      if (!sellersInfo[0][0]) sellerInfo = sellersInfo[1][0];
      else sellerInfo = sellersInfo[0][0];

      if (!userDataObject[sellerInfo.Names]) {
        userDataObject[sellerInfo.Names] = {
          Names: sellerInfo.Names,
          Email: sellerInfo.Email,
          Description: sellerInfo.Description,
          Profession: sellerInfo.Profession,
          Opinions: [],
          Raiting: sellerInfo.Calificaciones,
          Avatar: sellerInfo.AVATAR,
        };
      }

      if (!sellersInfo[0].Opinion)
        sellersInfo[0].forEach((opinion) => {
          userDataObject[sellerInfo.Names].Opinions.push(opinion.Opinion);
        });

      if (sellerPost.length > 1) {
        sellerPost.forEach((post) => {
          if (!posts[post.ID]) {
            posts[post.ID] = {
              Name: post.Name_product,
              Description: post.Description,
              Email: post.Email,
              Model_Route: post.Model_Route,
              Screen_Model_Route: post.Screen_Model_Route,
              Type: post.Type,
              Images: [post.Route],
            };
          } else {
            posts[post.ID].Images.push(post.Route);
          }
        });
        const postsObject = Object.values(posts);
        userDataObject[sellerInfo.Names].Posts = postsObject;
      }

      const SellerInfo = userDataObject[sellerInfo.Names];

      console.log(SellerInfo);

      return res.render(join('editProfileSeller', 'index'), {
        SellerInfo,
      });
    } else {
      const [userInfo] = await Pool.query('CALL profile_user(?)', [user]);

      return res.render(join('editProfile', 'index'), {
        UserInfo: userInfo[0][0],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

route.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const { normalUser, Seller } = req.cookies;
  let navBar = '';

  if (Seller) {
    const sellerVerified = jwt.verify(Seller, SECRET);
    if (sellerVerified) navBar = 'Seller.ejs';
    else if (normalUser) navBar = 'NavBar.ejs';
    else navBar = 'NoAccount.ejs';
  } else if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('postsCategories', 'index'), {
    category,
    navBar,
  });
});

route.get('/sellers/:type', async (req, res) => {
  const { type } = req.params;
  const { normalUser, Seller } = req.cookies;
  let navBar = '';

  if (Seller) {
    const sellerVerified = jwt.verify(Seller, SECRET);
    if (sellerVerified) navBar = 'Seller.ejs';
    else if (normalUser) navBar = 'NavBar.ejs';
    else navBar = 'NoAccount.ejs';
  } else if (normalUser) navBar = 'NavBar.ejs';
  else navBar = 'NoAccount.ejs';

  return res.render(join('sellerCategory', 'index'), {
    type,
    navBar,
  });
});

route.get('/support', (req, res) => {
  return res.render(join('support', 'index'));
});

route.get('/view/:model3d', (req, res) => {
  const { model3d } = req.params;
  return res.render(join('view', 'index'), {
    model3d,
  });
});

export default route;
