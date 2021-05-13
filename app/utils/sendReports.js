import fs from 'fs';
import bot from '../loaders/bot';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import logger from '../loaders/logger';
import nedb from '../loaders/nedb';

export default () => {
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

  try {
    if (fs.existsSync(filePath)) {
      await sendCarfaxReport(chatId, vin, filePath);
      nedb.remove({_id});
    } else if (attempts >= 10 && timePassed >= 10 * 60 * 1000) {
      await sendEmptyReport(chatId, vin);
      nedb.remove({_id});
    }
  } catch (error) {
    logger.error('Failed to send report', error);
  }
}

function sendCarfaxReport(chatId, vin, filePath) {
  return bot.telegram.sendDocument(
      chatId,
      {
        source: fs.readFileSync(filePath),
        filename: `${vin}.pdf`,
      },
  );
}

function sendEmptyReport(chatId, vin) {
  return bot.telegram.sendMessage(
      chatId,
      i18n.t('ru', 'order.error', {vin}),
  );
}
