import fs from 'fs';
import config from '../loaders/config';
import {selectOrders, removeOrder} from '../utils/orderActions';
import {sendBotDocument} from '../utils/sendBot';

export default async () => {
  const orders = await selectOrders({paid: true});

  for (const {_id, vin, translate, chatId, downloaded} of orders) {
    const filePath = `${config.downloadDir}/${vin}.${translate ? 'rus.pdf' : 'pdf'}`;

    if (downloaded && fs.existsSync(filePath)) {
      await removeOrder(_id);
      await sendBotDocument(chatId, `${vin}.pdf`, filePath);
    }
  }
};

