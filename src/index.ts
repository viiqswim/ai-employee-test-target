export function formatDate(date: Date | null | undefined): string {
  if (date == null) {
    throw new Error("Date input is null or undefined");
  }
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }
  return date.toISOString().split("T")[0];
}
