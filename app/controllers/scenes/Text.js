import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/text/options.js';

const {BaseScene} = telegraf;
const Text = new BaseScene('text');
const vinRegex = /\b[(A-H|J-N|P|R-Z|0-9)]{17}\b/gm;

Text.enter(async ({i18n, update, session, replyWithMarkdown, scene}) => {
  const msg = update.message.text.trim().toUpperCase();

  if (!msg.match(vinRegex)) {
    return await replyWithMarkdown(i18n.t('text.incorrect'));
  }

  session.vin = msg;

  await replyWithMarkdown(
      i18n.t('text.confirm', {vin: msg}),
      optionsKeyboard(i18n),
  );
});

Text.action('text-1', async ({scene}) => {
  await scene.enter('billing', {orderOption: 1});
});

Text.action('text-2', async ({scene}) => {
  await scene.enter('billing', {orderOption: 2});
});

Text.action('text-3', async ({scene}) => {
  await scene.enter('feedback');
});

export default Text;
