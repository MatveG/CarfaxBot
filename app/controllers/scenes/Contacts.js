import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/contacts/options.js';

const {BaseScene} = telegraf;
const Contacts = new BaseScene('contacts');
const phoneRegex = /\+380[\d]{9}/g;
const optionState = {orderOption: 3};

Contacts.enter(async ({i18n, replyWithMarkdown, session}) => {
  await replyWithMarkdown(i18n.t('contacts.form.phone'));
});

Contacts.on('text', async ({i18n, update, session, replyWithMarkdown}) => {
  const msg = update.message.text.trim();

  if (!msg.match(phoneRegex)) {
    return await replyWithMarkdown(i18n.t('contacts.incorrect'));
  }

  session.contacts = {phone: msg};

  await replyWithMarkdown(i18n.t('contacts.form.method'), optionsKeyboard(i18n));
});

Contacts.action('contacts-1', async ({i18n, scene, session}) => {
  session.contacts.method = i18n.t('contacts.option_1');
  await scene.enter('billing', optionState);
});

Contacts.action('contacts-2', async ({i18n, scene, session}) => {
  session.contacts.method = i18n.t('contacts.option_2');
  await scene.enter('billing', optionState);
});

Contacts.action('contacts-3', async ({i18n, scene, session}) => {
  session.contacts.method = i18n.t('contacts.option_3');
  await scene.enter('billing', optionState);
});

export default Contacts;
