export interface FormatDateOptions {
  locale?: string;
  timezone?: string;
}

export function formatDate(date: Date, options?: FormatDateOptions): string {
  const { locale = "en-US", timezone = "UTC" } = options ?? {};
  return date.toLocaleDateString(locale, { timeZone: timezone });
}
