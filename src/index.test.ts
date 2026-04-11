import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime } from "./index.js";

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

describe("formatDateTime", () => {
  it("formats a datetime as YYYY-MM-DDTHH:mm:ss", () => {
    expect(formatDateTime(new Date("2024-03-15T10:30:45"))).toBe("2024-03-15T10:30:45");
  });

  it("handles morning time (00:00:00)", () => {
    expect(formatDateTime(new Date("2024-03-15T00:00:00"))).toBe("2024-03-15T00:00:00");
  });

  it("handles evening time (23:59:59)", () => {
    expect(formatDateTime(new Date("2024-03-15T23:59:59"))).toBe("2024-03-15T23:59:59");
  });

  it("handles midday time (12:30:45)", () => {
    expect(formatDateTime(new Date("2024-03-15T12:30:45"))).toBe("2024-03-15T12:30:45");
  });
});
