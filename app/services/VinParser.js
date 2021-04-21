import fs from 'fs';
import request from 'request';
import fullConfig from '../loaders/config';

const config = fullConfig.parser;

const jar = request.jar();
const parser = request.defaults({
  jar,
  method: 'GET',
  headers: {...config.headers},
});

export default class VinParser {
  static submit(vinCode, translate) {
    const url = config.baseUrl + config.submitPath
        .replace(/\${vin}/, vinCode)
        .replace(/\${translate}/, +translate);
    const options = {url};

    return new Promise(async (resolve, reject) => {
      await this._authorise();

      parser(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return reject(error || new Error('Parser failed to make submit request'));
        }

        if (body.indexOf('"success":false') >= 0) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  };

  static download(vinCode, translate) {
    const url = config.baseUrl + config.downloadPath
        .replace(/\${vin}/, vinCode)
        .replace(/\${translate}/, +translate);
    const options = {url, headers: {'Accept': 'application/pdf'}};
    const fileName = `${fullConfig.downloadDir}/${vinCode}.pdf`;

    return new Promise(async (resolve, reject) => {
      let exists;

      try {
        await this._authorise();
        exists = await this._fileExists(options);
      } catch (err) {
        reject(err);
      }

      if (!exists) {
        return resolve(false);
      }

      parser
          .get(options)
          .on('error', (err) => {
            reject(err);
          })
          .on('response', function(response) {
            if (response.statusCode !== 200) {
              reject(new Error('Parser failed to download file'));
            }
          })
          .on('end', () => {
            resolve(true);
          })
          .pipe(fs.createWriteStream(fileName));
    });
  };

  static _authorise() {
    const options = {
      url: config.baseUrl,
      method: 'POST',
      form: {...config.auth},
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

  static _fileExists(options) {
    return new Promise(async (resolve, reject) => {
      await this._authorise();

      parser(options, (error, response, body) => {
        if (error || (response.statusCode !== 200 && response.statusCode !== 404)) {
          return reject(error || Error('Parser failed to check file exists'));
        }

        if (body.indexOf('файл не найден') >= 0) {
          return resolve(false);
        }

        resolve(true);
      });
    });
  }
}
