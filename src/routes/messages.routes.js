import { Router } from 'express';
import Pool from '../db/db.js';

const router = Router();

router.get('/loadUsers/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [users] = await Pool.query(
      'SELECT EMAIL_SELLER FROM Messages WHERE EMAIL_USER = ?',
      [email]
    );

    if (users.length < 1)
      return res.status(200).json({
        users: '',
      });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
