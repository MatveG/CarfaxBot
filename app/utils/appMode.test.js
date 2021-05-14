import axios from 'axios';
import config from '../loaders/config';
import {prodMode} from './appMode';
import crypto from 'crypto';

const {PORT, WAYFORPAY_KEY} = process.env;

describe('Method prodMode', () => {
  const serviceUrl = `http://localhost:${PORT || 3000}${config.merchant.create.serviceUrl}`;
  const query = {
    'merchantAccount': config.merchant.merchantAccount,
    'orderReference': 'myOrder1',
    'merchantSignature': '',
    'amount': '1547.36',
    'currency': 'UAH',
    'authCode': '541963',
    'email': 'client@mail.ua',
    'phone': '380501234567',
    'createdDate': '',
    'processingDate': '',
    'cardPan': '4102****8217',
    'cardType': 'visa',
    'issuerBankCountry': '980',
    'issuerBankName': 'Privatbank',
    'recToken': '',
    'transactionStatus': 'Approved',
    'reason': '1100',
    'reasonCode': '',
    'fee': '',
    'paymentSystem': 'card',

    // ...merchant.create,
    // language: locale,
    // orderReference: orderId,
    // orderDate: Date.now(),
    // amount: price,
    // productName: [merchant.create.productName.replace(/\${vin}/g, vinCode)],
    // productPrice: [price],
    // productCount: [1],
  };
  let emptyData;
  let queryData;

  beforeAll(async () => {
    prodMode();

    emptyData = (await axios.post(serviceUrl, {})).data;
    queryData = (await axios.post(serviceUrl, query)).data;
  });

  it('Should refuse incorrect request', () => {
    expect(emptyData).toBeDefined();
    expect(emptyData.status).toBe('refuse');
  });

  it('Should reply on POST requests', () => {
    expect(queryData).toBeDefined();
    expect(queryData.orderReference).toBeDefined();
    expect(queryData.status).toBeDefined();
    expect(queryData.time).toBeDefined();
    expect(queryData.signature).toBeDefined();
    expect(emptyData.status).toBe('accept');
  });

  it('Should return correct signature', () => {
    const hasher = crypto.createHmac('md5', WAYFORPAY_KEY);
    const signature = hasher.update([
      queryData.orderReference,
      queryData.status,
      queryData.time,
    ].join(';')).digest('hex');

    expect(queryData.signature).toBe(signature);
  });
});
