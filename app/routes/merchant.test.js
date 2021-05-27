import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import merchant from './merchant';
import config from '../loaders/config';
import {getIncomingSignature} from '../utils/merchantApi';
import {findOrder, insertOrder, removeOrder} from '../utils/ordersDB';

const {PORT, WAYFORPAY_USER, WAYFORPAY_KEY} = process.env;
const server = express();
const callbackUrl = `http://localhost:${PORT || 3000}${config.merchant.callbackUrl}`;
const trueQuery = {
  merchantAccount: WAYFORPAY_USER,
  orderReference: 'myOrder1',
  amount: '30',
  currency: 'UAH',
  authCode: '541963',
  email: 'client@mail.ua',
  phone: '380501234567',
  createdDate: '',
  processingDate: '',
  cardPan: '4102****8217',
  cardType: 'visa',
  issuerBankCountry: '980',
  issuerBankName: 'Privatbank',
  recToken: '',
  transactionStatus: 'Approved',
  reason: 'Ok',
  reasonCode: '1100',
  fee: '',
  paymentSystem: 'card',
};
const falseQuery = {
  ...trueQuery,
  orderReference: '0000000000',
};
falseQuery.merchantSignature = getIncomingSignature(falseQuery);

describe('Route merchant', () => {
  let fakeOrderId;
  let trueQueryData;

  beforeAll(async () => {
    await new Promise((resolve) => {
      server.use(merchant);
      server.listen(PORT || 3000, () => resolve());
    });

    fakeOrderId = await insertOrder(1234567, 'ru', 30, 'JM1GJ1W11G1234567');
    trueQuery.orderReference = fakeOrderId;
    trueQuery.merchantSignature = getIncomingSignature(trueQuery);
    trueQueryData = (await axios.post(callbackUrl, JSON.stringify(trueQuery))).data;
  });

  afterAll(async () => {
    await removeOrder(fakeOrderId);
  });

  it('Should refuse incorrect request', async () => {
    const emptyQueryData = (await axios.post(callbackUrl, JSON.stringify({}))).data;
    expect(emptyQueryData).toBeDefined();
    expect(emptyQueryData.status).toBe('refuse');
  });

  it('Should reply on POST requests', () => {
    expect(trueQueryData).toBeDefined();
    expect(trueQueryData.orderReference).toBeDefined();
    expect(trueQueryData.status).toBeDefined();
    expect(trueQueryData.time).toBeDefined();
    expect(trueQueryData.signature).toBeDefined();
    expect(trueQueryData.status).toBe('accept');
  });

  it('Should change order status to 1', async () => {
    const order = await findOrder(fakeOrderId);

    expect(order).toBeDefined();
    expect(order.status).toBe(1);
  });

  it('Should return correct signature', () => {
    const hasher = crypto.createHmac('md5', WAYFORPAY_KEY);
    const signature = hasher.update([
      trueQueryData.orderReference,
      trueQueryData.status,
      trueQueryData.time,
    ].join(';')).digest('hex');

    expect(trueQueryData.signature).toBe(signature);
  });

  it('Should refuse if order does not exists', async () => {
    const falseQueryData = (await axios.post(callbackUrl, JSON.stringify(falseQuery))).data;

    expect(falseQueryData).toBeDefined();
    expect(falseQueryData.status).toBe('refuse');
  });
});
