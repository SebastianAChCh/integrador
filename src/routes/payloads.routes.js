import { Router } from 'express';
import { payloads } from './controllers/payloads.js';

const route = Router();

route.post('/payloads', payloads);

export default route;
