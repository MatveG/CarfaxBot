import nedb from '../loaders/nedb';
import logger from '../loaders/logger';
import {submitVin, downloadVin} from './vinParser';

export default () => {
  nedb.find({submitted: false, downloaded: false}, (err, rows) => {
    if (err) {
      return logger.error('DB error', err);
    }
    rows.forEach(submitRequest);
  });

  nedb.find({submitted: true, downloaded: false}, (err, rows) => {
    if (err) {
      return logger.error('DB error', err);
    }
    rows.forEach(downloadRequest);
  });
};

async function submitRequest({_id, vin, translate, attempts}) {
  try {
    if (await submitVin(vin, translate)) {
      return nedb.update({_id}, {$set: {submitted: true}});
    }
    nedb.update({_id}, {$set: {attempts: attempts + 1}});
  } catch (error) {
    logger.error('Parser failed to submit request', error);
  }
}

async function downloadRequest({_id, vin, translate, attempts}) {
  try {
    if (await downloadVin(vin, translate)) {
      return nedb.update({_id}, {$set: {downloaded: true}});
    }
    nedb.update({_id}, {$set: {attempts: attempts + 1}});
  } catch (error) {
    logger.error('Parser failed to download request', error);
  }
}
