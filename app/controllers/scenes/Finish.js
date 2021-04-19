import telegraf from 'telegraf';
import events from '../../loaders/events';

const {BaseScene} = telegraf;
const Finish = new BaseScene('finish');

Finish.enter(async ({i18n, update, scene, session, replyWithMarkdown}) => {
  events.emit('orderEvent',
      session.vin,
      session.orderOption,
      session.contacts,
      update.callback_query.from.id,
  );

  await replyWithMarkdown(session.orderOption === 3 ?
    i18n.t('finish.thanks_premium') : i18n.t('finish.thanks_regular'));

  await scene.leave();
});

export default Finish;

