import { describe, expect, it } from "vitest";
import { defaultPalette, luminance, paletteVariables, parsePalette, readableInk, validComparison } from "./dashboard-preferences";

describe("preferencias locales", () => {
  it("tolera almacenamiento corrupto y descarta valores CSS no hex", () => {
    for (const input of [null, "{broken", "null", "[]", '{"accent":"url(https://evil.test)"}', '{"accent":"#ffffff","background":"#000000"}']) expect(parsePalette(input)).toEqual(defaultPalette);
    expect(parsePalette(JSON.stringify({ accent: "#22BBcc", background: "#ffffff", surface: "#eeeeee", ignored: true }))).toEqual({ accent: "#22BBcc", background: "#ffffff", surface: "#eeeeee" });
  });
  it("elige texto con contraste WCAG AA en extremos y medios", () => {
    for (const color of ["#000000", "#ffffff", "#777777", "#7548c7", "#5ee3e8", "#999900"]) {
      const a = luminance(color), b = luminance(readableInk(color));
      expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toBeGreaterThanOrEqual(4.5);
    }
    expect(paletteVariables({ ...defaultPalette, accent: "#14131c" })["--c4-accent-text"]).toBe("currentColor");
  });
  it("rechaza conteos imposibles, infinitos y fracciones", () => {
    expect(validComparison(6, 5, 6)).toBe(true);
    expect(validComparison(6, 6, 0)).toBe(true);
    for (const input of [[0, 0, 0], [6, 7, 6], [6, -1, 6], [6, 2.5, 6], [10001, 1, 1], [6, 1, NaN]]) expect(validComparison(...input as [number, number, number])).toBe(false);
  });
});
