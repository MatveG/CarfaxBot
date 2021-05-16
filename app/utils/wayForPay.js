import axios from 'axios';
import crypto from 'crypto';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {WAYFORPAY_KEY} = process.env;

export const createInvoice = (locale, orderId, vinCode, price) => {
  const query = {
    ...config.merchant,
    language: locale,
    orderReference: orderId,
    orderDate: Date.now(),
    amount: price,
    productName: [config.merchant.productName.replace(/\${vin}/g, vinCode)],
    productPrice: [price],
    productCount: [1],
  };
  query.merchantSignature = getRequestSignature(query);

  return postToApi(query);
};

export function getRequestSignature(request) {
  return crypto.createHmac('md5', WAYFORPAY_KEY).update([
    request.merchantAccount,
    request.orderReference,
    request.amount,
    request.currency,
    request.authCode,
    request.cardPan,
    request.transactionStatus,
    request.reasonCode,
  ].join(';')).digest('hex');
}

export function getResponseSignature(response) {
  return crypto.createHmac('md5', WAYFORPAY_KEY).update([
    response.orderReference,
    response.status,
    response.time,
  ].join(';')).digest('hex');
}

async function postToApi(query) {
  try {
    const {data} = await axios.post('https://api.wayforpay.com/api', query);

    if (data.reasonCode === 'Ok') {
      return data.invoiceUrl;
    }
  } catch (error) {
    logger.error('Failed to create WayForPay invoice', error);
  }
}
