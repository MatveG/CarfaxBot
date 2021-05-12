import telegraf from 'telegraf';
import languagesKeyboard from './keyboards/languages';
import BillingScene from './scenes/Billing';
import FeedbackScene from './scenes/Feedback';
import FinishScene from './scenes/Finish';
import TextScene from './scenes/Text';

const {Stage} = telegraf;

const Main = new Stage([
  BillingScene,
  FeedbackScene,
  FinishScene,
  TextScene,
]);

Main.command('start', async ({i18n, scene, replyWithMarkdown}) => {
  await scene.leave();
  await replyWithMarkdown(i18n.t('welcome'), languagesKeyboard(i18n));
});

Main.command('cancel', async ({i18n, scene, replyWithMarkdown}) => {
  await scene.leave();
  await replyWithMarkdown(i18n.t('canceled'));
});

Main.action('leave', async ({i18n, scene, replyWithMarkdown}) => {
  await scene.leave();
  await replyWithMarkdown(i18n.t('canceled'));
});

Main.command('help', async ({i18n, replyWithMarkdown}) => {
  await replyWithMarkdown(i18n.t('help'));
});

Main.action('ru', async ({i18n, replyWithMarkdown}) => {
  i18n.locale('ru');
  await replyWithMarkdown(i18n.t('help'));
});

Main.action('ua', async ({i18n, replyWithMarkdown}) => {
  i18n.locale('ua');
  await replyWithMarkdown(i18n.t('help'));
});

export default Main;
