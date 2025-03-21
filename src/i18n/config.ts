import { InitOptions } from 'i18next';
import en from './en';
import ja from './ja';

export const i18nextInitOptions: InitOptions = {
  fallbackLng: 'ja',
  resources: {
    ja,
    en,
  },
};

export const languages = Object.keys(i18nextInitOptions.resources ?? {});