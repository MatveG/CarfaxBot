import nodemailer from 'nodemailer';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {GMAIL_USER: user, GMAIL_PASS: pass} = process.env;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {user, pass},
});

export default (subject, text, attachments = []) => {
  const content = {
    ...config.mailer.content,
    subject,
    text,
    attachments,
  };

  return transporter
      .sendMail(content)
      .catch((err) => {
        logger.error('Unable to send mail', err);
        logger.info('Order details: ', {text});
      });
};
