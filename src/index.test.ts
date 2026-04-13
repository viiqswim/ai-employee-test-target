import { describe, it, expect } from "vitest";
import { formatDate, formatCurrency } from "./index.js";

describe("formatDate", () => {
  it("formats a date with default locale and timezone", () => {
    expect(formatDate(new Date("2024-03-15"))).toBe("3/15/2024");
  });

  it("formats a date in en-US locale with UTC timezone", () => {
    expect(formatDate(new Date("2024-01-31"), { locale: "en-US", timezone: "UTC" })).toBe("1/31/2024");
  });

  it("formats a date in de-DE locale", () => {
    expect(formatDate(new Date("2024-03-15"), { locale: "de-DE" })).toBe("15.3.2024");
  });

  it("handles different timezones", () => {
    const date = new Date("2024-03-15T12:00:00Z");
    expect(formatDate(date, { timezone: "UTC" })).toBe("3/15/2024");
  });

  it("handles Japanese locale", () => {
    expect(formatDate(new Date("2024-01-01"), { locale: "ja-JP" })).toBe("2024/1/1");
  });

  it("handles ISO week dates", () => {
    expect(formatDate(new Date("2024-01-01"))).toBe("1/1/2024");
  });
});

describe("formatCurrency", () => {
  it("formats 1234.5 as $1,234.50 (default USD)", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats 1000000 as $1,000,000.00", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });

  it("handles negative numbers", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });

  it("supports EUR currency", () => {
    expect(formatCurrency(1234.5, "EUR")).toBe("€1,234.50");
  });

  it("supports GBP currency", () => {
    expect(formatCurrency(100, "GBP")).toBe("£100.00");
  });

  it("supports JPY currency", () => {
    expect(formatCurrency(5000, "JPY")).toBe("¥5,000.00");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles negative zero edge case", () => {
    expect(formatCurrency(-0)).toBe("$0.00");
  });

  it("supports unknown currency codes with space suffix", () => {
    expect(formatCurrency(100, "CAD")).toBe("CAD 100.00");
  });
});
