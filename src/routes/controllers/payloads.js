import Stripe from 'stripe';
import { SECRET } from '../../conf.js';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(
  'sk_test_51O2HtxBGoB4DABgdpS7ZOyOaaZ2ipJpfG1LyARVupRQdJkNOJ4xcNpXiSfEIW7j21FT6E3a3J8tqiTJuY11dPGC100Fsqw8Idh'
);
export const payloads = () => {};
