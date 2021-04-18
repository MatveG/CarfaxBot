import telegraf from 'telegraf';

const {Markup} = telegraf;

export default (i18n) => Markup.inlineKeyboard(
    [
      Markup.callbackButton(i18n.t('text.option_1'), 'text-1'),
      Markup.callbackButton(i18n.t('text.option_2'), 'text-2'),
      Markup.callbackButton(i18n.t('text.option_3'), 'text-3'),
      Markup.callbackButton(i18n.t('leave'), 'text-leave'),
    ],
    {columns: 1},
).extra();
