import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/text/options.js';

const {BaseScene} = telegraf;
const Text = new BaseScene('text');
const vinRegex = /\b[(A-H|J-N|P|R-Z|0-9)]{17}\b/gm;

Text.enter(async ({i18n, session, scene, replyWithMarkdown}) => {
  if (scene.state.text) {
    const msg = scene.state.text.trim().toUpperCase();

    if (msg.match(vinRegex)) {
      session.vin = msg;
      return await replyWithMarkdown(i18n.t('text.confirm', {vin: msg}), optionsKeyboard(i18n));
    }
    await replyWithMarkdown(i18n.t('text.incorrect'));
  }
});

Text.on('text', async ({i18n, update, session, replyWithMarkdown}) => {
  const msg = update.message.text.trim().toUpperCase();

  if (msg.match(vinRegex)) {
    session.vin = msg;
    return await replyWithMarkdown(i18n.t('text.confirm', {vin: msg}), optionsKeyboard(i18n));
  }
  await replyWithMarkdown(i18n.t('text.incorrect'));
});

Text.action('text-1', async ({scene}) => {
  await scene.enter('billing', {orderOption: 1});
});

Text.action('text-2', async ({scene}) => {
  await scene.enter('billing', {orderOption: 2});
});

Text.action('text-3', async ({scene}) => {
  await scene.enter('callback');
});

export default Text;
