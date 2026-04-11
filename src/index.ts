export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const [intPart, decPart] = absAmount.toFixed(2).split(".");
  const formattedInt = parseInt(intPart).toLocaleString("en-US");
  const symbol = currency === "EUR" ? "€" : "$";
  const sign = isNegative ? "-" : "";
  return `${sign}${symbol}${formattedInt}.${decPart}`;
}
