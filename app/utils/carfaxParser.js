import fs from 'fs';
import request from 'request';
import config from '../loaders/config';
import sendMail from './sendMail';

const {PARSER_USER, PARSER_PASS} = process.env;
const baseUrl = config.parser.baseUrl;
const submitUrl = baseUrl + config.parser.submitPath;
const downloadUrl = baseUrl + config.parser.downloadPath;
const parser = request.defaults({
  jar: request.jar(),
  method: 'GET',
  headers: {...config.parser.headers},
});
const authRequest = {
  url: config.parser.baseUrl,
  method: 'POST',
  form: {
    ...config.parser.auth,
    username: PARSER_USER,
    password: PARSER_PASS,
  },
};

if (!fs.existsSync(config.downloadDir)) {
  fs.mkdirSync(config.downloadDir);
}

export const submitVin = (vinCode, translate) => {
  return new Promise(async (resolve, reject) => {
    try {
      await authorise();
    } catch (error) {
      return reject(error);
    }

    const url = submitUrl.replace(/\${vin}/g, vinCode).replace(/\${translate}/g, +translate);

    parser({url}, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reportError('Parser failed to make submit request', error);
        return reject(error || new Error('Parser failed to make submit request'));
      }

      return resolve(body.indexOf('"success":true') >= 0);
    });
  });
};

export const downloadVin = (vinCode, translate) => {
  return new Promise(async (resolve, reject) => {
    const fileName = `${config.downloadDir}/${vinCode}` + (translate ? '.rus.pdf' : '.pdf');
    const options = {
      url: downloadUrl.replace(/\${vin}/g, vinCode).replace(/\${translate}/g, +translate),
      headers: {'Accept': 'application/pdf'},
    };

    try {
      if (await authorise() || await fileExists(options)) {
        parser
            .get(options)
            .on('end', () => {
              resolve(true);
            })
            .pipe(fs.createWriteStream(fileName));
      }
      resolve(false);
    } catch (error) {
      reportError('Parser failed to download file', error);
      reject(error);
    }
  });
};

function authorise() {
  return new Promise((resolve, reject) => {
    parser(authRequest, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reportError('Parser failed to authorise', error);
        return reject(error || new Error('Parser failed to authorise'));
      }

      return resolve(true);
    });
  });
};

function fileExists(options) {
  return new Promise(async (resolve, reject) => {
    parser(options, (error, response, body) => {
      if (error || (response.statusCode !== 200 && response.statusCode !== 404)) {
        reportError('Parser failed to check file exists', error);
        return reject(error || Error('Parser failed to check file exists'));
      }

      return resolve(body.indexOf('файл не найден') === -1);
    });
  });
}

function reportError(errorMsg, errorObj) {
  const subject = config.mailer.error.subject;
  const message = config.mailer.error.message
      .replace(/\${msg}/, String(errorMsg))
      .replace(/\${error}/, String(errorObj));

  sendMail(subject, message);
};
