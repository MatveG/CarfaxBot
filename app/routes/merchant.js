import express from 'express';
import config from '../loaders/config';
import events from '../loaders/events';
import {getIncomingSignature, getResponseSignature} from '../utils/createInvoice';
import {findOrder, updateOrder} from '../utils/ordersDb';

// eslint-disable-next-line new-cap
const router = express.Router();
router.use(parseBody);

router.post(config.merchant.callbackUrl, async ({body}, response) => {
  const bodyData = JSON.parse(body);
  const {orderReference, merchantSignature, transactionStatus} = bodyData;
  const order = await findOrder(orderReference);
  const verified = merchantSignature === getIncomingSignature(bodyData);
  const responseBody = {
    status: verified ? 'accept' : 'refuse',
    orderReference: orderReference,
    time: Date.now(),
  };
  responseBody.signature = getResponseSignature(responseBody);

  console.log('Incoming request', bodyData);

  if (order && verified) {
    const {_id} = order;
    await updateOrder(_id, {paid: transactionStatus === 'Approved', updated: Date.now()});
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
