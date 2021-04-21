import telegraf from 'telegraf';
import cron from 'node-cron';
import MainStage from './controllers/Main';
import config from './loaders/config';
import nedb from './loaders/nedb';
import i18n from './loaders/i18n';
import logger from './loaders/logger';
import {productionMode, developmentMode} from './utils/appRunMode';
import deleteExpired from './utils/deleteExpired';
import handleOrder from './utils/handleOrder';

const {Telegraf, session} = telegraf;
const bot = new Telegraf(config.botToken);

bot.use(session());
bot.use(i18n.middleware());
bot.use(MainStage.middleware());

bot.catch((err) => {
  logger.error('Telegraf Error:', err);
});

bot.on('text', ({scene}) => {
  scene.enter('text');
});

// bot.launch().then(() => {
//   console.log('Bot is running ✌');
// });

// Every 30 seconds
cron.schedule('*/15 * * * * *', () => {
  nedb.find({}, (err, rows) => {
    if (err) {
      return logger.error('DB error', err);
    }
    rows.forEach(async (el) => {
      await handleOrder(el, bot.telegram);
    });
  });
}, {});

// Every day
cron.schedule('* * * */1 * *', () => {
  deleteExpired(config.downloadDir, config.expirationDays);
}, {});

process.env.NODE_ENV === 'production' ?
  productionMode() : developmentMode();

['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => bot.stop());
});


