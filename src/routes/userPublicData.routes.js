import { Router } from 'express';
import { authSeller, authUser } from '../middlewares/auth.js';
import {
  editSellerData,
  editUserData,
  sellerByType,
  sellerData,
  userData,
  editSellerPhoto,
  getIdStripe,
  editUserPhoto,
  deleteAccount,
  purchaseSales,
} from './controllers/userData.js';

const router = Router();

router.get('/userData/:email', userData);
router.get('/sellerData/:email', sellerData);
router.get('/sellersByType/:type', sellerByType);
router.get('/getIdStripe', getIdStripe);
router.get('/deleteAccount', deleteAccount);

router.post('/editUserData', authUser, editUserData);
router.post('/editUserPhoto', authUser, editUserPhoto);
router.post('/editSellerData', authUser, authSeller, editSellerData);
router.post('/editSellerPhoto', authUser, editSellerPhoto);
router.post('/savePurchaseSales', purchaseSales);

export default router;
