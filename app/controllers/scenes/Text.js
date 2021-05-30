import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/text/options.js';

const {BaseScene} = telegraf;
const Text = new BaseScene('text');
const vinRegex = /\b[(A-H|J-N|P|R-Z|0-9)]{17}\b/gm;

Text.enter(async (ctx) => {
  if (ctx.scene.state.text) {
    await onTextHandler(ctx.scene.state.text, ctx);
  }
});

Text.on('text', async (ctx) => {
  await onTextHandler(ctx.update.message.text, ctx);
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

async function onTextHandler(message, ctx) {
  const text = message.trim().toUpperCase();
  const {i18n, session, replyWithMarkdown} = ctx;

  if (text.match(vinRegex)) {
    session.vin = text;
    return await replyWithMarkdown(i18n.t('text.confirm', {vin: text}), optionsKeyboard(i18n));
  }
  await replyWithMarkdown(i18n.t('text.incorrect'));
}

export default Text;
