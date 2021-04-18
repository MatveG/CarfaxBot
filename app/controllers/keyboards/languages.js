import telegraf from 'telegraf';
import i18n from '../../loaders/i18n';

const {Markup} = telegraf;

export default () => Markup.keyboard([
  [i18n.t('ru', 'language'), i18n.t('ua', 'language')],
]).oneTime().resize().extra();
