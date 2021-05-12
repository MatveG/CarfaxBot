import telegraf from 'telegraf';
import events from '../../loaders/events';

const {BaseScene} = telegraf;
const Finish = new BaseScene('finish');

Finish.enter(async ({i18n, update, scene, session, replyWithMarkdown}) => {
  events.emit('submitOrder',
      session.vin,
      session.orderOption === 2,
      update.callback_query.from.id,
  );

  if (session.orderOption === 3) {
    events.emit('submitFeedback',
        session.vin,
        session.feedback.phone,
        session.feedback.method,
    );
    await replyWithMarkdown(i18n.t('finish.thanks_premium'));
  } else {
    await replyWithMarkdown(i18n.t('finish.thanks_regular'));
  }

  await scene.leave();
});

export default Finish;

