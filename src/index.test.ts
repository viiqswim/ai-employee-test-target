import { describe, it, expect } from "vitest";
import { formatDate, formatCurrency } from "./index.js";

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
});

describe("formatCurrency", () => {
  it("formats with default USD formatting", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats large numbers with proper separators", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });

  it("formats negative numbers with minus sign before currency symbol", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });

  it("formats EUR currency with € symbol prefix", () => {
    expect(formatCurrency(1234.5, "EUR")).toBe("€1,234.50");
  });

  it("formats GBP currency with £ symbol prefix", () => {
    expect(formatCurrency(1234.5, "GBP")).toBe("£1,234.50");
  });

  it("formats JPY currency with ¥ symbol and no decimal places", () => {
    expect(formatCurrency(1234.5, "JPY")).toBe("¥1,235");
  });
});
