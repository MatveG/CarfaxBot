import cron from 'node-cron';
import bot from './loaders/bot';
import clearExpired from './utils/clearExpired';
import processOrders from './utils/processOrders';
import sendReports from './utils/sendReports';
import {prodMode, devMode} from './utils/appMode';

bot.launch().then(() => {
  // Every 30 second
  cron.schedule('*/30 * * * * *', sendReports, {});

  console.log('*-* Bot has been launched *-*');
});

// Every 1 minute
cron.schedule('*/60 * * * * *', processOrders, {});

// Every day
cron.schedule('0 0 0 * * *', clearExpired, {});

['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => bot.stop());
});

process.env.NODE_ENV === 'production' ? prodMode() : devMode();

