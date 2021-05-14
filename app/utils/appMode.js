import nock from 'nock';
import express from 'express';
import config from '../loaders/config';

export function prodMode() {
  const server = express();

  console.log('prodMode');

  server.post(config.merchant.create.serviceUrl, (request, response) => {
    // console.log('request', request);

    response.send({
      orderReference: 'myOrder1',
      status: 'accept',
      time: Date.now(),
      signature: '',
    });
  });

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
