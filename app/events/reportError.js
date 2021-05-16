import config from '../loaders/config';
import sendMail from '../utils/sendMail';

export default (errorMsg, errorObj) => {
  const subject = config.mailer.error.subject;
  const message = config.mailer.error.message
      .replace(/\${msg}/, String(errorMsg))
      .replace(/\${error}/, String(errorObj));

  sendMail(subject, message);
};
