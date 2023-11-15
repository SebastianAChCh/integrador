import { Router } from 'express';
import { authSeller, authUser } from '../middlewares/auth.js';
import {
  editSellerData,
  editUserData,
  sellerData,
  userData,
} from './controllers/userData.js';

const router = Router();

router.get('/userData/:email', authUser, userData);
router.get('/sellerData/:email', authUser, sellerData);
router.post('/editUserData', authUser, editUserData);
router.post('/editSellerData', authUser, authSeller, editSellerData);

export default router;
