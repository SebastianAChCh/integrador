import { Router } from 'express';

import { logIn, SingUp, createAccountSeller } from './controllers/Sessions.js';

const router = Router();

router.post('/logIn', logIn);
router.post('/createAccount', SingUp);
router.post('/createAccountSeller', createAccountSeller);

export default router;
