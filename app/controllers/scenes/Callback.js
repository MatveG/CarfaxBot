import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/callback/options.js';

const {BaseScene} = telegraf;
const Callback = new BaseScene('callback');
const phoneRegex = /\+380[\d]{9}/g;
const orderOptionObj = {orderOption: 3};

Callback.enter(async ({i18n, replyWithMarkdown}) => {
  await replyWithMarkdown(i18n.t('callback.form.phone'));
});

Callback.on('text', async ({i18n, update, session, replyWithMarkdown}) => {
  const msg = update.message.text.trim();

  if (!msg.match(phoneRegex)) {
    return await replyWithMarkdown(i18n.t('callback.incorrect'));
  }

  session.contacts = {phone: msg};

  await replyWithMarkdown(i18n.t('callback.form.method'), optionsKeyboard(i18n));
});

Callback.action('callback-1', async ({i18n, scene, session}) => {
  session.contacts.method = i18n.t('callback.option_1');
  await scene.enter('billing', orderOptionObj);
});

Callback.action('callback-2', async ({i18n, scene, session}) => {
  session.contacts.method = i18n.t('callback.option_2');
  await scene.enter('billing', orderOptionObj);
});

Callback.action('callback-3', async ({i18n, scene, session}) => {
  session.contacts.method = i18n.t('callback.option_3');
  await scene.enter('billing', orderOptionObj);
});

export default Callback;
