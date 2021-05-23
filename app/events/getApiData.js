import fs from 'fs';
import config from '../loaders/config';
import {submitCarfax, downloadCarfax, checkCarfax} from '../utils/carfaxApi';
import {selectOrders, updateOrder} from '../utils/ordersDB';

export default async () => {
  const orders = await selectOrders({status: {$in: [1, 2, 3]}});

  for (const {_id, status, vin, translate, attempts, updated} of orders) {
    const filePath = `${config.archive}/${vin}.${translate ? 'rus.pdf' : 'pdf'}`;
    const shouldBeReady = Date.now() - updated > 3 * 60 * 1000;

    if (status === 1 && fs.existsSync(filePath)) {
      await updateOrder(_id, {status: 4});
    } else if (status === 1 && await submitCarfax(vin, translate)) {
      await updateOrder(_id, {status: 2});
    } else if (status === 2 && shouldBeReady && await checkCarfax(vin, translate)) {
      await updateOrder(_id, {status: 3});
    } else if (status === 3 && await downloadCarfax(vin, translate)) {
      await updateOrder(_id, {status: 4});
    } else if (shouldBeReady) {
      await updateOrder(_id, {attempts: attempts + 1});
    }
  }
};
