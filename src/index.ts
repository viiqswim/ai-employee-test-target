export type DateFormat =
  | "YYYY-MM-DD"
  | "DD/MM/YYYY"
  | "MM-DD-YYYY"
  | "DD-MM-YYYY"
  | "MM/DD/YYYY";

export interface FormatOptions {
  format?: DateFormat;
  locale?: string;
}

export function formatDate(
  date: Date | null | undefined,
  options?: FormatOptions
): string {
  if (date == null) {
    throw new Error("Date input is null or undefined");
  }
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const format = options?.format ?? "YYYY-MM-DD";
  const locale = options?.locale;

  if (locale) {
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM-DD-YYYY":
      return `${month}-${day}-${year}`;
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
    default:
      return `${year}-${month}-${day}`;
  }
}
