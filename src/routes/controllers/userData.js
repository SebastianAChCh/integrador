<<<<<<< Updated upstream
import Pool from '../../db/db.js';

export const userData = async (req, res) => {
  const { email } = req.params;
  try {
    console.log(email);
    const [userInfo] = await Pool.query('CALL Profile_User(?)', [email]);

    if (userInfo.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }

    return res.status(200).json({ userInfo: userInfo[0] });
  } catch (error) {
    console.log(error);
  }
};

export const sellerData = async (req, res) => {
  const { email } = req.params;
  try {
    const [sellerInfo] = await Pool.query('CALL Profile_Seller_User(?)', [
      email,
    ]);

    if (sellerInfo.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }

    return res.status(200).json({ sellerInfo: sellerInfo[0] });
  } catch (error) {
    console.log(error);
  }
};
=======
import Pool from '../../db/db.js';
import { uploadAvatars } from '../../middlewares/upload.js';

export const userData = async (req, res) => {
  const { email } = req.params;
  try {
    const connection = await Pool.getConnection();
    const [userInfo] = await connection.query('CALL profile_user(?)', [email]);

    if (userInfo.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }
    connection.release();
    return res.status(200).json({ userInfo: userInfo[0] });
  } catch (error) {
    console.log(error);
  }
};

export const sellerData = async (req, res) => {
  const { email } = req.params;
  try {
    const connection = await Pool.getConnection();
    const [sellerInfoOpinions] = await connection.query(
      'CALL profile_seller_user_opinions(?)',
      [email]
    );

    if (sellerInfoOpinions[0].length < 1) {
      const [sellerInfo] = await Pool.query('CALL profile_seller_user(?)', [
        email,
      ]);

      if (sellerInfo.length < 1) {
        return res.status(404).json({
          status: 'failed',
          sellerInfo: '',
        });
      }

      return res.status(200).json({ sellerInfo: sellerInfo[0] });
    }
    connection.release();
    return res.status(200).json({ sellerInfo: sellerInfoOpinions[0] });
  } catch (error) {
    console.log(error);
  }
};

export const editUserData = async (req, res) => {
  const { names } = req.body;
  const userEmail = req.session.userEmail;
  try {
    const connection = await Pool.getConnection();

    const [updatedUserData] = await connection.query(
      'UPDATE users SET Names = IFNULL(?, Names) WHERE Email = ?',
      [names, userEmail]
    );

    if (updatedUserData.affectedRows < 1) {
      connection.release();
      return res
        .status(500)
        .json({ status: 'failed', message: 'data update failed' });
    } else {
      connection.release();
      return res.status(200).json({ status: 'ok' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'failed', error: error.message });
  }
};

export const editUserPhoto = async (req, res) => {
  const userEmail = req.session.userEmail;
  uploadAvatars(req, res, async (err) => {
    const connection = await Pool.getConnection();
    const profileImg = req.file;

    const [userId] = await connection.query(
      'SELECT ID FROM users WHERE Email = ?',
      [userEmail]
    );

    const [result] = await connection.query(
      'UPDATE profile SET AVATAR = IFNULL(?, AVATAR) WHERE ID_USER = ?',
      [profileImg.path.slice(7), userId[0].ID]
    );

    if (result.affectedRows < 1) {
      connection.release();
      return res
        .status(500)
        .json({ status: 'failed', message: 'data update failed' });
    }

    connection.release();
    return res.status(200).json({
      status: 'ok',
    });
  });
};

export const editSellerPhoto = async (req, res) => {
  const userEmail = req.session.userEmail;
  try {
    uploadAvatars(req, res, async (err) => {
      const connection = await Pool.getConnection();
      const profileImg = req.file;

      const [userId] = await connection.query(
        'SELECT ID FROM users WHERE Email = ?',
        [userEmail]
      );

      const [result] = await connection.query(
        'UPDATE profile SET AVATAR = IFNULL(?, AVATAR) WHERE ID_USER = ?',
        [profileImg.path.slice(7), userId[0].ID]
      );

      if (result.affectedRows < 1) {
        connection.release();
        return res
          .status(500)
          .json({ status: 'failed', message: 'data update failed' });
      }

      connection.release();
      return res.status(200).json({
        status: 'ok',
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const editSellerData = async (req, res) => {
  const { name, lastnames, description } = req.body;
  const userEmail = req.session.userEmail;
  try {
    const connection = await Pool.getConnection();

    const [result] = await connection.query(
      'UPDATE users SET Names = IFNULL(?, Names), LastNames = IFNULL(?, LastNames), Description = IFNULL(?, Description) WHERE Email = ?',
      [name, lastnames, description, userEmail]
    );

    if (result.affectedRows < 1) {
      connection.release();
      return res.status(500).json({
        status: 'failed',
        message: 'the filed were not able to be updated',
      });
    }

    connection.release();
    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
};

export const sellerByType = async (req, res) => {
  const { type } = req.params;
  try {
    const connection = await Pool.getConnection();
    const [result] = await connection.query(
      'SELECT * FROM SellerByType WHERE Profession = ?',
      [type]
    );

    if (result.length < 1) {
      connection.release();
      return res.status(404).json({
        status: 'failed',
        message: 'Sellers of that type were not found',
      });
    }

    connection.release();
    return res.status(200).json({
      status: 'ok',
      result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getIdStripe = async (req, res) => {
  try {
    const connection = await Pool.getConnection();
    const [id_user] = await connection.query(
      'SELECT ID FROM users WHERE Email = ?',
      [req.session.userEmail]
    );

    const [result] = await connection.query(
      'SELECT ID_STRIPE FROM seller WHERE ID_USER = ?',
      [id_user[0].ID]
    );

    if (result.length < 1) {
      connection.release();
      return res.status(200).json({
        status: 'successfully',
        message: 'the user does not have an account in stripe',
      });
    }
    connection.release();

    return res.status(200).json({
      status: 'successfully',
      message: result[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const connection = await Pool.getConnection();
    const [result] = await connection.query('CALL DeleteUsers(?)', [
      req.session.userEmail,
    ]);

    if (result.affectedRows < 1) {
      connection.release();
      return res.status(500).json({
        status: 'failed',
        message: 'there was an error deleting the account',
      });
    }

    connection.release();
    return res.status(200).json({
      status: 'ok',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};

export const purchaseSales = async (req, res) => {
  const { seller, purchaser, title, quantity } = req.body;
  const connection = await Pool.getConnection();
  try {
    connection.beginTransaction();
    const [result] = await connection.query(
      'INSERT INTO transactionsuserseller (EMAIL_SELLER, EMAIL_USER, Title, Quantity, Date) VALUES (?, ?, ?, ?, NOW())',
      [seller, purchaser, title, quantity]
    );

    if (result.affectedRows < 1) {
      connection.rollback();

      return res.status(500).json({
        status: 'failed',
        message: 'there was an error',
      });
    }

    connection.commit();
    return res.status(200).json({
      status: 'ok',
    });
  } catch (error) {
    console.log(error);
    connection.rollback();
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};
>>>>>>> Stashed changes
