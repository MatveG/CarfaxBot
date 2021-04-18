import sendMail from '../utils/sendMail';
import config from '../loaders/config';

export default (userContacts, carfaxFile) => {
  let msgBody = config.mailer.content.message;
  const fileName = userContacts.vin + '.pdf';

  msgBody = msgBody.replace(/\${phone}/, userContacts.phone);
  msgBody = msgBody.replace(/\${method}/, userContacts.method);
  msgBody = msgBody.replace(/\${vin}/, userContacts.vin);

  sendMail(msgBody, carfaxFile, fileName);
};
