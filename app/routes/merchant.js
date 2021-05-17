import express from 'express';
import config from '../loaders/config';
import {getIncomingSignature, getResponseSignature} from '../utils/wayForPay';
import {findOrder, updateOrder} from '../utils/orderActions';

const router = express.Router();

router.post(config.merchant.serviceUrl, async (request, response) => {
  console.log('Incoming request', request.body);

  const {orderReference, merchantSignature, transactionStatus} = request.body;
  const time = Date.now();
  const correctSignature = getIncomingSignature(request.body);
  const status = merchantSignature === correctSignature && await findOrder(orderReference);
  const responseBody = {status: status ? 'accept' : 'refuse', orderReference, time};
  responseBody.signature = getResponseSignature(responseBody);

  if (status && transactionStatus === 'Approved') {
    await updateOrder(orderReference, {paid: true, updated: time});
  }

  response.send(responseBody);
});

export default router;
