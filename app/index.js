import dotenv from 'dotenv';
import cron from 'node-cron';
import telegraf from 'telegraf';
import MainStage from './controllers/Main';
import i18n from './loaders/i18n';
import logger from './loaders/logger';
import clearExpired from './utils/clearExpired';
import processOrders from './utils/processOrders';
import sendReports from './utils/sendReports';
import {prodMode, devMode} from './utils/appMode';

dotenv.config();

const {TEST_TOKEN, BOT_TOKEN} = process.env;
const {Telegraf, session} = telegraf;
const bot = new Telegraf(TEST_TOKEN || BOT_TOKEN);

bot.use(session());
bot.use(i18n.middleware());
bot.use(MainStage.middleware());

bot.on('text', ({scene}) => scene.enter('text'));
bot.catch((error) => logger.error('Telegraf Error:', error));
bot.launch().then(() => console.log('*-* Bot has been launched *-*'));

// Every 15 second
cron.schedule('*/15 * * * * *', () => sendReports(bot.telegram), {});

// Every 1 minute
cron.schedule('*/60 * * * * *', processOrders, {});

// Every day
cron.schedule('0 0 0 * * *', clearExpired, {});

process.env.NODE_ENV === 'production' ? prodMode() : devMode();

['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => bot.stop());
});


