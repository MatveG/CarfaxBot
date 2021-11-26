import telegraf from 'telegraf';
import languagesKeyboard from './keyboards/languages';
import AdminScene from './scenes/Admin';
import BillingScene from './scenes/Billing';
import CallbackScene from './scenes/Callback';
import MailingScene from './scenes/Mailing';
import TextScene from './scenes/Text';
import {insert, select, User} from '../utils/nedbOrm';

const {Stage} = telegraf;

const Main = new Stage([
  AdminScene,
  BillingScene,
  CallbackScene,
  MailingScene,
  TextScene,
]);

Main.action(/ru|ua/g, async ({match, i18n, scene, replyWithHTML}) => {
  i18n.locale(match[0]);
  await replyWithHTML(i18n.t('help'), { disable_web_page_preview: true });
  await scene.enter('text');
});

Main.action('leave', cancel);

Main.command('start', async ({i18n, update, replyWithMarkdown}) => {
  const {id: chatId, username} = update.message.from;

  if (!(await select('users', {chatId})).length) {
    await insert('users', new User(chatId, username));
  }

  await replyWithMarkdown(i18n.t('welcome'), languagesKeyboard(i18n));
});

Main.command('admin', async ({scene}) => {
  await scene.enter('admin');
});

Main.command('cancel', cancel);

async function cancel({i18n, scene, replyWithHTML}) {
  await scene.leave();
  await replyWithHTML(i18n.t('help'), { disable_web_page_preview: true });
}

export default Main;
