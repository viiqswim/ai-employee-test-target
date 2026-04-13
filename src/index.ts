export function formatDate(date: Date, options?: { timezoneOffset?: number }): string {
  if (date === null || date === undefined) {
    return "Invalid Date";
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  let d: Date = date;

  if (options?.timezoneOffset !== undefined) {
    d = new Date(date.getTime() + options.timezoneOffset * 60 * 1000);
  }

  return d.toISOString().split("T")[0];
}