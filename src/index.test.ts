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
  it("formats 1234.5 as '$1,234.50' (default USD)", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats 1000000 as '$1,000,000.00'", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });

  it("handles negative numbers: -99.99 → '-$99.99'", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });

  it("supports EUR currency", () => {
    expect(formatCurrency(1234.5, "EUR")).toBe("€1,234.50");
  });
});
