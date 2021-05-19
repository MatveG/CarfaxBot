import nock from 'nock';
import config from '../loaders/config';

// https://api.vin-check.com.ua/api.php?api_key=API_KEY&action=add_to_queue&vin=VIN&translate=0&callback_url=CALLBACK_URL
// https://api.vin-check.com.ua/api.php?api_key=API_KEY&action=check_report&vin=VIN&translate=0
// https://api.vin-check.com.ua/api.php?api_key=API_KEY&action=get_report&vin=VIN&translate=0

export function prodMode() {
  console.log('Production mode');
}

export function devMode() {
  nock(config.parser.baseUrl)
      .persist(true)
      .get((uri) => uri.includes('action=add_to_queue'))
      .reply(200, '{"success":true}')
      .get((uri) => uri.includes('action=check_report'))
      .reply(200, '{"success":true}')
      .get((uri) => uri.includes('action=get_report'))
      .replyWithFile(200, './test.pdf');

  console.log('Development mode');
}

