import fs from 'fs';
import config from '../loaders/config';
import logger from '../loaders/logger';

export default () => {
  if (!fs.existsSync(config.archive)) {
    return false;
  }

  try {
    fs.readdirSync(config.archive).forEach((file) => {
      const filePath = `${config.archive}/${file}`;
      const fileAge = (Date.now() - fs.statSync(filePath).mtimeMs)/1000/60/60/30;

      if (fileAge > config.carfaxExpire) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    logger.error(error);
  }
};
