import telegraf from 'telegraf';
import MainStage from './controllers/Main';
import config from './loaders/config';
import i18n from './loaders/i18n';
import logger from './loaders/logger';
import {productionMode, developmentMode} from './utils/appRunMode';

// import fs from 'fs';
// import events from './loaders/events';
//
// const file = fs.readFileSync('./report.txt');
//
// events.emit('order', {
//   phone: '+380501234567',
//   method: 'Telegram',
//   vin: 'I2JG35235235KJN',
// }, file);

const {Telegraf, session} = telegraf;
const bot = new Telegraf(config.botToken);

bot.use(session());
bot.use(i18n.middleware(null));
bot.use(MainStage.middleware(null));

bot.catch((err) => {
  logger.error('Telegraf Error:', err);
});

bot.on('text', async ({scene}) => {
  await scene.enter('text');
});

bot.launch().then(() => {
  logger.info('Bot is running ✌');
});

['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => bot.stop(sig));
});

process.env.NODE_ENV === 'production' ? productionMode() : developmentMode();
