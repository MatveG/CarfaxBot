import {selectOrders, removeOrder} from '../utils/ordersDb';

export default async () => {
  const orders = await selectOrders({});

  for (const {_id, status, created} of orders) {
    if (status === 0 && Date.now() - created >= 24 * 60 * 60 * 1000) {
      await removeOrder(_id);
    }
  }
};

