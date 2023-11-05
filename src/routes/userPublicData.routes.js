import { Router } from 'express';
import { authUser } from '../middlewares/auth.js';
import { sellerData, userData } from './controllers/userData.js';

const router = Router();

router.get('/userData/:email', authUser, userData);
router.get('/sellerData/:email', authUser, sellerData);

export default router;
