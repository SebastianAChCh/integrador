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
