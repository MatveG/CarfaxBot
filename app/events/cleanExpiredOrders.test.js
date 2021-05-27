import config from '../loaders/config';
import nedb from '../loaders/nedb';
import cleanExpiredOrders from './cleanExpiredOrders';
import {findOrder} from '../utils/ordersDB';

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
    const orderId = await new Promise((resolve) => {
      nedb.insert(order, (error, row) => {
        resolve(row._id);
      });
    });

    await cleanExpiredOrders();

    expect(await findOrder(orderId)).toBe(undefined);
  });
});
