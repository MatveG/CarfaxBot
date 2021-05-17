import telegraf from 'telegraf';
import config from '../../loaders/config';
import {createInvoice} from '../../utils/wayForPay';
import payKeyboard from '../keyboards/billing/pay';
import {insertOrder} from '../../utils/orderActions';

const {BaseScene} = telegraf;
const Billing = new BaseScene('billing');

Billing.enter(async ({i18n, update, scene, replyWithMarkdown, session}) => {
  session.orderOption = scene.state.orderOption;
  session.orderSum = config['price_' + scene.state.orderOption];

  const chatId = update.callback_query.from.id;
  const orderId = insertOrder(chatId, session.orderSum, session.vin, session.orderOption === 2);
  const invoiceUrl = await createInvoice(i18n.languageCode, orderId, session.vin, session.orderSum);

  debugger;

  if (invoiceUrl) {
    return await replyWithMarkdown(
        i18n.t(`billing.${session.orderOption === 3 ? 'summary_callback' : 'summary'}`, session),
        payKeyboard(invoiceUrl),
    );
  }

  await replyWithMarkdown(i18n.t('billing.error'));
});

export default Billing;
