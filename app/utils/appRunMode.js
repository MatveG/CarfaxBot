import express from 'express';
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
  // const apiUrl = new URL(SPELLER_API);
  //
  // loadJsonFile('./fakeApi.json')
  //     .then((data) => {
  //       nock(apiUrl.origin)
  //           .persist()
  //           .post(apiUrl.pathname)
  //           .reply(200, data[0].response, {
  //             'Content-Type': 'application/json',
  //           });
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
}
