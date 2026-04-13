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

  it("returns 'Invalid Date' for null input", () => {
    expect(formatDate(null as unknown as Date)).toBe("Invalid Date");
  });

  it("returns 'Invalid Date' for undefined input", () => {
    expect(formatDate(undefined as unknown as Date)).toBe("Invalid Date");
  });

  it("returns 'Invalid Date' for invalid Date object", () => {
    expect(formatDate(new Date("invalid"))).toBe("Invalid Date");
  });

  it("handles timezone offset for positive adjustment", () => {
    const date = new Date("2024-03-15T00:00:00Z");
    expect(formatDate(date, { timezoneOffset: 60 })).toBe("2024-03-15");
  });

  it("handles timezone offset for negative adjustment", () => {
    const date = new Date("2024-03-15T12:00:00Z");
    expect(formatDate(date, { timezoneOffset: -300 })).toBe("2024-03-15");
  });

  it("handles boundary condition at start of year", () => {
    expect(formatDate(new Date("2024-01-01"))).toBe("2024-01-01");
  });

  it("handles boundary condition at end of year", () => {
    expect(formatDate(new Date("2024-12-31"))).toBe("2024-12-31");
  });
});