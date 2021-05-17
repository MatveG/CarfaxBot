import nedb from '../loaders/nedb';
import clearOrders from './clearOrders';
import {findOrder} from '../utils/orderActions';

describe('Event clearOrders', () => {
  it('Should remove Orders created more than 1 hour ago', async () => {
    const order = {
      chatId: 12345,
      sum: 30,
      vin: '12345',
      translate: false,
      paid: false,
      submitted: false,
      downloaded: false,
      attempts: 0,
      created: new Date(Date.now() - 61 * 60 * 1000).getTime(),
      updated: Date.now(),
    };
    const orderId = await new Promise((resolve) => {
      nedb.insert(order, (error, row) => {
        resolve(row._id);
      });
    });

    await clearOrders();

    expect(await findOrder(orderId)).toBe(undefined);
  });

  it('Should remove paid Orders with 10+ attempts and updated 10+ minutes ago', async () => {
    const order = {
      chatId: 12345,
      sum: 30,
      vin: '12345',
      translate: false,
      paid: true,
      submitted: false,
      downloaded: false,
      attempts: 11,
      created: Date.now(),
      updated: new Date(Date.now() - 11 * 60 * 1000).getTime(),
    };
    const orderId = await new Promise((resolve) => {
      nedb.insert(order, (error, row) => {
        resolve(row._id);
      });
    });

    await clearOrders();

    expect(await findOrder(orderId)).toBe(undefined);
  });
});
