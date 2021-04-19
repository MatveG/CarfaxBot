import nock from 'nock';
import config from '../loaders/config';
import {authRequest, submitRequest, downloadRequest} from './vinParser';

const fakeVin = 'ASD1234567890';
const existVin = 'JM1GJ1W52G1404748';
const translate = false;

// describe('vinParser - authRequest', () => {
//   it('Should return Promise with empty string body', async () => {
//     await new Promise((resolve, reject) => {
//       const fn = authRequest()
//           .then((data) => {
//             expect(data).toBeDefined();
//             expect(data).toBe('');
//             resolve();
//           })
//           .catch((err) => reject(err));
//
//       expect(fn).toBeInstanceOf(Promise);
//     });
//   });
//
//   it('Should reject if response status code is wrong', async () => {
//     await nock(config.parser.baseUrl).post('/').reply(404);
//     await expect(authRequest()).rejects.toThrowError();
//   });
// });
//
// describe('vinParser - submitRequest', () => {
//   let result;
//
//   beforeAll(async () => {
//     result = await submitRequest(fakeVin, translate);
//   });
//
//   it('Should not return falsy values', () => {
//     expect(result).toBeDefined();
//     expect(!!result).toBe(true);
//   });
//
//   it('Should return a valid JSON string', () => {
//     const resultObj = JSON.parse(result);
//     expect(resultObj).toBeInstanceOf(Object);
//     expect(resultObj.success).toBeDefined();
//     expect(resultObj.success === true || resultObj.success === false).toBe(true);
//   });
//
//   it('Should reject if response status code is wrong', async () => {
//     const path = config.parser.submitPath
//         .replace(/\${vin}/, fakeVin)
//         .replace(/\${translate}/, +translate);
//
//     await nock(config.parser.baseUrl, {allowUnmocked: true}).get(path).reply(404);
//     await expect(submitRequest(fakeVin, translate)).rejects.toThrowError();
//   });
// });

describe('vinParser - downloadRequest', () => {
  // let result;
  //
  // beforeAll(async () => {
  //   result = await downloadRequest(fakeVin);
  // });
  //
  // it('Should not return falsy values', () => {
  //   expect(result).toBeDefined();
  //   expect(!!result).toBe(true);
  // });
  //
  // it('Should return a "файл не найден" string', () => {
  //   expect(result).toBe('файл не найден');
  // });

  it('Should return a file', async () => {
    const file = await downloadRequest(existVin, false);
    console.log(typeof file);
    // expect(file).toBeInstanceOf(Buffer);
  });

  // it('Should reject if response status code is wrong', async () => {
  //   const path = config.parser.downloadPath
  //       .replace(/\${vin}/, fakeVin)
  //       .replace(/\${translate}/, +translate);
  //
  //   await nock(config.parser.baseUrl, {allowUnmocked: true}).get(path).reply(404);
  //   await expect(downloadRequest(fakeVin, translate)).rejects.toThrowError();
  // });
});

