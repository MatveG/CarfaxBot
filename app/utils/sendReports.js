import fs from 'fs';
import bot from '../loaders/bot';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import {selectOrders, removeOrder} from './orderActions';

export default async () => {
  const orders = await selectOrders({paid: true});

  for (const {_id, vin, translate, chatId, downloaded, attempts, created} of orders) {
    const filePath = `${config.downloadDir}/${vin}.${translate ? 'rus.pdf' : 'pdf'}`;

    if (downloaded && fs.existsSync(filePath)) {
      await sendCarfaxReport(chatId, vin, filePath);
      await removeOrder(_id);
    } else if (attempts >= 10 && Date.now() - created >= 10 * 60 * 1000) {
      await sendEmptyReport(chatId, vin);
      await removeOrder(_id);
    }
  }
};

function sendCarfaxReport(chatId, vin, filePath) {
  return bot.telegram.sendDocument(
      chatId,
      {
        source: fs.readFileSync(filePath),
        filename: `${vin}.pdf`,
      },
  );
}

function sendEmptyReport(chatId, vin) {
  return bot.telegram.sendMessage(
      chatId,
      i18n.t('ru', 'order.error', {vin}),
  );
}
