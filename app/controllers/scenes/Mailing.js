import telegraf from 'telegraf';
import confirmationKeyboard from '../keyboards/mailing/confirmation';
import leaveKeyboard from '../keyboards/mailing/leave';
import adminOnly from '../middleware/adminOnly';
import {sendToAllUsers} from '../../utils/sendTelegram';

const {BaseScene} = telegraf;
const Mailing = new BaseScene('mailing');

Mailing.enter(adminOnly, async ({i18n, replyWithMarkdown}) => {
  await replyWithMarkdown(i18n.t('mailing.enter'));
});

Mailing.on('text', adminOnly, async (ctx) => {
  const {i18n, update, session, replyWithMarkdown, replyWithPhoto} = ctx;
  session.mailingText = update.message.text.trim();

  if (session.mailingPhoto) {
    await replyWithPhoto(
        session.mailingPhoto,
        {caption: session.mailingText, parse_mode: 'Markdown'},
    );
  } else {
    await replyWithMarkdown(session.mailingText);
  }
  await replyWithMarkdown(i18n.t('mailing.confirmation'), confirmationKeyboard(i18n));
});

Mailing.on('photo', adminOnly, async (ctx) => {
  const {i18n, message, session, replyWithPhoto, replyWithMarkdown} = ctx;
  session.mailingPhoto = message.photo[message.photo.length-1].file_id;

  await replyWithPhoto(
      session.mailingPhoto,
      {caption: session.mailingText || '', parse_mode: 'Markdown'},
  );
  await replyWithMarkdown(i18n.t('mailing.confirmation'), confirmationKeyboard(i18n));
});

Mailing.action('mailing-confirm', adminOnly, async ({i18n, session, replyWithMarkdown}) => {
  const count = await sendToAllUsers(session.mailingText, session.mailingPhoto);

  await replyWithMarkdown(i18n.t('mailing.complete', {count}), leaveKeyboard(i18n));
});

export default Mailing;
