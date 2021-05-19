import axios from 'axios';
import crypto from 'crypto';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {WAYFORPAY_USER, WAYFORPAY_KEY} = process.env;

export const createInvoice = async (locale, orderId, vinCode, sum) => {
  const query = {
    ...config.merchant.query,
    merchantAccount: WAYFORPAY_USER,
    language: locale,
    serviceUrl: config.botUrl + config.merchant.callbackUrl,
    orderReference: orderId,
    orderDate: Date.now(),
    amount: sum,
    productPrice: [sum],
    productCount: [1],
  };
  console.log('query', query);
  query.productName = [query.productName.replace(/\${vin}/g, vinCode)],
  query.merchantSignature = getRequestSignature(query);
  let data = {};

  try {
    data = (await axios.post(config.merchant.apiUrl, query)).data;
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

export function getIncomingSignature(request) {
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

