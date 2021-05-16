import axios from 'axios';
import crypto from 'crypto';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {WAYFORPAY_KEY} = process.env;

export const createInvoice = async (locale, orderId, vinCode, price) => {
  const query = {
    ...config.merchant.query,
    language: locale,
    orderReference: orderId,
    orderDate: Date.now(),
    amount: price,
    productPrice: [price],
    productCount: [1],
  };
  query.productName = [query.productName.replace(/\${vin}/g, vinCode)],
  query.merchantSignature = getRequestSignature(query);
  let data = {};

  try {
    data = (await axios.post(config.merchant.url, query)).data;
  } catch (error) {
    logger.error('Failed to request WayForPay invoice', error);
  }

  return data.reason === 'Ok' && data.invoiceUrl;
};

export function getRequestSignature(request) {
  return crypto.createHmac('md5', WAYFORPAY_KEY).update([
    request.merchantAccount,
    request.merchantDomainName,
    request.orderReference,
    request.orderDate,
    request.amount,
    request.currency,
    request.productName[0],
    request.productCount[0],
    request.productPrice[0],
  ].join(';')).digest('hex');
}

export function getSomeSignature(request) {
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

