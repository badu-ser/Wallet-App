import express from 'express';
import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const transporter = createTransport({
  pool: true,
  host: process.env.NODEMAILER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

// Route to be pinged by UptimeRobot
router.get('/email-ping', async (req, res) => {
  try {
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.NODEMAILER_FROM_MAIL,
      to: process.env.SUPPORT_EMAIL,
      subject: 'SMTP Monitor - X4 Wallet',
      text: 'This is a test email sent by the /email-ping monitor route.',
    });

    res.status(200).send('Email sent successfully');
  } catch (err) {
    console.error('Email ping failed:', err);
    res.status(500).send('Email failed');
  }
});

export default router;
