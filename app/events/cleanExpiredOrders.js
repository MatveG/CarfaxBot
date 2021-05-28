import config from '../loaders/config';
import {select, remove} from '../utils/nedbOrm';

export default async () => {
  const orders = await select('orders', {});

  for (const {_id, status, created} of orders) {
    if (status === 0 && Date.now() - created >= config.orderExpire * 24*60*60*1000) {
      await remove('orders', _id);
    }
  }
};

