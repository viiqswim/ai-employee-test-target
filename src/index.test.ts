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

  it("throws error for null input", () => {
    expect(() => formatDate(null)).toThrow("Date input is null or undefined");
  });

  it("throws error for undefined input", () => {
    expect(() => formatDate(undefined)).toThrow("Date input is null or undefined");
  });

  it("throws error for invalid date", () => {
    expect(() => formatDate(new Date("invalid"))).toThrow("Invalid date input");
  });

  describe("custom formats", () => {
    it("formats date as DD/MM/YYYY", () => {
      expect(formatDate(new Date("2024-03-15"), { format: "DD/MM/YYYY" })).toBe("15/03/2024");
    });

    it("formats date as MM-DD-YYYY", () => {
      expect(formatDate(new Date("2024-03-15"), { format: "MM-DD-YYYY" })).toBe("03-15-2024");
    });

    it("formats date as DD-MM-YYYY", () => {
      expect(formatDate(new Date("2024-03-15"), { format: "DD-MM-YYYY" })).toBe("15-03-2024");
    });

    it("formats date as MM/DD/YYYY", () => {
      expect(formatDate(new Date("2024-03-15"), { format: "MM/DD/YYYY" })).toBe("03/15/2024");
    });
  });

  describe("locale-aware formatting", () => {
    it("formats date with German locale", () => {
      const result = formatDate(new Date("2024-03-15"), { locale: "de-DE" });
      expect(result).toMatch(/15\.03\.2024/);
    });

    it("formats date with US locale", () => {
      const result = formatDate(new Date("2024-03-15"), { locale: "en-US" });
      expect(result).toMatch(/03\/15\/2024/);
    });

    it("formats date with French locale", () => {
      const result = formatDate(new Date("2024-03-15"), { locale: "fr-FR" });
      expect(result).toMatch(/15\/03\/2024/);
    });
  });
});
