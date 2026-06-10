import { GRADIENT_COLORS } from '../constants/chartConfig';

export function gradientToColor(gradientPct: number): string {
  if (gradientPct < 0) return GRADIENT_COLORS.descent;
  if (gradientPct < 5) return GRADIENT_COLORS.gentle;
  if (gradientPct < 10) return GRADIENT_COLORS.moderate;
  if (gradientPct < 15) return GRADIENT_COLORS.steep;
  return GRADIENT_COLORS.verysteep;
}

export interface GradientStop {
  offset: string;
  color: string;
}

export function computeGradientStops(
  distKmArr: number[],
  gradientArr: number[],
  totalDistKm: number
): GradientStop[] {
  if (totalDistKm <= 0 || distKmArr.length === 0) return [];

  const stops: GradientStop[] = [];

  for (let i = 0; i < distKmArr.length; i++) {
    const offset = `${((distKmArr[i] / totalDistKm) * 100).toFixed(2)}%`;
    const color = gradientToColor(gradientArr[i]);

    if (i === 0 || stops[stops.length - 1].color !== color) {
      stops.push({ offset, color });
    }
  }

  // Ensure last stop reaches 100%
  if (stops.length > 0) {
    stops.push({ offset: '100%', color: stops[stops.length - 1].color });
  }

  return stops;
}
