import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ptBRCommon from './pt-BR/common.json';
import ptBRDailyLog from './pt-BR/dailyLog.json';
import ptBRCrisisFeedback from './pt-BR/crisisFeedback.json';

import enUSCommon from './en-US/common.json';
import enUSDailyLog from './en-US/dailyLog.json';
import enUSCrisisFeedback from './en-US/crisisFeedback.json';

const resources = {
  'pt-BR': {
    common: ptBRCommon,
    dailyLog: ptBRDailyLog,
    crisisFeedback: ptBRCrisisFeedback,
  },
  'en-US': {
    common: enUSCommon,
    dailyLog: enUSDailyLog,
    crisisFeedback: enUSCrisisFeedback,
  },
};

const systemLocales = Localization.getLocales();
const deviceLanguage = systemLocales && systemLocales.length > 0 ? systemLocales[0].languageTag : 'pt-BR';
const initialLanguage = deviceLanguage.startsWith('en') ? 'en-US' : 'pt-BR';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'pt-BR',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
