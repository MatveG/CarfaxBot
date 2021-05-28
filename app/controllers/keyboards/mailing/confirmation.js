import telegraf from 'telegraf';

const {Markup} = telegraf;

export default (i18n) => Markup.inlineKeyboard(
    [
      Markup.callbackButton(i18n.t('mailing.confirm'), 'mailing-confirm'),
      Markup.callbackButton(i18n.t('leave'), 'leave'),
    ],
    {columns: 1},
).extra();