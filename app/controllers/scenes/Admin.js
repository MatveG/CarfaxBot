import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/admin/options.js';
import adminOnly from '../middleware/adminOnly';

const {ADMIN_KEY} = process.env;
const {BaseScene} = telegraf;
const Admin = new BaseScene('admin');

Admin.enter(async ({i18n, replyWithMarkdown}) => {
  await replyWithMarkdown(i18n.t('admin.enter'));
});

Admin.on('text', async ({i18n, update, session, replyWithMarkdown}) => {
  const msg = update.message.text.trim();

  if (msg === ADMIN_KEY) {
    session.adminKey = msg;
    return await replyWithMarkdown(i18n.t('admin.select'), optionsKeyboard(i18n));
  }

  await replyWithMarkdown(i18n.t('admin.wrong_key'));
});

Admin.action('admin-mailing', adminOnly, async ({scene}) => {
  await scene.enter('mailing');
});

export default Admin;
