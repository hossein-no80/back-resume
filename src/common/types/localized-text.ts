/**
 * زبان‌های پشتیبانی‌شده در سیستم.
 * اگه زبانی اضافه/حذف شد، فقط این آرایه رو تغییر بده.
 */
export const SUPPORTED_LANGUAGES = [
  'fa',
  'en',
  'fr',
  'de',
  'es',
  'ar',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * زبان پیش‌فرض برای fallback.
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * زبان‌هایی که داشتن ترجمه‌شون اجباریه.
 */
export const REQUIRED_LANGUAGES: SupportedLanguage[] = ['en', 'fa'];

/**
 * متن چندزبانه.
 * en و fa اجباری، بقیه اختیاری.
 */
export interface LocalizedText {
  en: string;
  fa: string;
  fr?: string;
  de?: string;
  es?: string;
  ar?: string;
}

/**
 * متن چندزبانه که فقط بعضی زبان‌ها رو داره.
 * برای فیلدهای اختیاری (مثل location).
 */
export type PartialLocalizedText = Partial<LocalizedText> & {
  en?: string;
  fa?: string;
};

/**
 * تابع کمکی برای گرفتن متن در زبان مشخص با fallback.
 * اولویت: زبان درخواستی → en → fa → اولین زبان موجود
 */
export function getLocalizedText(
  text: PartialLocalizedText | null | undefined,
  lang: SupportedLanguage,
): string {
  if (!text) return '';
  return (
    text[lang] ||
    text[DEFAULT_LANGUAGE] ||
    text.fa ||
    Object.values(text).find((v) => v && v.length > 0) ||
    ''
  );
}