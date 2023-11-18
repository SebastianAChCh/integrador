import Stripe from 'stripe';
import { STRIPE_KEY_SECRET } from '../../conf.js';

const stripe = new Stripe(STRIPE_KEY_SECRET);

export const payloads = async (req, res) => {
  const { totalAmount, email, account } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'mxn',
    automatic_payment_methods: ['card', 'oxxo'],
    receipt_email: email,
    transfer_data: account,
  });

  res.json({ data: paymentIntent.client_secret });
};
