import logger from '../loaders/logger';
import {submitVin, downloadVin} from '../utils/vinParser';
import {selectOrders, updateOrder} from '../utils/orderActions';

export default async () => {
  const orders = await selectOrders({downloaded: false});

  for (const {vin, translate, submitted, attempts} of orders) {
    try {
      if (submitted && await downloadVin(vin, translate)) {
        return await updateOrder(_id, {downloaded: true});
      } else if (await submitVin(vin, translate)) {
        return await updateOrder(_id, {submitted: true});
      }
      await updateOrder(_id, {attempts: attempts + 1});
    } catch (error) {
      logger.error('Parser failed to submit request', error);
    }
  }
};

