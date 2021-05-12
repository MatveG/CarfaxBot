import sendMail from '../utils/sendMail';
import config from '../loaders/config';

export default (vin, phone, method) => {
  const subject = config.mailer.notify.subject;
  let message = config.mailer.notify.message;

  message = message.replace(/\${vin}/, vin);
  message = message.replace(/\${phone}/, phone);
  message = message.replace(/\${method}/, method);

  sendMail(subject, message);
};
