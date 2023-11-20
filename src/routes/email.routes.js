import { Router } from 'express';
import { transporter } from '../middlewares/email.js';

const router = Router();

router.post('/problems', async (req, res) => {
  const { name, issue, message } = req.body;

  try {
    await transporter.verify();
    transporter.sendMail({
      from: name,
      to: 'UDesEV.CS@gmail.com',
      subject: 'I have got a problem',
      html: `<h1>${name}</h1> <br> <h3>${issue}</h3> <br> <p>${message}</p>`,
    });

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
});

router.post('/sendEmail', async (req, res) => {});

export default router;
