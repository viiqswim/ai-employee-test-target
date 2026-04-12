export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatCurrency(amount: number, currency?: string): string {
  const symbol = currency === "EUR" ? "€" : "$";
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = amount < 0 ? "-" : "";
  return `${prefix}${symbol}${formatted}`;
}
