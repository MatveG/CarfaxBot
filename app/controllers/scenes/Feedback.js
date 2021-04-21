import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/feedback/options.js';

const {BaseScene} = telegraf;
const Feedback = new BaseScene('feedback');
const phoneRegex = /\+380[\d]{9}/g;
const orderOptionObj = {orderOption: 3};

Feedback.enter(async ({i18n, replyWithMarkdown}) => {
  await replyWithMarkdown(i18n.t('feedback.form.phone'));
});

Feedback.on('text', async ({i18n, update, session, replyWithMarkdown}) => {
  const msg = update.message.text.trim();

  if (!msg.match(phoneRegex)) {
    return await replyWithMarkdown(i18n.t('feedback.incorrect'));
  }

  session.feedback = {phone: msg};

  await replyWithMarkdown(i18n.t('feedback.form.method'), optionsKeyboard(i18n));
});

Feedback.action('feedback-1', async ({i18n, scene, session}) => {
  session.feedback.method = i18n.t('feedback.option_1');
  await scene.enter('billing', orderOptionObj);
});

Feedback.action('feedback-2', async ({i18n, scene, session}) => {
  session.feedback.method = i18n.t('feedback.option_2');
  await scene.enter('billing', orderOptionObj);
});

Feedback.action('feedback-3', async ({i18n, scene, session}) => {
  session.feedback.method = i18n.t('feedback.option_3');
  await scene.enter('billing', orderOptionObj);
});

export default Feedback;
