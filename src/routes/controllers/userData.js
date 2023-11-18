import Pool from '../../db/db.js';

export const userData = async (req, res) => {
  const { email } = req.params;
  try {
    const [userInfo] = await Pool.query('CALL profile_user(?)', [email]);

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
    const [sellerInfoOpinions] = await Pool.query(
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

    return res.status(200).json({ sellerInfo: sellerInfoOpinions[0] });
  } catch (error) {
    console.log(error);
  }
};

export const editUserData = async (req, res) => {
  const { email, names, lastnames, phone } = req.body;
  try {
    const [updatedUserData] = await Pool.query(
      'UPDATE users SET Names = ?, LastNames = ?, Phone = ? WHERE Email = ?',
      [names, lastnames, phone, email]
    );

    if (updatedUserData.affectedRows < 1) {
      return res
        .status(500)
        .json({ status: 'failed', message: 'data update failed' });
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
};

export const editSellerData = async (req, res) => {};
