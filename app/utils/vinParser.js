import fs from 'fs';
import request from 'request';
import config from '../loaders/config';

const jar = request.jar();
const parser = request.defaults({
  jar,
  method: 'GET',
  headers: {...config.parser.headers},
});

export const parserAuth = () => {
  const options = {
    url: config.parser.baseUrl,
    method: 'POST',
    form: {...config.parser.auth},
  };

  return new Promise((resolve, reject) => {
    parser(options, (error, response, body) => {
      if (error || response.statusCode !== 302) {
        return reject(error || new Error('Parser failed to authorise'));
      }

      resolve(body);
    });
  });
};

export const submitRequest = (vinNumber, translate) => {
  const url = config.parser.baseUrl + config.parser.submitPath
      .replace(/\${vin}/, vinNumber)
      .replace(/\${translate}/, +translate);
  const options = {url};

  return new Promise(async (resolve, reject) => {
    await parserAuth();

    parser(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return reject(error || new Error('Parser failed to make submit request'));
      }

      if (body.indexOf('"success":false') >= 0) {
        return resolve(false);
      }

      resolve(body);
    });
  });
};

export const downloadRequest = (vinNumber, translate) => {
  const url = config.parser.baseUrl + config.parser.downloadPath
      .replace(/\${vin}/, vinNumber)
      .replace(/\${translate}/, +translate);
  const options = {url, headers: {'Accept': 'application/pdf'}};

  return new Promise(async (resolve, reject) => {
    await parserAuth();

    parser(options, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return reject(error || new Error('Parser failed to make download request'));
      }

      if (body.indexOf('файл не найден') >= 0) {
        return resolve(false);
      }

      resolve();
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(`./download/${vinNumber}.pdf`);

      parser
          .get(options)
          .on('error', (err) => {
            reject(err);
          })
          .on('end', () => {
            resolve();
          })
          .pipe(fileStream);
    });
  });
};


// vin
// {"success":true,"errors":[],"quene":1}
// {"success":false,"errors":[" - \u043e\u0448\u0438\u0431\u043e\u0447\u043d\u043e\u0435
// \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u0434\u043b\u0438\u043d\u044b
// \u043f\u043e\u043b\u044f \"VIN\""],"quene":0}

// download
// файл не найден
