import sendMail from '../utils/sendMail';
import config from '../loaders/config';

export default (fileBuffer, fileName, userContacts) => {
  const subject = config.mailer.notify.subject;
  const fileFullName = fileName + '.pdf';
  const attachments = [{
    filename: fileFullName,
    content: fileBuffer,
  }];
  let message = config.mailer.notify.message;

  message = message.replace(/\${phone}/, userContacts.phone);
  message = message.replace(/\${method}/, userContacts.method);
  message = message.replace(/\${vin}/, fileName);

  sendMail(subject, message, attachments);
};
