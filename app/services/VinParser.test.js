import fs from 'fs';
import nock from 'nock';
import fullConfig from '../loaders/config';
import VinParser from './VinParser';

const config = fullConfig.parser;

const directory = './download/';
const fakeVin = 'ASD1234567890';
const realVin = 'JM1GJ1W52G1404748';
const translate = false;

const unlinkIfExists = async (fileName) => {
  if (await fs.existsSync(fileName)) {
    await fs.unlinkSync(fileName);
  }
};

describe('VinParser - _authorise()', () => {
  it('Should return Promise with empty string body', async () => {
    await new Promise((resolve, reject) => {
      const fn = VinParser._authorise()
          .then((data) => {
            expect(data).toBeDefined();
            expect(data).toBe('');
            resolve();
          })
          .catch((err) => reject(err));

      expect(fn).toBeInstanceOf(Promise);
    });
  });

  it('Should reject if response status code is wrong', async () => {
    await nock(config.baseUrl).post('/').reply(404);
    await expect(VinParser._authorise()).rejects.toThrowError();
    await nock.cleanAll();
  });
});

describe('VinParser - _fileExists()', () => {
  it('Should return true for an existing VIN number', async () => {
    const url = config.baseUrl + config.downloadPath
        .replace(/\${vin}/, realVin)
        .replace(/\${translate}/, +translate);
    const options = {url, headers: {'Accept': 'application/pdf'}};

    await VinParser._authorise();
    const result = await VinParser._fileExists(options);

    expect(result).toBe(true);
  });

  it('Should return false for an fake VIN number', async () => {
    const url = config.baseUrl + config.downloadPath
        .replace(/\${vin}/, fakeVin)
        .replace(/\${translate}/, +translate);
    const options = {url, headers: {'Accept': 'application/pdf'}};

    await VinParser._authorise();
    const result = await VinParser._fileExists(options);

    expect(result).toBe(false);
  });
});

describe('VinParser - submit()', () => {
  let result;

  beforeAll(async () => {
    result = await VinParser.submit(fakeVin, translate);
  });

  it('Should return a boolean value', () => {
    expect(result).toBeDefined();
    expect(result === true || result === false).toBe(true);
  });

  it('Should reject if response status code is wrong', async () => {
    const path = config.submitPath
        .replace(/\${vin}/, fakeVin)
        .replace(/\${translate}/, +translate);

    await nock(config.baseUrl, {allowUnmocked: true}).get(path).reply(404);
    await expect(VinParser.submit(fakeVin, translate)).rejects.toThrowError();
    await nock.cleanAll();
  });
});

describe('VinParser download()', () => {
  let result;

  beforeAll(async () => {
    result = await VinParser.download(fakeVin, translate);
  });

  it('Should return false value', () => {
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  it('Should return a file', async () => {
    const fileName = `${directory}${realVin}.pdf`;

    await unlinkIfExists(fileName);
    await VinParser.download(realVin, translate);

    expect(await fs.existsSync(fileName)).toBe(true);

    await unlinkIfExists(fileName);
  });

  it('Should reject if response status code is wrong', async () => {
    const path = config.downloadPath
        .replace(/\${vin}/, fakeVin)
        .replace(/\${translate}/, +translate);

    await nock(config.baseUrl, {allowUnmocked: true}).get(path).reply(304);
    await expect(VinParser.download(fakeVin, translate)).rejects.toThrowError();
    await nock.cleanAll();
  });
});

