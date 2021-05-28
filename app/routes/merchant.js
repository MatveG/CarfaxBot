import express from 'express';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import {getIncomingSignature, getResponseSignature} from '../utils/merchantApi';
import {sendMessage} from '../utils/sendTelegram';
import {find, update} from '../utils/nedbOrm';

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
    const order = await find('orders', orderReference);

    if (order) {
      await update('orders', {_id: order._id}, {status: 1, paid: Date.now()});
      await sendMessage(order.chatId, i18n.t(order.locale, 'order.paid'));
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
