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
  it("formats USD by default", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
  });

  it("formats whole dollar amounts", () => {
    expect(formatCurrency(50)).toBe("$50.00");
  });

  it("formats decimal amounts", () => {
    expect(formatCurrency(19.99)).toBe("$19.99");
  });

  it("formats large numbers with thousand separators", () => {
    expect(formatCurrency(1234567.89)).toBe("$1,234,567.89");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative amounts", () => {
    expect(formatCurrency(-50)).toBe("-$50.00");
  });

  it("formats EUR currency", () => {
    expect(formatCurrency(100, "EUR")).toBe("€100.00");
  });

  it("formats GBP currency", () => {
    expect(formatCurrency(100, "GBP")).toBe("£100.00");
  });

  it("formats JPY currency without decimals", () => {
    expect(formatCurrency(1000, "JPY")).toBe("¥1,000");
  });
});
