import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { Filter } from 'react-native-svg';
//import ChainedBackend from 'i18next-chained-backend';
//import HttpBackend from 'i18next-http-backend'; // Para cargar archivos

// --- Definimos nuestros namespaces (los nombres de nuestros archivos JSON) ---
const namespaces = [
  'common',
  'auth',
  'profile',
  'errors',
  'checkout',
  'product',
  'home',
  'cart',
  'address',
  'favorites',
  'orders',
  'shop',
  'quickadd',
  'passwordStrength',
  'header',
  'orderSummary',
  'search',
  'payments',
  'faq',
];

// --- Definimos los idiomas soportados ---
const supportedLngs = ['en', 'es'];

// --- Detectamos el idioma del dispositivo ---
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
const languageToUse = supportedLngs.includes(deviceLanguage)
  ? deviceLanguage
  : 'en';

i18n.use(initReactI18next).init({
  // --- Configuración para cargar los archivos ---
  // Ya no usamos 'resources'. El backend se encargará de cargar los archivos.

  // --- Idioma ---
  lng: languageToUse,
  fallbackLng: 'en',
  supportedLngs: supportedLngs,

  // --- Namespaces ---
  ns: namespaces,
  defaultNS: 'common', // Namespace por defecto, muy útil.

  // --- Configuración de compatibilidad y otras opciones ---
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false, // React ya se encarga de esto
  },
  react: {
    useSuspense: false, // Mantenemos tu configuración original
  },

  // --- Backend (la magia está aquí) ---
  // i18next-http-backend puede cargar los archivos JSON bajo demanda.
  // En el contexto de Expo/React Native, estos archivos se "empaquetan" con la app,
  // por lo que no es una llamada de red real, sino una carga desde el bundle.
  // Esta configuración es para un futuro donde podríamos cargar desde un servidor.
  // Por ahora, i18next los manejará internamente.
  // La configuración para que funcione sin un backend real es más compleja,
  // así que por ahora, vamos a importarlos dinámicamente.

  // --- CORRECCIÓN PARA EXPO/RN: Importación dinámica ---
  // En lugar de usar un backend complejo, usaremos importaciones dinámicas que
  // el empaquetador de Metro (de React Native) entiende.
  resources: {
    en: {
      common: require('../locales/en/common.json'),
      auth: require('../locales/en/auth.json'),
      profile: require('../locales/en/profile.json'),
      errors: require('../locales/en/errors.json'),
      checkout: require('../locales/en/checkout.json'),
      product: require('../locales/en/product.json'),
      home: require('../locales/en/home.json'),
      cart: require('../locales/en/cart.json'),
      address: require('../locales/en/address.json'),
      favorites: require('../locales/en/favorites.json'),
      orders: require('../locales/en/orders.json'),
      shop: require('../locales/en/shop.json'),
      quickadd: require('../locales/en/quickadd.json'),
      passwordStrength: require('../locales/en/passwordStrength.json'),
      orderSummary: require('../locales/en/orderSummary.json'),
      header: require('../locales/en/header.json'),
      search: require('../locales/en/search.json'),
      payments: require('../locales/en/payments.json'),
      faq: require('../locales/en/faq.json'),

      //misc: require('../locales/en/misc.json')
    },
    es: {
      common: require('../locales/es/common.json'),
      auth: require('../locales/es/auth.json'),
      profile: require('../locales/es/profile.json'),
      errors: require('../locales/es/errors.json'),
      checkout: require('../locales/es/checkout.json'),
      product: require('../locales/es/product.json'),
      home: require('../locales/es/home.json'),
      cart: require('../locales/es/cart.json'),
      address: require('../locales/es/address.json'),
      favorites: require('../locales/es/favorites.json'),
      orders: require('../locales/es/orders.json'),
      shop: require('../locales/es/shop.json'),
      quickadd: require('../locales/es/quickadd.json'),
      passwordStrength: require('../locales/es/passwordStrength.json'),
      orderSummary: require('../locales/es/orderSummary.json'),
      header: require('../locales/es/header.json'),
      search: require('../locales/es/search.json'),
      payments: require('../locales/es/payments.json'),
      faq: require('../locales/es/faq.json'),
    },
  },
});

export default i18n;
