import nock from 'nock';
import config from '../loaders/config';
import {getSubmitUrl, getCheckUrl, getDownloadUrl} from './carfaxApi';
import {submitCarfax, checkCarfax, downloadCarfax} from './carfaxApi';

const vinCode = 'JM1GJ1W11G1234567';
const translate = false;

describe('carfaxApi - helpers', () => {
  it('getSubmitUrl should always return the same string', () => {
    expect(getSubmitUrl(vinCode, translate)).toMatchSnapshot();
  });

  it('getCheckUrl should always return the same string', () => {
    expect(getCheckUrl(vinCode, translate)).toMatchSnapshot();
  });

  it('getDownloadUrl should always return the same string', () => {
    expect(getDownloadUrl(vinCode, translate)).toMatchSnapshot();
  });
});

describe('carfaxApi - api requests', () => {
  it('submitCarfax should submit correct get request', async () => {
    const scope = nock(config.carfax.apiUrl)
        .get(() => true)
        .reply((uri, body) => {
          expect(uri).toBe(getSubmitUrl(vinCode, translate));
          return [200, {success: true}];
        });

    await submitCarfax(vinCode);
    scope.done();
  });

  it('checkCarfax should submit correct get request', async () => {
    const scope = nock(config.carfax.apiUrl)
        .get(() => true)
        .reply((uri, body) => {
          expect(uri).toBe(getCheckUrl(vinCode, translate));
          return [200, {success: true}];
        });

    await checkCarfax(vinCode);
    scope.done();
  });

  it('downloadCarfax should submit correct get request', async () => {
    const scope = nock(config.carfax.apiUrl)
        .get(() => true)
        .reply((uri, body) => {
          expect(uri).toBe(getDownloadUrl(vinCode, translate));
          return [200, {success: true}];
        });

    await downloadCarfax(vinCode);
    scope.done();
  });
});
