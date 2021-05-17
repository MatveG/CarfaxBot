import telegraf from 'telegraf';

const {Markup} = telegraf;

export default (i18n, invoiceUrl) => Markup.inlineKeyboard([
  Markup.urlButton(i18n.t('billing.pay'), invoiceUrl),
]).extra();
