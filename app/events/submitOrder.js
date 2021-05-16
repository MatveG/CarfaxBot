import {insertOrder} from '../utils/orderActions';

export default async (chatId, sum, vin, translate) => {
  await insertOrder(chatId, sum, vin, translate);
};
