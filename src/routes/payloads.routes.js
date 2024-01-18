import { Router } from 'express';
import {
  createAccountUsers,
  payloads,
  relateInfoAccount,
  retriveUserStripe,
  stripeSendMoney,
} from './controllers/payloads.js';

const route = Router();

route.post('/payments', payloads);
route.post('/relateInfoAccount', relateInfoAccount);
route.post('/sendMoney', stripeSendMoney);
route.get('/chekIfExists', retriveUserStripe);
route.get('/createAccountUsers', createAccountUsers);

export default route;
