import express from 'express';
import config from '../loaders/config';
import {getIncomingSignature, getResponseSignature} from '../utils/merchantApi';
import {findOrder, updateOrder} from '../utils/ordersDB';
import {botSendMessage} from '../utils/botSend';
import i18n from '../loaders/i18n';

// eslint-disable-next-line new-cap
const router = express.Router();
router.use(parseBody);

router.post(config.merchant.callbackUrl, async ({body}, response) => {
  const bodyData = JSON.parse(body);
  const {orderReference, merchantSignature, transactionStatus} = bodyData;
  const verified = merchantSignature === getIncomingSignature(bodyData);
  const responseBody = {
    status: verified ? 'accept' : 'refuse',
    orderReference: orderReference,
    time: Date.now(),
  };
  responseBody.signature = getResponseSignature(responseBody);

  if (verified && transactionStatus === 'Approved') {
    const order = await findOrder(orderReference);

    if (order) {
      await updateOrder(order._id, {status: 1, paid: Date.now()});
      await botSendMessage(order.chatId, i18n.t(order.locale, 'order.paid'));
    }
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
