import i18n from '../loaders/i18n';
import {selectOrders, removeOrder} from '../utils/orderActions';
import {sendBotMessage} from '../utils/sendBot';

export default async () => {
  const orders = await selectOrders({});

  for (const {_id, chatId, vin, paid, attempts, created, updated} of orders) {
    if (paid === false && Date.now() - created >= 60 * 60 * 1000) {
      await removeOrder(_id);
    }

    if (paid === true && attempts >= 10 && Date.now() - updated >= 10 * 60 * 1000) {
      await removeOrder(_id);
      try {
        await sendBotMessage(chatId, i18n.t('ru', 'order.error', {vin}));
      } catch (error) {
        console.error(error);
      }
    }
  }
};

