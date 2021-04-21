import telegraf from 'telegraf';
import optionsKeyboard from '../keyboards/billing/options.js';
import config from '../../loaders/config';

const {BaseScene} = telegraf;
const Billing = new BaseScene('billing');

Billing.enter(async ({i18n, scene, replyWithMarkdown, session}) => {
  session.orderOption = scene.state.orderOption;
  session.orderSum = config[`price_${scene.state.orderOption}`];

  return await replyWithMarkdown(
      i18n.t('billing.info', {sum: session.orderSum}),
      optionsKeyboard(i18n),
  );
});

Billing.action('billing-1', async ({scene}) => {
  await scene.enter('finish');
});

Billing.action('billing-2', async ({scene}) => {
  await scene.enter('finish');
});

Billing.action('billing-3', async ({scene}) => {
  await scene.enter('finish');
});

export default Billing;
