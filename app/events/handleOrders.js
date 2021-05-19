import fs from 'fs';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import {submitCarfax, downloadCarfax} from '../utils/carfaxApi';
import {removeOrder, selectOrders, updateOrder} from '../utils/ordersDb';
import {sendBotDocument, sendBotMessage} from '../utils/sendTelegram';
import sendMail from '../utils/sendMail';

export default async () => {
  const orders = await selectOrders({status: {$gt: 0}});

  for (const {_id, chatId, status, vin, translate, contacts, attempts, updated} of orders) {
    if (status === 1) {
      return submitOrder(_id, vin, translate);
    }

    if (status === 2) {
      return downloadOrder(_id, vin, translate, attempts);
    }

    if (status === 3) {
      return completeOrder(_id, chatId, vin, translate, contacts);
    }

    if (attempts >= 30 && Date.now() - updated >= 10 * 60 * 1000) {
      return closeOrder(_id, chatId);
    }
  }
};

async function submitOrder(_id, vin, translate) {
  if (await submitCarfax(vin, translate)) {
    await updateOrder(_id, {status: 2});
  }
}

async function downloadOrder(_id, vin, translate, attempts) {
  const success = await downloadCarfax(vin, translate);
  await updateOrder(_id, success ? {status: 3} : {attempts: attempts + 1});
}

async function completeOrder(_id, chatId, vin, translate, contacts) {
  const filePath = `${config.downloadDir}/${vin}.${translate ? 'rus.pdf' : 'pdf'}`;

  if (fs.existsSync(filePath)) {
    if (contacts.phone) {
      const {subject, message} = config.mailer.notify;
      const {phone, method} = contacts;
      sendMail(subject, message.replace(/\${phone}/, phone).replace(/\${method}/, method));
    }

    await removeOrder(_id);
    await sendBotDocument(chatId, `${vin}.pdf`, filePath);
  }
}

async function closeOrder(_id, chatId, vin) {
  await removeOrder(_id);
  await sendBotMessage(chatId, i18n.t('ru', 'order.error', {vin}));
}
