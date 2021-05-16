import logger from '../loaders/logger';
import {submitVin, downloadVin} from './vinParser';
import {selectOrders, updateOrder} from './orderActions';

export default async () => {
  const orders = await selectOrders({paid: true, downloaded: false});

  orders.forEach((order) => {
    order.submitted ? downloadOrder(order) : submitOrder(order);
  });
};

async function submitOrder({_id, vin, translate, attempts}) {
  try {
    if (await submitVin(vin, translate)) {
      return await updateOrder(_id, {submitted: true});
    }
    await updateOrder(_id, {attempts: attempts + 1});
  } catch (error) {
    logger.error('Parser failed to submit request', error);
  }
}

async function downloadOrder({_id, vin, translate, attempts}) {
  try {
    if (await downloadVin(vin, translate)) {
      return await updateOrder(_id, {downloaded: true});
    }
    await updateOrder(_id, {attempts: attempts + 1});
  } catch (error) {
    logger.error('Parser failed to download request', error);
  }
}
