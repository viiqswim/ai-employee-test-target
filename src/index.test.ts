import { describe, it, expect } from "vitest";
import { formatDate } from "./index.js";

describe("formatDate", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(formatDate(new Date("2024-03-15"))).toBe("2024-03-15");
  });

  it("handles end-of-month dates", () => {
    expect(formatDate(new Date("2024-01-31"))).toBe("2024-01-31");
  });

  it("handles leap year dates", () => {
    expect(formatDate(new Date("2024-02-29"))).toBe("2024-02-29");
  });

  it("throws error for null input", () => {
    expect(() => formatDate(null)).toThrow("Date input is null or undefined");
  });

  it("throws error for undefined input", () => {
    expect(() => formatDate(undefined)).toThrow("Date input is null or undefined");
  });

  it("throws error for invalid date", () => {
    expect(() => formatDate(new Date("invalid"))).toThrow("Invalid date input");
  });
});
