import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import ptBRCommon from './pt-BR/common.json';
import ptBRDailyLog from './pt-BR/dailyLog.json';
import ptBRCrisisFeedback from './pt-BR/crisisFeedback.json';
import ptBRHistory from './pt-BR/history.json';
import ptBRSettings from './pt-BR/settings.json';
import ptBRClinicalExtras from './pt-BR/clinicalExtras.json';

import enUSCommon from './en-US/common.json';
import enUSDailyLog from './en-US/dailyLog.json';
import enUSCrisisFeedback from './en-US/crisisFeedback.json';
import enUSHistory from './en-US/history.json';
import enUSSettings from './en-US/settings.json';
import enUSClinicalExtras from './en-US/clinicalExtras.json';

const resources = {
  'pt-BR': {
    common: ptBRCommon,
    dailyLog: ptBRDailyLog,
    crisisFeedback: ptBRCrisisFeedback,
    history: ptBRHistory,
    settings: ptBRSettings,
    clinicalExtras: ptBRClinicalExtras,
  },
  'en-US': {
    common: enUSCommon,
    dailyLog: enUSDailyLog,
    crisisFeedback: enUSCrisisFeedback,
    history: enUSHistory,
    settings: enUSSettings,
    clinicalExtras: enUSClinicalExtras,
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
  ns: ['common', 'dailyLog', 'crisisFeedback', 'history', 'settings', 'clinicalExtras'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
