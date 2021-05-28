import cron from 'node-cron';
import express from 'express';
import bot from './loaders/bot';
import events from './loaders/events';
import carfax from './routes/carfax';
import merchant from './routes/merchant';
import {prodMode, devMode} from './utils/appMode';

const {PORT, NODE_ENV} = process.env;
const server = express();

server.use(carfax);
server.use(merchant);
server.listen(PORT || 3000);

bot.launch().then(() => {
  // Every 15 seconds
  cron.schedule('*/15 * * * * *', () => {
    events.emit('processOrders');
  }, {});

  // Every day
  cron.schedule('0 0 0 * * *', () => {
    events.emit('cleanExpiredOrders');
    events.emit('cleanExpiredArchive');
  }, {});

  console.log('[ Bot has been launched ]');
});

['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => bot.stop());
});

NODE_ENV === 'production' ? prodMode() : devMode();
