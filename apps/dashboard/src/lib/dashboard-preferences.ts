export type DashboardPalette = { accent: string; background: string; surface: string };
export const defaultPalette: DashboardPalette = { accent: "#b78aff", background: "#14131c", surface: "#1d1b28" };
export const paletteKey = "c4.dashboard.palette.v1";
const hex = /^#[\da-f]{6}$/i;

export function parsePalette(value: string | null): DashboardPalette {
  try {
    const candidate: unknown = JSON.parse(value ?? "null");
    if (!candidate || typeof candidate !== "object") return defaultPalette;
    const p = candidate as Record<string, unknown>;
    if ([p.accent, p.background, p.surface].every((c) => typeof c === "string" && hex.test(c))) {
      return { accent: p.accent as string, background: p.background as string, surface: p.surface as string };
    }
  } catch { /* Missing/corrupt preferences must not break the dashboard. */ }
  return defaultPalette;
}

export function luminance(color: string): number {
  const rgb = [1, 3, 5].map((start) => parseInt(color.slice(start, start + 2), 16) / 255)
    .map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

export function readableInk(color: string): string {
  const light = luminance(color);
  return (light + 0.05) / 0.05 >= 1.05 / (light + 0.05) ? "#000000" : "#ffffff";
}

export function paletteVariables(p: DashboardPalette): Record<string, string> {
  // Text and the accent button always choose the higher-contrast black/white pair.
  // Accent text on arbitrary backgrounds uses a separate accessible foreground.
  const backgroundInk = readableInk(p.background);
  const contrast = (a: string, b: string) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
  const accentText = contrast(p.accent, p.background) >= 4.5 && contrast(p.accent, p.surface) >= 4.5 ? p.accent : "currentColor";
  return {
    "--background": p.background, "--foreground": backgroundInk,
    "--card": p.surface, "--card-foreground": readableInk(p.surface),
    "--popover": p.surface, "--popover-foreground": readableInk(p.surface),
    "--primary": p.accent, "--primary-foreground": readableInk(p.accent),
    "--c4-accent-text": accentText, "--ring": backgroundInk,
    "--muted": p.surface, "--muted-foreground": backgroundInk,
    "--secondary": p.surface, "--secondary-foreground": readableInk(p.surface),
    "--accent": p.surface, "--accent-foreground": readableInk(p.surface),
    "--border": readableInk(p.surface) + "50", "--input": readableInk(p.surface) + "60",
  };
}

export function validComparison(total: number, before: number, after: number): boolean {
  return [total, before, after].every(Number.isInteger) && total >= 1 && total <= 10000 && before >= 0 && after >= 0 && before <= total && after <= total;
}
