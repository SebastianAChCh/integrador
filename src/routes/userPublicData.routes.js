import { Router } from 'express';
import { authSeller, authUser } from '../middlewares/auth.js';
import {
  editSellerData,
  editUserData,
  sellerByType,
  sellerData,
  userData,
} from './controllers/userData.js';

const router = Router();

router.get('/userData/:email', userData);
router.get('/sellerData/:email', sellerData);
router.get('/sellersByType/:type', sellerByType);
router.post('/editUserData', authUser, editUserData);
router.post('/editSellerData', authUser, authSeller, editSellerData);

export default router;
