import fs from 'fs';
import request from 'request';
import config from '../loaders/config';
import events from '../loaders/events';

const {PARSER_USER: username, PARSER_PASS: password} = process.env;
const jar = request.jar();
const parser = request.defaults({
  jar,
  method: 'GET',
  headers: {...config.parser.headers},
});

export default class VinParser {
  static submit(vinCode, translate) {
    const url = config.parser.baseUrl + config.parser.submitPath
        .replace(/\${vin}/g, vinCode)
        .replace(/\${translate}/g, +translate);
    const options = {url};

    return new Promise(async (resolve, reject) => {
      try {
        await this._authorise();
      } catch (error) {
        return reject(error);
      }

      parser(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          events.emit('errorParsing', 'Parser failed to make submit request', error);
          return reject(error || new Error('Parser failed to make submit request'));
        }

        return resolve(body.indexOf('"success":true') >= 0);
      });
    });
  };

  static download(vinCode, translate) {
    const url = config.parser.baseUrl + config.parser.downloadPath
        .replace(/\${vin}/g, vinCode)
        .replace(/\${translate}/g, +translate);
    const options = {url, headers: {'Accept': 'application/pdf'}};
    const fileName = `${fullConfig.downloadDir}/${vinCode}` + (translate ? '.rus.pdf' : '.pdf');

    return new Promise(async (resolve, reject) => {
      try {
        await this._authorise();

        if (!await this._fileExists(options)) {
          return resolve(false);
        }
      } catch (err) {
        return reject(err);
      }

      if (!fs.existsSync(config.downloadDir)) {
        fs.mkdirSync(config.downloadDir);
      }

      parser
          .get(options)
          .on('error', (error) => {
            events.emit('errorParsing', 'Parser failed to download file', error);
            reject(error);
          })
          .on('response', function(response) {
            if (response.statusCode !== 200) {
              events.emit('errorParsing', 'Parser failed to download file', {});
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
      url: config.parser.baseUrl,
      method: 'POST',
      form: {...config.parser.auth, username, password},
    };

    return new Promise((resolve, reject) => {
      parser(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          events.emit('errorParsing', 'Parser failed to authorise', error);
          return reject(error || new Error('Parser failed to authorise'));
        }

        return resolve(body);
      });
    });
  };

  static _fileExists(options) {
    return new Promise(async (resolve, reject) => {
      parser(options, (error, response, body) => {
        if (error || (response.statusCode !== 200 && response.statusCode !== 404)) {
          events.emit('errorParsing', 'Parser failed to check file exists', error);
          return reject(error || Error('Parser failed to check file exists'));
        }

        return resolve(body.indexOf('файл не найден') === -1);
      });
    });
  }
}
