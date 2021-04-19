import sendMail from '../utils/sendMail';
import config from '../loaders/config';
import logger from '../loaders/logger';

export default (vinNumber, errorObj) => {
  const subject = config.mailer.error.subject.replace(/\${vin}/, vinNumber);
  const message = config.mailer.error.message.replace(/\${error}/, String(errorObj));

  logger.error('Parser error', errorObj);

  sendMail(subject, message);
};
