import telegraf from 'telegraf';

const {Markup} = telegraf;

export default (i18n) => Markup.inlineKeyboard(
    [
      Markup.callbackButton(i18n.t('feedback.option_1'), 'feedback-1'),
      Markup.callbackButton(i18n.t('feedback.option_2'), 'feedback-2'),
      Markup.callbackButton(i18n.t('feedback.option_3'), 'feedback-3'),
      Markup.callbackButton(i18n.t('leave'), 'leave'),
    ],
    {columns: 2},
).extra();
