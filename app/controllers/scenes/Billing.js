import telegraf from 'telegraf';
import config from '../../loaders/config';
import payKeyboard from '../keyboards/billing/pay';
import {insertOrder} from '../../utils/ordersDb';
import {createInvoice} from '../../utils/createInvoice';

const {BaseScene} = telegraf;
const Billing = new BaseScene('billing');

Billing.enter(async ({i18n, update, scene, replyWithMarkdown, session}) => {
  const {vin} = session;
  const chatId = update.callback_query.from.id;
  const orderOption = scene.state.orderOption;
  const orderSum = config['price_' + scene.state.orderOption];

  const orderId = await insertOrder(chatId, orderSum, vin, orderOption === 2);
  const invoiceUrl = await createInvoice(i18n.languageCode, orderId, vin, orderSum);

  if (invoiceUrl) {
    await replyWithMarkdown(
        i18n.t(
            `billing.summary${orderOption === 3 ? '_callback' : ''}`,
            {vin: session.vin, orderSum},
        ),
        payKeyboard(i18n, invoiceUrl),
    );
  } else {
    await replyWithMarkdown(i18n.t('billing.error'));
  }

  await scene.leave();
});

export default Billing;
