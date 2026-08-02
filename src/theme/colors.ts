import {
  AccentColorId,
  ThemeModeId,
  getAccentSwatch,
  hexToRgba,
  mixHex,
  tintHex,
} from './accents';

const baseLight = {
  primary: '#0B111F',
  accent: '#9B6EFA',
  background: '#F6F9FC',
  surface: '#FFFFFF',
  text: '#0B111F',
  textDark: '#071123',
  textSecondary: '#677284',
  textMuted: 'rgba(11, 17, 31, 0.7)',
  textLabel: '#45556C',
  textSoft: '#596475',
  border: '#E1E5EB',
  borderSoft: 'rgba(224, 229, 235, 0.6)',
  track: '#EEF2F9',
  searchBg: 'rgba(237, 242, 248, 0.6)',
  error: '#C70036',
  success: '#007A55',
  successBright: '#20B46B',
  warning: '#BB4D00',
  white: '#FFFFFF',
  black: '#000000',
  notification: '#EE3533',
  metricGreen: '#CCF8DA',
  metricOrange: '#FFE4C2',
  metricPurple: '#F0E4FF',
  staffMetricGreen: '#D1FAE5',
  staffMetricOrange: '#FFEDD5',
  staffMetricPurple: '#EDE9FE',
  statusAvailable: '#00BC7D',
  statusReserved: '#FE9A00',
  statusMaintenance: '#FF2056',
  statusInactive: '#90A1B9',
  badgeActiveBg: 'rgba(32, 180, 107, 0.15)',
  badgePendingBg: '#FFFBEB',
  badgeOverdueBg: '#FFF1F2',
  activityReturn: '#ECFDF5',
  activityPay: '#FFFBEB',
  activityService: '#FAF5FF',
  growth: '#009966',
  late: '#F59E0B',
  absent: '#EF4444',
  deptSales: '#8B5CF6',
  deptSupport: '#20B46B',
  deptMechanics: '#F59E0B',
  deptAdmin: '#EF4444',
} as const;

type ModeSurface = {
  background: string;
  surface: string;
  text: string;
  textDark: string;
  textSecondary: string;
  textMuted: string;
  textLabel: string;
  textSoft: string;
  border: string;
  borderSoft: string;
  track: string;
  searchBg: string;
  primary: string;
};

function isDarkMode(mode: ThemeModeId): boolean {
  return mode === 'dark' || mode === 'midnight';
}

function surfacesForMode(mode: ThemeModeId): ModeSurface {
  switch (mode) {
    case 'dark':
      return {
        background: '#121826',
        surface: '#1A2332',
        text: '#F3F6FB',
        textDark: '#FFFFFF',
        textSecondary: '#A7B0C0',
        textMuted: 'rgba(243, 246, 251, 0.7)',
        textLabel: '#C5CDD8',
        textSoft: '#9AA3B2',
        border: '#2A3445',
        borderSoft: 'rgba(255, 255, 255, 0.08)',
        track: '#243044',
        searchBg: 'rgba(36, 48, 68, 0.8)',
        primary: '#F3F6FB',
      };
    case 'midnight':
      return {
        background: '#070B14',
        surface: '#0B111F',
        text: '#E8EEF7',
        textDark: '#FFFFFF',
        textSecondary: '#8B95A8',
        textMuted: 'rgba(232, 238, 247, 0.65)',
        textLabel: '#B0B8C8',
        textSoft: '#8490A3',
        border: '#1C2436',
        borderSoft: 'rgba(255, 255, 255, 0.06)',
        track: '#151C2C',
        searchBg: 'rgba(21, 28, 44, 0.85)',
        primary: '#E8EEF7',
      };
    case 'cloud':
      return {
        background: '#E8EEF5',
        surface: '#F7FAFD',
        text: '#0B111F',
        textDark: '#071123',
        textSecondary: '#677284',
        textMuted: 'rgba(11, 17, 31, 0.7)',
        textLabel: '#45556C',
        textSoft: '#596475',
        border: '#D5DEE8',
        borderSoft: 'rgba(180, 190, 205, 0.5)',
        track: '#DDE5EF',
        searchBg: 'rgba(220, 228, 238, 0.7)',
        primary: '#0B111F',
      };
    case 'light':
    default:
      return {
        background: baseLight.background,
        surface: baseLight.surface,
        text: baseLight.text,
        textDark: baseLight.textDark,
        textSecondary: baseLight.textSecondary,
        textMuted: baseLight.textMuted,
        textLabel: baseLight.textLabel,
        textSoft: baseLight.textSoft,
        border: baseLight.border,
        borderSoft: baseLight.borderSoft,
        track: baseLight.track,
        searchBg: baseLight.searchBg,
        primary: baseLight.primary,
      };
  }
}

/** Soft colored card fills — light pastels in light themes, muted dark tints in dark */
function softSurfacesForMode(
  mode: ThemeModeId,
  surface: string,
  accentMain: string,
  accentBrand: string,
) {
  if (!isDarkMode(mode)) {
    const soft = tintHex(accentMain, 0.88);
    const softStrong = tintHex(accentMain, 0.78);
    return {
      metricGreen: baseLight.metricGreen,
      metricOrange: baseLight.metricOrange,
      metricPurple: baseLight.metricPurple,
      staffMetricGreen: baseLight.staffMetricGreen,
      staffMetricOrange: baseLight.staffMetricOrange,
      staffMetricPurple: baseLight.staffMetricPurple,
      metricBlue: soft,
      staffMetricBlue: softStrong,
      fleetStart: tintHex(accentMain, 0.92),
      fleetEnd: tintHex(accentBrand, 0.9),
      activityBook: tintHex(accentMain, 0.93),
      activityReturn: baseLight.activityReturn,
      activityPay: baseLight.activityPay,
      activityService: baseLight.activityService,
      badgeActiveBg: baseLight.badgeActiveBg,
      badgePendingBg: baseLight.badgePendingBg,
      badgeOverdueBg: baseLight.badgeOverdueBg,
      actionSoftFill: softStrong,
      // Ink for frosted / pastel overlays that stay light even in dark themes
      onPastel: '#0F172B',
      onPastelMuted: '#45556C',
    };
  }

  // Dark / midnight: mix accent into surface so light theme text stays readable
  const soft = (hex: string, amount = 0.28) => mixHex(surface, hex, amount);
  return {
    metricGreen: soft('#20B46B', 0.32),
    metricOrange: soft('#F59E0B', 0.3),
    metricPurple: soft('#8B5CF6', 0.32),
    staffMetricGreen: soft('#20B46B', 0.28),
    staffMetricOrange: soft('#F59E0B', 0.26),
    staffMetricPurple: soft('#8B5CF6', 0.28),
    metricBlue: soft(accentMain, 0.34),
    staffMetricBlue: soft(accentMain, 0.3),
    fleetStart: soft(accentMain, 0.4),
    fleetEnd: soft(accentBrand, 0.45),
    activityBook: soft(accentMain, 0.26),
    activityReturn: soft('#20B46B', 0.24),
    activityPay: soft('#F59E0B', 0.24),
    activityService: soft('#8B5CF6', 0.24),
    badgeActiveBg: hexToRgba('#20B46B', 0.22),
    badgePendingBg: soft('#F59E0B', 0.22),
    badgeOverdueBg: soft('#EF4444', 0.22),
    actionSoftFill: soft(accentMain, 0.28),
    onPastel: '#0F172B',
    onPastelMuted: '#45556C',
  };
}

export function buildAppColors(
  accentId: AccentColorId = 'blue',
  modeId: ThemeModeId = 'light',
) {
  const accent = getAccentSwatch(accentId);
  const surfaces = surfacesForMode(modeId);
  const softPack = softSurfacesForMode(
    modeId,
    surfaces.surface,
    accent.main,
    accent.brand,
  );

  return {
    ...baseLight,
    ...surfaces,
    ...softPack,
    // Accent-driven tokens (legacy blue names kept so existing styles remap)
    secondary: accent.secondary,
    brandBlue: accent.brand,
    actionBlue: accent.main,
    present: accent.main,
    deptOperations: accent.main,
    statusRented: accent.brand,
    // Convenience tints for hardcoded rgba replacements
    actionTint04: hexToRgba(accent.main, 0.04),
    actionTint06: hexToRgba(accent.main, 0.06),
    actionTint08: hexToRgba(accent.main, 0.08),
    actionTint1: hexToRgba(accent.main, 0.1),
    actionTint12: hexToRgba(accent.main, 0.12),
    actionTint15: hexToRgba(accent.main, 0.15),
    actionTint16: hexToRgba(accent.main, 0.16),
    actionTint2: hexToRgba(accent.main, 0.2),
    actionTint28: hexToRgba(accent.main, 0.28),
    actionTint3: hexToRgba(accent.main, 0.3),
    actionTint35: hexToRgba(accent.main, 0.35),
  };
}

export type AppColors = ReturnType<typeof buildAppColors>;

/** Mutable default palette — ThemeProvider keeps this in sync for non-hook modules */
export const colors: AppColors = buildAppColors('blue', 'light');

export function syncAppColors(next: AppColors) {
  Object.assign(colors, next);
}
