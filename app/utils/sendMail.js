import nodemailer from 'nodemailer';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {createTransport} = nodemailer;

export default (message, fileBuffer, fileName) => {
  const transporter = createTransport(config.mailer.transporter);
  const content = {
    ...config.mailer.content,
    text: message,
    attachments: [{
      filename: fileName,
      content: fileBuffer,
    }],
  };

  transporter.sendMail(content, (error, data) => {
    if (error) {
      logger.error('Unable to send mail', error);
      logger.info('Order details: ', {message});
    }
  });
};
