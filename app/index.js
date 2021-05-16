import cron from 'node-cron';
import express from 'express';
import bot from './loaders/bot';
import merchant from './routes/merchant';
import clearExpired from './utils/clearExpired';
import processOrders from './utils/processOrders';
import sendReports from './utils/sendReports';
import {prodMode, devMode} from './utils/appMode';

const {PORT, NODE_ENV} = process.env;
const server = express();

server.use(express.json());
server.use(merchant);
server.listen(PORT || 3000);

bot.launch().then(() => {
  console.log('*-* Bot has been launched *-*');

  // Every 30 second
  cron.schedule('*/30 * * * * *', sendReports, {});

  // Every 1 minute
  cron.schedule('*/60 * * * * *', processOrders, {});

  // Every day
  cron.schedule('0 0 0 * * *', clearExpired, {});
});

['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => bot.stop());
});

NODE_ENV === 'production' ? prodMode() : devMode();

