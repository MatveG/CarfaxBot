import fs from 'fs';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import {sendDocument, sendMessage} from '../utils/sendTelegram';
import {select, remove} from '../utils/nedbOrm';
import sendMail from '../utils/sendMail';

export default async () => {
  const orders = await select('orders', {status: {$gt: 0}});

  for (const {_id, chatId, locale, status, vin, translate, contacts, attempts, paid} of orders) {
    const fileName = `${vin}.${translate ? 'rus.pdf' : 'pdf'}`;
    const filePath = `${config.archive}/${fileName}`;

    if (status === 4 && fs.existsSync(filePath)) {
      await sendDocument(chatId, `${vin}.pdf`, filePath);
      await sendMessage(chatId, i18n.t(locale, 'order.finish'));
      await remove('orders', _id);

      if (Object.keys(contacts).length) {
        const {phone, method} = contacts;
        await notifyAboutCallback(phone, method, vin, fileName, filePath);
      }
    } else if (attempts > 40 && Date.now()-paid > 10*60*1000) {
      await sendMessage(chatId, i18n.t(locale, 'order.error', {vin}));
      await remove('orders', _id);
    }
  }
};

function notifyAboutCallback(phone, method, vin, fileName = '', filePath = '') {
  return sendMail(
      config.mailer.notify.subject,
      config.mailer.notify.message
          .replace(/\${phone}/, phone)
          .replace(/\${method}/, method)
          .replace(/\${vin}/, vin),
      [{
        filename: fileName,
        content: fs.readFileSync(filePath),
      }],
  );
}
