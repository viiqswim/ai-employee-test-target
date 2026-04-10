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
  it("formats positive USD amount with default USD", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats large USD amounts with thousand separators", () => {
    expect(formatCurrency(1234567.89)).toBe("$1,234,567.89");
  });

  it("formats zero USD amount", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats small USD amounts with two decimal places", () => {
    expect(formatCurrency(9.5)).toBe("$9.50");
  });

  describe("negative numbers", () => {
    it("formats negative USD amount", () => {
      expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
    });

    it("formats negative zero", () => {
      expect(formatCurrency(-0)).toBe("-$0.00");
    });

    it("formats small negative amounts", () => {
      expect(formatCurrency(-9.5)).toBe("-$9.50");
    });
  });

  describe("EUR currency", () => {
    it("formats positive EUR amount", () => {
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
    });

    it("formats large EUR amounts with thousand separators", () => {
      expect(formatCurrency(1234567.89, "EUR")).toBe("€1,234,567.89");
    });

    it("formats zero EUR amount", () => {
      expect(formatCurrency(0, "EUR")).toBe("€0.00");
    });

    it("formats small EUR amounts with two decimal places", () => {
      expect(formatCurrency(9.5, "EUR")).toBe("€9.50");
    });

    it("formats negative EUR amount", () => {
      expect(formatCurrency(-1234.56, "EUR")).toBe("-€1,234.56");
    });
  });
});
