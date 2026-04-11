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
  const symbol = currencySymbols[currency] || "$";
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const decimals = currency === "JPY" ? 0 : 2;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absAmount);

  const signPart = isNegative ? "-" : "";
  return signPart + symbol + formatted;
}
