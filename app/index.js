import cron from 'node-cron';
import express from 'express';
import bot from './loaders/bot';
import events from './loaders/events';
import merchant from './routes/merchant';
import {prodMode, devMode} from './utils/appMode';
import {insertOrder} from './utils/orderActions';
import {createInvoice} from './utils/wayForPay';

const {PORT, NODE_ENV} = process.env;
const server = express();

// insertOrder(12345, 30, '0987654321', false).then((id) => {
//   createInvoice('ru', id, '0987654321', 30).then((res) => console.log('createInvoice', res));
// });

server.use(express.json());
server.use(merchant);
server.listen(PORT || 3000);

bot.launch().then(() => {
  // Every 15 second
  cron.schedule('*/15 * * * * *', () => {
    events.emit('clearOrders');
    events.emit('sendReports');
  }, {});

  // Every 1 minute
  cron.schedule('*/60 * * * * *', () => {
    events.emit('processOrders');
  }, {});

  // Every day
  cron.schedule('0 0 0 * * *', () => {
    events.emit('cleanDownloads');
  }, {});

  console.log('*** Bot has been launched ***');
});

['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => bot.stop());
});

NODE_ENV === 'production' ? prodMode() : devMode();
