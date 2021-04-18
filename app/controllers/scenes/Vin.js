import fs from 'fs';
import telegraf from 'telegraf';
import events from '../../loaders/events';

const {BaseScene} = telegraf;
const Vin = new BaseScene('vin');

Vin.enter(async ({i18n, scene, session, replyWithMarkdown, replyWithDocument}) => {
  const carfaxFile = fs.readFileSync('./report.txt');

  if (session.orderOption === 3) {
    events.emit('order', session.contacts, carfaxFile);
    await replyWithMarkdown(i18n.t('vin.order_complete'));
  } else {
    await replyWithMarkdown(i18n.t('vin.thanks'));
  }

  setTimeout(async () => {
    await replyWithDocument({source: carfaxFile, filename: `${session.vin}.txt`});
  }, 1500);

  await scene.leave();
});

export default Vin;
