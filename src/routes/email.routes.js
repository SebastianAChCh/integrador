import { Router } from 'express';
import { transporter } from '../middlewares/email.js';

const router = Router();

router.post('/sendEmailToUs', async (req, res) => {
  const { email, description } = req.body;
  try {
    await transporter.verify();
    transporter.sendMail({
      from: email,
      to: 'UDesEV.CS@gmail.com',
      text: description,
    });

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
});

router.post('/sendEmail', async (req, res) => {});

export default router;
