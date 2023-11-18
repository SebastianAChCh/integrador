import { Router } from 'express';
import Pool from '../db/db.js';

const router = Router();

router.post('/saveCard', async (req, res) => {
  try {
    const [] = await Pool.query('INSERT INTO card ');
  } catch (error) {
    console.log(error);
  }
});

router.get('/loadCards/:email', async (req, res) => {});

export default router;
