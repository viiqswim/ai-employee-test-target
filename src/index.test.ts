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

  it("handles start of year", () => {
    expect(formatDate(new Date("2024-01-01"))).toBe("2024-01-01");
  });

  it("handles end of year", () => {
    expect(formatDate(new Date("2024-12-31"))).toBe("2024-12-31");
  });

  it("handles early month dates", () => {
    expect(formatDate(new Date("2024-01-10"))).toBe("2024-01-10");
  });

  it("handles varying month lengths", () => {
    expect(formatDate(new Date("2024-04-30"))).toBe("2024-04-30");
    expect(formatDate(new Date("2024-06-30"))).toBe("2024-06-30");
  });
});
