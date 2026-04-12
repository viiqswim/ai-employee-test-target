import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "./index.js";

describe("formatCurrency", () => {
  it("formats a number as USD currency by default", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats large numbers with thousands separators", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });

  it("formats negative numbers correctly", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });

  it("formats EUR currency when specified", () => {
    expect(formatCurrency(100, "EUR")).toBe("€100.00");
  });
});

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
