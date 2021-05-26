import fs from 'fs';
import axios from 'axios';
import config from '../loaders/config';
import logger from '../loaders/logger';

const {CARFAX_KEY} = process.env;
axios.defaults.baseURL = config.carfax.apiUrl;

export const submitCarfax = async (vinCode, translate = false) => {
  try {
    const {data} = await axios.get(getSubmitUrl(vinCode, translate));
    return data.success || !data.success && Object.keys(data.errors)[0] === '6';
  } catch (error) {
    logger.error('Carfax api error', error);
    return false;
  }
};

export const checkCarfax = async (vinCode, translate = false) => {
  try {
    const {data} = await axios.get(getCheckUrl(vinCode, translate));
    return data.success;
  } catch (error) {
    logger.error('Carfax api error', error);
    return false;
  }
};

export const downloadCarfax = async (vinCode, translate = false) => {
  const filePath = `${config.archive}/${vinCode}` + (translate ? '.rus.pdf' : '.pdf');

  try {
    const stream = fs.createWriteStream(filePath);
    const {data} = await axios({
      url: getDownloadUrl(vinCode, translate),
      method: 'GET',
      responseType: 'stream',
    });

    await new Promise((resolve, reject) => {
      console.log('Promise');

      data.pipe(stream);
      stream.on('error', (error) => {
        reject(error);
        console.log('error', error);
      });
      stream.on('finish', () => {
        resolve();
        console.log('resolve');
      });
    });

    return fs.existsSync(filePath);
  } catch (error) {
    logger.error('Carfax api error', error);
    return false;
  }
};

export function getSubmitUrl(vinCode, translate) {
  const callbackUrl = config.botHost + config.carfax.callbackUrl +
    config.carfax.callbackParams.replace(/\${vin}/g, vinCode);

  return config.carfax.actions.add
      .replace(/\${key}/g, CARFAX_KEY)
      .replace(/\${vin}/g, vinCode)
      .replace(/\${translate}/g, +translate)
      .replace(/\${callback}/g, encodeURIComponent(callbackUrl));
}

export function getCheckUrl(vinCode, translate) {
  return config.carfax.actions.check
      .replace(/\${key}/g, CARFAX_KEY)
      .replace(/\${vin}/g, vinCode)
      .replace(/\${translate}/g, +translate);
}

export function getDownloadUrl(vinCode, translate) {
  return config.carfax.actions.get
      .replace(/\${key}/g, CARFAX_KEY)
      .replace(/\${vin}/g, vinCode)
      .replace(/\${translate}/g, +translate);
}
