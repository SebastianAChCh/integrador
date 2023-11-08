import { Router } from 'express';
import {
  loadContacts,
  loadMessages,
  saveFiles,
  saveMessages,
} from './controllers/messages.js';

const router = Router();

router.post('/saveMessages', saveMessages);

router.post('/saveFiles', saveFiles);

router.post('/loadMessages', loadMessages);

router.get('/loadContacts/:email', loadContacts);

export default router;
