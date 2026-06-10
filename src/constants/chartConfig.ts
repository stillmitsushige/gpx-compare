export const TRACK_COLORS = {
  track1: '#3b82f6',
  track2: '#f97316',
} as const;

export const GRADIENT_COLORS = {
  descent: '#3b82f6',   // < 0%
  gentle: '#22c55e',    // 0–5%
  moderate: '#eab308',  // 5–10%
  steep: '#f97316',     // 10–15%
  verysteep: '#ef4444', // >= 15%
} as const;

export const GRADIENT_THRESHOLDS = {
  descent: 0,
  gentle: 5,
  moderate: 10,
  steep: 15,
} as const;

export const RESAMPLE_INTERVAL_KM = 0.05;
export const MAX_SPEED_KMH = 30;
