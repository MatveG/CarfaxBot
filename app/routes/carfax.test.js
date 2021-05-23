import axios from 'axios';
import express from 'express';
import carfax from './carfax';
import config from '../loaders/config';
import {findOrder, insertOrder, removeOrder, updateOrder} from '../utils/ordersDB';

const {PORT} = process.env;
const server = express();

describe('Route carfax', () => {
  let fakeOrderId;
  let queryData;

  beforeAll(async () => {
    await new Promise((resolve) => {
      server.use(carfax);
      server.listen(PORT || 3000, () => resolve());
    });

    const vinCode = 'JM1GJ1W11G1234567';
    fakeOrderId = await insertOrder(1234567, 30, 'JM1GJ1W11G1234567');
    const callbackUrl = `http://localhost:${PORT||3000}${config.carfax.callbackUrl}?vin=${vinCode}`;

    await updateOrder(fakeOrderId, {status: 2});
    queryData = await axios.get(callbackUrl);
  });

  afterAll(async () => {
    await removeOrder(fakeOrderId);
  });

  it('Should reply on GET requests', () => {
    expect(queryData.data).toBeDefined();
    expect(queryData.data.success).toBeDefined();
    expect(queryData.data.success).toBe(true);
  });

  it('Should update orders status', async () => {
    const order = await findOrder(fakeOrderId);

    expect(order).toBeDefined();
    expect(order.status).toBe(3);
  });
});
