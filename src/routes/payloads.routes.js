import { Router } from 'express';
import Stripe from 'stripe';

const route = Router();

const stripe = new Stripe(
  'sk_test_51O2HtxBGoB4DABgdpS7ZOyOaaZ2ipJpfG1LyARVupRQdJkNOJ4xcNpXiSfEIW7j21FT6E3a3J8tqiTJuY11dPGC100Fsqw8Idh'
);

route.post('/payments', async (req, res) => {
  const { totalAmount, accountReceiver } = req.body;

  console.log('se ejecuto en el backend');

  const paymentIntent = await stripe.transfers.create({
    amount: Number(totalAmount),
    currency: 'mxn',
    payment_method_types: ['card', 'alipay', 'oxxo'],
    receipt_email: 'sebastianantoniochavira@gmail.com',
  });

  return res.json({ clientSecret: paymentIntent.client_secret });
});

export default route;
