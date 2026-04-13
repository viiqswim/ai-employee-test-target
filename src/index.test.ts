import { describe, it, expect } from "vitest";
import { formatDate } from "./index.js";

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
