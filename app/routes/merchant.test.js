import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import merchant from './merchant';
import config from '../loaders/config';
import {getRequestSignature} from '../utils/wayForPay';
import {findOrder, insertOrder, removeOrder} from '../utils/orderActions';

const {PORT, WAYFORPAY_KEY} = process.env;
const server = express();
const serviceUrl = `http://localhost:${PORT || 3000}${config.merchant.serviceUrl}`;
const trueQuery = {
  merchantAccount: config.merchant.query.merchantAccount,
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
  reason: '1100',
  reasonCode: '',
  fee: '',
  paymentSystem: 'card',
};
const falseQuery = {
  ...trueQuery,
  orderReference: '0000000000',
};
falseQuery.merchantSignature = getRequestSignature(falseQuery);

describe('Method prodMode', () => {
  let fakeOrderId;
  let emptyQueryData;
  let trueQueryData;
  let falseQueryData;

  beforeAll(async () => {
    await new Promise((resolve) => {
      server.use(express.json());
      server.use(merchant);
      server.listen(PORT || 3000, () => resolve());
    });

    fakeOrderId = await insertOrder(1234567, 30, 'JM1GJ1W11G1234567');
    trueQuery.orderReference = fakeOrderId;
    trueQuery.merchantSignature = getRequestSignature(trueQuery);

    emptyQueryData = (await axios.post(serviceUrl, {})).data;
    trueQueryData = (await axios.post(serviceUrl, trueQuery)).data;
    falseQueryData = (await axios.post(serviceUrl, falseQuery)).data;
  });

  afterAll(async () => {
    await removeOrder(fakeOrderId);
  });

  it('Should refuse incorrect request', () => {
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

  it('Should update order paid status', async () => {
    const order = await findOrder(fakeOrderId);

    expect(order.paid).toBeDefined();
    expect(order.paid).toBe(true);
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

  it('Should refuse if order does not exists', () => {
    expect(falseQueryData).toBeDefined();
    expect(falseQueryData.status).toBe('refuse');
  });
});
