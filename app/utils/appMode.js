import nock from 'nock';
import express from 'express';
import config from '../loaders/config';

export function prodMode() {
  const server = express();

  server.get('/healthcare', (request, response) => response.send('ok'));
  server.listen(process.env.PORT || 3000);
}

export function devMode() {
  nock(config.parser.baseUrl)
      .persist(true)
      .post('/')
      .reply(200)
      .get((uri) => uri.includes('ajax?action=save_carfax_record'))
      .reply(200, '{"success":true}')
      .get((uri) => uri.includes('download-file'))
      .replyWithFile(200, './test.pdf');
}
