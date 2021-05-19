import fs from 'fs';
import config from '../loaders/config';
import logger from '../loaders/logger';

export default () => {
  if (!fs.existsSync(config.downloadDir)) {
    return false;
  }

  try {
    fs.readdirSync(config.downloadDir).forEach((file) => {
      const filePath = `${config.downloadDir}/${file}`;
      const fileAge = (Date.now() - fs.statSync(filePath).mtimeMs)/1000/60/60/30;

      if (fileAge > config.expirationDays) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    logger.error(error);
  }
};
