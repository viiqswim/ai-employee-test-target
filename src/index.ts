export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const symbol = currencySymbols[currency] ?? currency;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? "-" : "";
  return `${sign}${symbol}${formatted}`;
}
