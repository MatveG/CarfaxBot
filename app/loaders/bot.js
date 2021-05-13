import telegraf from 'telegraf';
import MainStage from '../controllers/Main';
import i18n from './i18n';
import logger from './logger';

const {Telegraf, session} = telegraf;
const {TEST_TOKEN, BOT_TOKEN} = process.env;
const bot = new Telegraf(TEST_TOKEN || BOT_TOKEN);

bot.use(session());
bot.use(i18n.middleware());
bot.use(MainStage.middleware());

bot.catch((error) => logger.error('Telegraf Error:', error));

export default bot;
