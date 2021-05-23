import express from 'express';
import config from '../loaders/config';
import {getIncomingSignature, getResponseSignature} from '../utils/merchantApi';
import {updateOrder} from '../utils/ordersDB';

// eslint-disable-next-line new-cap
const router = express.Router();
router.use(parseBody);

router.post(config.merchant.callbackUrl, async ({body}, response) => {
  const bodyData = JSON.parse(body);

  console.log('Incoming merchant request', bodyData);

  const {orderReference, merchantSignature, transactionStatus} = bodyData;
  const verified = merchantSignature === getIncomingSignature(bodyData);
  const responseBody = {
    status: verified ? 'accept' : 'refuse',
    orderReference: orderReference,
    time: Date.now(),
  };
  responseBody.signature = getResponseSignature(responseBody);

  if (verified) {
    await updateOrder(orderReference, {
      status: +(transactionStatus === 'Approved'),
      updated: Date.now(),
    });
  }

  response.send(responseBody);
});

function parseBody(request, response, next) {
  request.setEncoding('utf8');
  request.body = '';
  request.on('data', (chunk) => {
    request.body += chunk;
  });
  request.on('end', () => {
    next();
  });
}

export default router;
