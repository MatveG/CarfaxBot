import express from 'express';
import config from '../loaders/config';
import {updateOrders} from '../utils/ordersDB';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get(config.carfax.callbackUrl, async (request, response) => {
  const vin = request.query.vin;

  if (vin) {
    await updateOrders({vin, status: 2}, {status: 3});

    return response.send({success: true});
  }
  response.send({success: false});
});

export default router;
