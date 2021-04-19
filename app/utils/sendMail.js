import nodemailer from 'nodemailer';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {createTransport} = nodemailer;

export default (subject, text, attachments = []) => {
  const transporter = createTransport(config.mailer.transporter);
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
        logger.info('Order details: ', {message});
      });
};
