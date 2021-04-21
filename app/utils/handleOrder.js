import fs from 'fs';
import config from '../loaders/config';
import i18n from '../loaders/i18n';
import logger from '../loaders/logger';
import nedb from '../loaders/nedb';
import VinParser from '../services/VinParser';

export default async (order, telegram) => {
  const {_id, vin, translate, chatId, submitted, downloaded, attempts, created} = order;
  const filePath = `${config.downloadDir}/${vin}` + (translate ? '.rus.pdf' : '.pdf');
  const timePassed = Date.now() - created;

  if (fs.existsSync(filePath)) {
    await replyWithCarfax(chatId, vin, filePath, telegram);

    return nedb.remove({_id});
  }

  if (attempts >= 10 && timePassed >= 10 * 60 * 1000) {
    logger.info('Failed to obtain result for: ' + vin);
    await replyWithError(chatId, telegram);

    return nedb.remove({_id});
  }

  if (!submitted) {
    if (await VinParser.submit(vin, translate)) {
      nedb.update({_id}, {$set: {submitted: true}});
    } else {
      nedb.update({_id}, {$set: {attempts: attempts + 1}});
    }
  } else if (!downloaded) {
    if (await VinParser.download(vin, translate)) {
      nedb.update({_id}, {$set: {downloaded: true}});
    } else {
      nedb.update({_id}, {$set: {attempts: attempts + 1}});
    }
  }
};

async function replyWithCarfax(chatId, vin, filePath, telegram) {
  try {
    await telegram.sendDocument(chatId, {
      source: fs.readFileSync(filePath),
      filename: `${vin}.pdf`,
    });
  } catch (err) {
    logger.error('Failed to reply with report', err);
  }
};

async function replyWithError(chatId, telegram) {
  try {
    await telegram.sendMessage(chatId, i18n.t('ru', 'order.error'));
  } catch (err) {
    logger.error('Failed to reply with report', err);
  }
};
