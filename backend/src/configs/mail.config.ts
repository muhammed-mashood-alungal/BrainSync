import nodemailer from 'nodemailer';
import { env } from './env.config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SENDER_EMAIL,
    pass: env.NODEMAILER_PASSKEY,
  },
});

export default transporter;
