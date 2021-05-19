import axios from 'axios';
import config from '../loaders/config';
import logger from '../loaders/logger';
import fs from 'fs';

axios.defaults.baseURL = config.carfax.apiUrl;

export const submitCarfax = async (vinCode, translate) => {
  const urlPath = config.carfax.actions.add
      .replace(/\${vin}/g, vinCode)
      .replace(/\${translate}/g, +translate);

  try {
    await axios.get(urlPath);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const checkCarfax = async (vinCode, translate) => {
  const urlPath = config.carfax.actions.check
      .replace(/\${vin}/g, vinCode)
      .replace(/\${translate}/g, +translate);

  try {
    await axios.get(urlPath);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export const downloadCarfax = async (vinCode, translate) => {
  const filePath = `${config.downloadDir}/${vinCode}` + (translate ? '.rus.pdf' : '.pdf');
  const urlPath = config.carfax.actions.get
      .replace(/\${vin}/g, vinCode)
      .replace(/\${translate}/g, +translate);

  try {
    const response = await axios({
      url: urlPath,
      method: 'GET',
      responseType: 'stream',
    });

    await response.data.pipe(fs.createWriteStream(filePath));
    return true;
  } catch (error) {
    logger.error('Failed to download carfax report', error);
    return false;
  }
};
