import telegraf from 'telegraf';

const {Markup} = telegraf;

export default (i18n) => Markup.inlineKeyboard(
    [
      Markup.callbackButton(i18n.t('billing.option_1'), 'billing-1'),
      Markup.callbackButton(i18n.t('billing.option_2'), 'billing-2'),
      Markup.callbackButton(i18n.t('billing.option_3'), 'billing-3'),
      Markup.callbackButton(i18n.t('leave'), 'leave'),
    ],
    {columns: 2},
).extra();
