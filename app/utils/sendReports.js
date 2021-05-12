import fs from 'fs';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import logger from '../loaders/logger';
import nedb from '../loaders/nedb';

let telegram;

export default (telegramInstance) => {
  telegram = telegramInstance;

  nedb.find({}, (err, rows) => {
    if (err) {
      return logger.error('DB error', err);
    }

    rows.forEach(sendReport);
  });
};

async function sendReport({_id, vin, translate, chatId, attempts, created}) {
  const filePath = `${config.downloadDir}/${vin}` + (translate ? '.rus.pdf' : '.pdf');
  const timePassed = Date.now() - created;

  if (fs.existsSync(filePath)) {
    await sendCarfaxReport(chatId, vin, filePath, telegram);
    nedb.remove({_id});
  } else if (attempts >= 10 && timePassed >= 10 * 60 * 1000) {
    await sendEmptyReport(chatId, vin, telegram);
    nedb.remove({_id});
    logger.info('Failed to obtain result for: ' + vin);
  }
}

function sendCarfaxReport(chatId, vin, filePath) {
  return telegram.sendDocument(chatId, {
    source: fs.readFileSync(filePath),
    filename: `${vin}.pdf`,
  });
}

function sendEmptyReport(chatId, vin) {
  return telegram.sendMessage(chatId, i18n.t('ru', 'order.error', {vin}));
}
