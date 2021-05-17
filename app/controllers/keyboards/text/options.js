import telegraf from 'telegraf';
import config from '../../../loaders/config';

const {Markup} = telegraf;

export default (i18n) => Markup.inlineKeyboard(
    [
      Markup.callbackButton(i18n.t('text.option_1', {price: config.price_1}), 'text-1'),
      Markup.callbackButton(i18n.t('text.option_2', {price: config.price_2}), 'text-2'),
      Markup.callbackButton(i18n.t('text.option_3', {price: config.price_3}), 'text-3'),
      Markup.callbackButton(i18n.t('leave'), 'leave'),
    ],
    {columns: 1},
).extra();
