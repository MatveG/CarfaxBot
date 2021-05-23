import nock from 'nock';
import config from '../loaders/config';

export function prodMode() {
  console.log('[ Production mode ]');
}

export function devMode() {
  nock(config.carfax.apiUrl)
      .persist(true)
      .get((uri) => uri.includes('action=add_to_queue'))
      .reply(200, '{"success":true}')
      .get((uri) => uri.includes('action=check_report'))
      .reply(200, '{"success":true}')
      .get((uri) => uri.includes('action=get_report'))
      .replyWithFile(200, './test.pdf');

  console.log('[ Development mode ]');
}

