// src/common/constants.ts
export const SUPPORTED_LANGUAGES = [
  'fa',
  'en',
  'fr',
  'de',
  'es',
  'ar',
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
