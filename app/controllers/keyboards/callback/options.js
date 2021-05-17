import telegraf from 'telegraf';

const {Markup} = telegraf;

export default (i18n) => Markup.inlineKeyboard(
    [
      Markup.callbackButton(i18n.t('callback.option_1'), 'callback-1'),
      Markup.callbackButton(i18n.t('callback.option_2'), 'callback-2'),
      Markup.callbackButton(i18n.t('callback.option_3'), 'callback-3'),
      Markup.callbackButton(i18n.t('leave'), 'leave'),
    ],
    {columns: 2},
).extra();
