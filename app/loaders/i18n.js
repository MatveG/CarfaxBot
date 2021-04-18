import TelegrafI18n from 'telegraf-i18n';
import config from './config';

const i18n = new TelegrafI18n({
  defaultLanguage: config.locale,
  directory: './app/locales',
});

export default i18n;
