import axios from 'axios';
import crypto from 'crypto';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {WAYFORPAY_KEY} = process.env;
const hasher = crypto.createHmac('md5', WAYFORPAY_KEY);

export const createInvoice = async (locale, orderId, vinCode, price) => {
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

  query.merchantSignature = hasher.update([
    query.merchantAccount,
    query.merchantDomainName,
    query.orderReference,
    query.orderDate,
    query.amount,
    query.currency,
    query.productName[0],
    query.productCount[0],
    query.productPrice[0],
  ].join(';')).digest('hex');

  try {
    const {data} = await axios.post('https://api.wayforpay.com/api', query);

    if (data.reasonCode === 1100) {
      return data.invoiceUrl;
    }
  } catch (error) {
    logger.error('Failed to create WayForPay invoice', error);
  }

  return false;
};

export const checkInvoice = () => {

};
