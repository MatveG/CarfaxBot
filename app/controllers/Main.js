import telegraf from 'telegraf';
import languagesKeyboard from './keyboards/languages';
import BillingScene from './scenes/Billing';
import FeedbackScene from './scenes/Feedback';
import FinishScene from './scenes/Finish';
import TextScene from './scenes/Text';
import i18n from '../loaders/i18n';

const {Stage, Markup} = telegraf;

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

Main.command('help', async ({i18n, scene, replyWithMarkdown}) => {
  await replyWithMarkdown(i18n.t('help'), Markup.removeKeyboard().extra());
});

Main.command('cancel', async ({i18n, scene, replyWithMarkdown}) => {
  await scene.leave();
  await replyWithMarkdown(i18n.t('help'), Markup.removeKeyboard().extra());
});

Main.action('leave', async ({i18n, scene, replyWithMarkdown}) => {
  await scene.leave();
  await replyWithMarkdown(i18n.t('canceled'));
});

Main.hears(i18n.t('ru', 'language'), async ({i18n, replyWithMarkdown}) => {
  i18n.locale('ru');
  await replyWithMarkdown(i18n.t('help'));
});

Main.hears(i18n.t('ua', 'language'), async ({i18n, replyWithMarkdown}) => {
  i18n.locale('ua');
  await replyWithMarkdown(i18n.t('help'));
});

export default Main;
