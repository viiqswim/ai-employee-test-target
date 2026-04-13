export interface FormatDateOptions {
  locale?: string;
  timezone?: string;
}

export function formatDate(date: Date, options?: FormatDateOptions): string {
  const { locale = "en-US", timezone = "UTC" } = options ?? {};
  return date.toLocaleDateString(locale, { timeZone: timezone });
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbol = currencySymbols[currency] ?? currency + " ";
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = amount < 0 ? "-" : "";
  return `${prefix}${symbol}${formatted}`;
}
