import i18n from "i18next";
import {initReactI18next} from 'react-i18next';
import common_en from './translations/en.json';
import common_fr from './translations/fr.json';
import common_ar from './translations/ar.json';
import common_es from './translations/es.json';

const resources = {
    en: {
        translation : common_en
    },
    fr: {
        translation : common_fr
    },
    ar: {
        translation : common_ar
    },
    es: {
        translation : common_es
    }
}

i18n.use(initReactI18next)
.init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    keySeparator: false,
    interpolation: {
        escapeValue : false
    }
});

export default i18n;