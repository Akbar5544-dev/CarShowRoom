export type ThemeModeId = 'light' | 'dark' | 'midnight' | 'cloud';

export type AccentColorId =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'red'
  | 'teal';

export type AccentSwatch = {
  id: AccentColorId;
  /** Primary action / links (maps to actionBlue) */
  main: string;
  /** Stronger brand fill (maps to brandBlue) */
  brand: string;
  /** Secondary interactive (maps to secondary) */
  secondary: string;
};

export const ACCENT_SWATCHES: AccentSwatch[] = [
  {
    id: 'blue',
    main: '#1C69E3',
    brand: '#3D72FF',
    secondary: '#3061EF',
  },
  {
    id: 'purple',
    main: '#A855F7',
    brand: '#C084FC',
    secondary: '#9333EA',
  },
  {
    id: 'green',
    main: '#14B8A6',
    brand: '#2DD4BF',
    secondary: '#0D9488',
  },
  {
    id: 'orange',
    main: '#F97316',
    brand: '#FB923C',
    secondary: '#EA580C',
  },
  {
    id: 'red',
    main: '#EF4444',
    brand: '#F87171',
    secondary: '#DC2626',
  },
  {
    id: 'teal',
    main: '#06B6D4',
    brand: '#22D3EE',
    secondary: '#0891B2',
  },
];

export const THEME_MODE_PREVIEWS: {
  id: ThemeModeId;
  label: string;
  preview: string;
}[] = [
  {id: 'light', label: 'Light', preview: '#FFFFFF'},
  {id: 'dark', label: 'Dark', preview: '#1A2332'},
  {id: 'midnight', label: 'Midnight', preview: '#0B111F'},
  {id: 'cloud', label: 'Cloud', preview: '#E8EEF5'},
];

export function getAccentSwatch(id: AccentColorId): AccentSwatch {
  return ACCENT_SWATCHES.find(item => item.id === id) ?? ACCENT_SWATCHES[0];
}

/** Parse #RRGGBB into r,g,b */
export function hexToRgb(hex: string): {r: number; g: number; b: number} {
  const normalized = hex.replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map(ch => ch + ch)
          .join('')
      : normalized;
  const value = Number.parseInt(full, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const {r, g, b} = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Mix hex toward white (amount 0–1) for soft tints */
export function tintHex(hex: string, amount = 0.85): string {
  const {r, g, b} = hexToRgb(hex);
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * amount);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

/** Mix hex toward black (amount 0–1) for dark-theme soft fills */
export function shadeHex(hex: string, amount = 0.65): string {
  const {r, g, b} = hexToRgb(hex);
  const mix = (channel: number) => Math.round(channel * (1 - amount));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

/** Blend two hex colors (amount = weight of `to`) */
export function mixHex(from: string, to: string, amount = 0.5): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const mix = (x: number, y: number) =>
    Math.round(x + (y - x) * Math.min(1, Math.max(0, amount)));
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(mix(a.r, b.r))}${toHex(mix(a.g, b.g))}${toHex(mix(a.b, b.b))}`;
}

/** Relative luminance 0–1 (sRGB) */
export function hexLuminance(hex: string): number {
  const {r, g, b} = hexToRgb(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Dark ink on light surfaces, light ink on dark surfaces */
export function contrastInk(backgroundHex: string): string {
  return hexLuminance(backgroundHex) > 0.45 ? '#0F172B' : '#F3F6FB';
}

export function contrastMuted(backgroundHex: string): string {
  return hexLuminance(backgroundHex) > 0.45 ? '#45556C' : '#B0B8C8';
}
