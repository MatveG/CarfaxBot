import telegraf from 'telegraf';

const {Markup} = telegraf;

export default (i18n) => Markup.inlineKeyboard(
    [
      Markup.callbackButton(i18n.t('contacts.option_1'), 'contacts-1'),
      Markup.callbackButton(i18n.t('contacts.option_2'), 'contacts-2'),
      Markup.callbackButton(i18n.t('contacts.option_3'), 'contacts-3'),
      Markup.callbackButton(i18n.t('leave'), 'leave'),
    ],
    {columns: 2},
).extra();
