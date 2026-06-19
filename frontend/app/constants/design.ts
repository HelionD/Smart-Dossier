import { Platform } from 'react-native';

export const Colors = {
  primary: '#000e28',
  primaryContainer: '#002350',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#728cbe',
  inversePrimary: '#adc7fd',
  secondary: '#0051d5',
  secondaryContainer: '#316bf3',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#fefcff',
  background: '#faf9fd',
  surface: '#faf9fd',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f4f3f7',
  surfaceContainer: '#eeedf2',
  surfaceContainerHigh: '#e9e7ec',
  surfaceContainerHighest: '#e3e2e6',
  onSurface: '#1a1b1f',
  onSurfaceVariant: '#44474f',
  outline: '#747780',
  outlineVariant: '#c4c6d0',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  statusCompleted: '#1a7a4a',
  statusCompletedBg: '#e8f5ee',
  statusInReview: '#b45309',
  statusInReviewBg: '#fef3c7',
  statusBlocked: '#ba1a1a',
  statusBlockedBg: '#ffdad6',
  statusOnTrack: '#0051d5',
  statusOnTrackBg: '#e0eaff',
};

export const Typography = {
  displayLg: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 36,
    lineHeight: 43,
  },
  headlineMd: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 24,
    lineHeight: 31,
  },
  headlineSm: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 18,
    lineHeight: 25,
  },
  headlineMdMobile: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 20,
    lineHeight: 26,
  },
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 26,
  },
  bodySm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  labelCaps: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const Spacing = {
  marginPage: 20,
  gutterGrid: 12,
  paddingCard: 16,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
};

export const BorderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
};

export const Elevation = {
  card: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2 },
    android: { elevation: 1 },
    default: {},
  }),
  activeCard: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
    android: { elevation: 3 },
    default: {},
  }),
};

export const PHASE_LABELS: Record<number, string> = {
  1: 'Njoftimi publik',
  2: 'Aplikimi',
  3: 'Verifikimi ASHK',
  4: 'Llogaritja e vlerës',
  5: 'Lidhja e kontratës',
  6: 'Dërgimi ASHK',
  7: 'Regjistrimi pronësisë',
};

export const PHASE_DESCRIPTIONS: Record<number, string> = {
  1: 'EKB afishon njoftimin publik',
  2: 'Qytetari dorëzon dokumentet fizike',
  3: 'Verifikim manual me ASHK (2–4 javë)',
  4: 'Llogaritje vlere me Excel manual',
  5: 'Nënshkrim fizik i kontratës',
  6: 'Dosja fizike dërgohet tek ASHK (4–8 javë)',
  7: 'ASHK regjistron pronësinë',
};

export const BOTTLENECK_PHASES = [3, 6];
