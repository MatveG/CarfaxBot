import fs from 'fs';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import {removeOrder, selectOrders} from '../utils/ordersDB';
import {botSendDocument, botSendMessage} from '../utils/botSend';
import sendMail from '../utils/sendMail';

export default async () => {
  const orders = await selectOrders({status: {$gt: 0}});

  for (const {_id, chatId, locale, status, vin, translate, contacts, attempts, paid} of orders) {
    const filePath = `${config.archive}/${vin}.${translate ? 'rus.pdf' : 'pdf'}`;

    if (status === 4 && fs.existsSync(filePath)) {
      await botSendDocument(chatId, `${vin}.pdf`, filePath);
      await botSendMessage(chatId, i18n.t(locale, 'order.finish'));
      await removeOrder(_id);

      if (Object.keys(contacts).length) {
        sendMail(config.mailer.notify.subject, config.mailer.notify.message
            .replace(/\${phone}/, contacts.phone)
            .replace(/\${method}/, contacts.method),
        );
      }
    } else if (attempts > 40 && Date.now()-paid > 10*60*1000) {
      await botSendMessage(chatId, i18n.t(locale, 'order.error', {vin}));
      await removeOrder(_id);
    }
  }
};
