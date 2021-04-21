import express from 'express';
import nock from 'nock';
import config from '../loaders/config';
import logger from '../loaders/logger.js';

const {PORT} = process.env;

export function productionMode() {
  const server = express();

  server.get('/healthcare', (request, response) => response.send('ok'));
  server.listen(PORT || 3000);

  process.on('uncaughtException', (err) => {
    logger.error('App Exception:', err);
  });
}

export function developmentMode() {
  nock(config.parser.baseUrl)
      .persist(true)
      .post('/')
      .reply(302)
      .get((uri) => uri.includes('ajax?action=save_carfax_record'))
      .reply(200, '{"success":true}')
      .get((uri) => uri.includes('download-file'))
      .replyWithFile(200, './test.pdf');
}
