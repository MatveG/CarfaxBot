import config from '../loaders/config';
import {selectOrders, removeOrder} from '../utils/ordersDB';

export default async () => {
  const orders = await selectOrders({});

  for (const {_id, status, created} of orders) {
    if (status === 0 && Date.now() - created >= config.orderExpire * 24*60*60*1000) {
      await removeOrder(_id);
    }
  }
};

