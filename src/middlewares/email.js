import { createTransport } from 'nodemailer';

export const transporter = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'sebastianantoniochavira@gmail.com',
    pass: 'jnfc jrjd orbe vnwy',
  },
});
