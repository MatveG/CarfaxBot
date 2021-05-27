import TelegrafI18n from 'telegraf-i18n';
import config from './config';

const i18n = new TelegrafI18n({
  useSession: true,
  directory: './app/locales',
  defaultLanguage: config.locale,
});

export default i18n;
