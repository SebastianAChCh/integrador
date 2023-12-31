import jwb from 'jsonwebtoken';
import Pool from '../../db/db.js';
import { SECRET } from '../../conf.js';
import { uploadImages } from '../../middlewares/upload.js';
import { MulterError } from 'multer';

export const createPost = async (req, res) => {
  try {
    const { Seller } = req.cookies;
    const imagesArr = [];
    let screen = '';

    uploadImages(req, res, async (err) => {
      if (err instanceof MulterError || err) {
        return res.status(400).json({
          status: 'failed',
          message:
            'The format of the image is incorrect or more than one 3D file was uploaded',
        });
      } else {
        const { name, description, cost, type } = req.body;
        let mimeType = null;
        let path = '';
        console.log(req);
        for (let i = 0; i < req.files.length; i++) {
          mimeType = req.files[i].mimetype.split('/');
          const pos = req.files[i].originalname.lastIndexOf('.');
          const names = req.files[i].originalname.slice(0, pos);

          if (
            mimeType[1] === 'octet-stream' ||
            mimeType[0] === 'model' ||
            mimeType[1] === 'gltf-binary'
          )
            path = req.files[i].path;
          else if (names === 'screen') {
            screen = req.files[i].path;
          } else imagesArr.push(req.files[i].path);
        }

        const sellerIs = jwb.verify(Seller, SECRET);

        const newPath = path.slice(7);
        const newScreen = screen.slice(7);

        const [design] = await Pool.query(
          'INSERT INTO designs (ID_SELLER, Name_product, Description, Model_Route, Screen_Model_Route, Cost, Type_Design) VALUES (?,?,?,?,?,?,?)',
          [
            sellerIs.seller,
            name,
            description,
            newPath,
            newScreen,
            Number(cost),
            Number(type),
          ]
        );

        if (design.affectedRows < 1) {
          return res.status(500).json({
            status: 'failed',
            message: 'Something went wrong',
          });
        }

        const [designSeller] = await Pool.query(
          'SELECT ID FROM designs WHERE Name_product = ?',
          [name]
        );

        for (let i = 0; i < imagesArr.length; i++) {
          const [images] = await Pool.query(
            'INSERT INTO images (ID_PROJECT, Route) VALUES (?,?)',
            [designSeller[0].ID, imagesArr[i]]
          );

          if (images.affectedRows < 1) {
            return res.status(500).json({
              status: 'failed',
              message: 'Something went wrong',
            });
          }
        }

        return res.status(200).json({ status: 'ok' });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const ShowPosts = async (req, res) => {
  try {
    //Esta es una view, acuerdate baboso, ya se me habia olvidado
    const connection = await Pool.getConnection();
    const [response] = await connection.query('SELECT * FROM posts');
    connection.release();
    const data = response;
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

export const ShowPost = async (req, res) => {
  const { post } = req.params;
  try {
    const [response] = await Pool.query(
      'SELECT * FROM posts WHERE Name_product = ?',
      [post]
    );

    const [infoSeller] = await Pool.query('CALL profile_seller_user(?)', [
      response[0].Email,
    ]);

    if (response.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }

    return res.json({ postData: response, infoSeller: infoSeller[0] });
  } catch (error) {
    console.log(error);
  }
};

export const loadPostsByType = async (req, res) => {
  const { category } = req.params;
  console.log(category);
  try {
    const [response] = await Pool.query('SELECT * FROM posts WHERE Type = ?', [
      category,
    ]);

    if (response.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'does not exist posts of',
      });
    }

    return res.status(200).json({
      status: 'ok',
      posts: response,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editPost = async () => {};
