<<<<<<< Updated upstream
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
=======
import Stripe from 'stripe';
import Pool from '../../db/db.js';

const stripe = new Stripe(
  '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'
);

export const retriveUserStripe = async (req, res) => {
  const userEmail = req.session.userEmail;

  try {
    const connection = await Pool.getConnection();

    const [clientStripe] = await connection.query(
      'SELECT AccountUser, Email_user FROM accountsstripe WHERE Email_user = ?',
      [userEmail]
    );

    if (clientStripe.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'that client does not exist',
      });
    }

    const customerStripe = await stripe.customers.retrieve(
      clientStripe[0].Id_Stripe
    );

    connection.release();
    if (customerStripe) {
      return res.status(200).json({
        status: 'ok',
        customerStripe,
      });
    } else {
      return res.status(500).json({
        status: 'failed',
        message: 'there was an error looking for the client',
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};

export const createAccountUsers = async (req, res) => {
  const userEmail = req.session.userEmail;
  try {
    const connection = await Pool.getConnection();
    const [user] = await connection.query(
      'SELECT Names FROM users WHERE Email = ?',
      [userEmail]
    );

    if (user.length < 1) {
      return res.status(404).json({
        status: 'failed',
        message: 'that client does not exist',
      });
    }

    const dataClient = await stripe.customers.create({
      email: userEmail,
      name: user[0].Names,
    });

    const [clientSaved] = await connection.query(
      'INSERT INTO accountsstripe (Email_user, AccountUser) VALUES (?,?)',
      [userEmail, dataClient.id]
    );

    if (clientSaved.affectedRows < 1) {
      return res.status(500).json({
        status: 'failed',
        message: 'there was an error saving the client',
      });
    }

    connection.release();
    return res.status(200).json({
      status: 'ok',
      dataClient,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};

export const relateInfoAccount = async (req, res) => {
  const { userId, token } = req.body;
  try {
    const connection = await Pool.getConnection();
    const [response] = await connection.query(
      'INSERT INTO accountsbank (AccountBank, AccountUser) VALUES(?,?)',
      [token, userId]
    );

    if (response.affectedRows > 0) {
      return res.status(200).json({
        status: 'ok',
        message: response,
      });
    } else {
      return res.status(500).json({
        status: 'failed',
        messge: 'there was an error',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};

export const payloads = async (req, res) => {
  const { amount } = req.body;
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'mxn',
      payment_method_types: ['card', 'oxxo'],
      receipt_email: req.session.userEmail,
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};

export const stripeSendMoney = async (req, res) => {
  const { destination, amount } = req.body;
  try {
    const transfer = await stripe.transfers.create({
      amount: 1000,
      currency: 'usd',
      destination: 'tok_1OH9llBGoB4DABgdkgYUH5xh',
    });

    if (transfer) {
      return res.status(200).json({
        status: 'ok',
        message: transfer,
      });
    } else {
      return res.status(500).json({
        status: 'failed',
        messge: 'there was an error',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      error: error.message,
    });
  }
};
>>>>>>> Stashed changes
