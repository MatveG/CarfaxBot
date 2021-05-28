import config from '../loaders/config';
import cleanExpiredOrders from './cleanExpiredOrders';
import {find, insert} from '../utils/nedbOrm';

describe('Event cleanExpiredOrders', () => {
  it('Should remove Orders created more than 24 hours ago', async () => {
    const order = {
      chatId: 12345,
      sum: 30,
      vin: '12345',
      translate: false,
      contacts: {},
      status: 0,
      attempts: 0,
      created: new Date(Date.now() - (config.orderExpire + 1) * 24*60*60*1000).getTime(),
      paid: Date.now(),
    };
    const orderId = await insert('orders', order);

    await cleanExpiredOrders();

    expect(await find('orders', orderId)).toBe(undefined);
  });
});
