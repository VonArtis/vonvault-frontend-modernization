import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';
import enProfile from '../locales/en/profile.json';
import enAuth from '../locales/en/auth.json';
import enStaking from '../locales/en/staking.json';

import esCommon from '../locales/es/common.json';
import esDashboard from '../locales/es/dashboard.json';
import esProfile from '../locales/es/profile.json';
import esAuth from '../locales/es/auth.json';
import esStaking from '../locales/es/staking.json';

import frCommon from '../locales/fr/common.json';
import frProfile from '../locales/fr/profile.json';
import frAuth from '../locales/fr/auth.json';
import frStaking from '../locales/fr/staking.json';

import deCommon from '../locales/de/common.json';
import deProfile from '../locales/de/profile.json';
import deAuth from '../locales/de/auth.json';
import deStaking from '../locales/de/staking.json';

import itCommon from '../locales/it/common.json';
import itProfile from '../locales/it/profile.json';
import itAuth from '../locales/it/auth.json';
import itStaking from '../locales/it/staking.json';

import ptCommon from '../locales/pt/common.json';
import ptProfile from '../locales/pt/profile.json';
import ptAuth from '../locales/pt/auth.json';
import ptStaking from '../locales/pt/staking.json';

import zhCommon from '../locales/zh/common.json';
import zhProfile from '../locales/zh/profile.json';
import zhStaking from '../locales/zh/staking.json';

import ruCommon from '../locales/ru/common.json';
import ruProfile from '../locales/ru/profile.json';
import ruAuth from '../locales/ru/auth.json';
import ruStaking from '../locales/ru/staking.json';

import jaCommon from '../locales/ja/common.json';
import jaProfile from '../locales/ja/profile.json';
import jaAuth from '../locales/ja/auth.json';
import jaStaking from '../locales/ja/staking.json';

import koCommon from '../locales/ko/common.json';
import koProfile from '../locales/ko/profile.json';
import koAuth from '../locales/ko/auth.json';
import koStaking from '../locales/ko/staking.json';

import arCommon from '../locales/ar/common.json';
import arProfile from '../locales/ar/profile.json';
import arAuth from '../locales/ar/auth.json';
import arStaking from '../locales/ar/staking.json';

import hiCommon from '../locales/hi/common.json';
import hiProfile from '../locales/hi/profile.json';
import hiAuth from '../locales/hi/auth.json';
import hiStaking from '../locales/hi/staking.json';

import trCommon from '../locales/tr/common.json';
import trProfile from '../locales/tr/profile.json';
import trAuth from '../locales/tr/auth.json';
import trStaking from '../locales/tr/staking.json';

import plCommon from '../locales/pl/common.json';
import plProfile from '../locales/pl/profile.json';
import plAuth from '../locales/pl/auth.json';
import plStaking from '../locales/pl/staking.json';

import nlCommon from '../locales/nl/common.json';
import nlProfile from '../locales/nl/profile.json';
import nlAuth from '../locales/nl/auth.json';
import nlStaking from '../locales/nl/staking.json';

// Define supported languages - Updated to use UK flag for English
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' }
];

// Define translation resources
const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    profile: enProfile,
    auth: enAuth,
    staking: enStaking
  },
  es: {
    common: esCommon,
    dashboard: esDashboard,
    profile: esProfile,
    auth: esAuth,
    staking: esStaking
  },
  fr: {
    common: frCommon,
    dashboard: enDashboard, // Fallback to English
    profile: frProfile,
    auth: frAuth,
    staking: frStaking
  },
  de: {
    common: deCommon,
    dashboard: enDashboard, // Fallback to English
    profile: deProfile,
    auth: deAuth,
    staking: deStaking
  },
  it: {
    common: itCommon,
    dashboard: enDashboard, // Fallback to English
    profile: itProfile,
    auth: itAuth,
    staking: itStaking
  },
  pt: {
    common: ptCommon,
    dashboard: enDashboard, // Fallback to English
    profile: ptProfile,
    auth: ptAuth,
    staking: ptStaking
  },
  zh: {
    common: zhCommon,
    dashboard: enDashboard, // Fallback to English
    profile: zhProfile,
    auth: enAuth, // Fallback to English
    staking: zhStaking
  },
  ru: {
    common: ruCommon,
    dashboard: enDashboard, // Fallback to English
    profile: ruProfile,
    auth: ruAuth,
    staking: ruStaking
  },
  ja: {
    common: jaCommon,
    dashboard: enDashboard, // Fallback to English
    profile: jaProfile,
    auth: jaAuth,
    staking: jaStaking
  },
  ko: {
    common: koCommon,
    dashboard: enDashboard, // Fallback to English
    profile: koProfile,
    auth: koAuth,
    staking: koStaking
  },
  ar: {
    common: arCommon,
    dashboard: enDashboard, // Fallback to English
    profile: arProfile,
    auth: arAuth,
    staking: arStaking
  },
  hi: {
    common: hiCommon,
    dashboard: enDashboard, // Fallback to English
    profile: hiProfile,
    auth: hiAuth,
    staking: hiStaking
  },
  tr: {
    common: trCommon,
    dashboard: enDashboard, // Fallback to English
    profile: trProfile,
    auth: trAuth,
    staking: trStaking
  },
  pl: {
    common: plCommon,
    dashboard: enDashboard, // Fallback to English
    profile: plProfile,
    auth: plAuth,
    staking: plStaking
  },
  nl: {
    common: nlCommon,
    dashboard: enDashboard, // Fallback to English
    profile: nlProfile,
    auth: nlAuth,
    staking: nlStaking
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'profile', 'auth', 'staking'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;