import { useMemo } from 'react';
import type { GpxTrack, ChartPointByDistance, ChartPointByTime } from '../types/gpx';
import { RESAMPLE_INTERVAL_KM } from '../constants/chartConfig';

function interpolate(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
): number {
  if (x1 === x0) return y0;
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

function getValueAtDist(
  track: GpxTrack,
  distKm: number,
  field: 'ele' | 'gradientPct' | 'speedKmh' | 'cumEleGain'
): number | null {
  const pts = track.points;
  if (pts.length === 0) return null;

  if (distKm <= pts[0].distKm) return pts[0][field];
  if (distKm > pts[pts.length - 1].distKm) return null;
  if (distKm === pts[pts.length - 1].distKm) return pts[pts.length - 1][field];

  let lo = 0;
  let hi = pts.length - 1;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (pts[mid].distKm <= distKm) lo = mid;
    else hi = mid;
  }

  return interpolate(distKm, pts[lo].distKm, pts[hi].distKm, pts[lo][field], pts[hi][field]);
}

function getValueAtTime(
  track: GpxTrack,
  elapsedSec: number,
  field: 'ele' | 'speedKmh'
): number | null {
  const pts = track.points;
  if (pts.length === 0 || pts[0].time === null) return null;

  const last = pts[pts.length - 1];
  if (last.elapsedSec === 0) return null;

  if (elapsedSec <= 0) return pts[0][field];
  if (elapsedSec >= last.elapsedSec) return last[field];

  let lo = 0;
  let hi = pts.length - 1;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (pts[mid].elapsedSec <= elapsedSec) lo = mid;
    else hi = mid;
  }

  return interpolate(
    elapsedSec,
    pts[lo].elapsedSec,
    pts[hi].elapsedSec,
    pts[lo][field],
    pts[hi][field]
  );
}

export function useGpxMetrics(track1: GpxTrack | null, track2: GpxTrack | null) {
  const baseEle1 = track1?.points[0]?.ele ?? 0;
  const baseEle2 = track2?.points[0]?.ele ?? 0;

  const byDistance = useMemo<ChartPointByDistance[]>(() => {
    if (!track1 && !track2) return [];

    const maxDist = Math.max(
      track1?.totalDistKm ?? 0,
      track2?.totalDistKm ?? 0
    );
    if (maxDist <= 0) return [];

    const steps = Math.ceil(maxDist / RESAMPLE_INTERVAL_KM);
    const result: ChartPointByDistance[] = [];

    for (let i = 0; i <= steps; i++) {
      const distKm = Math.min(i * RESAMPLE_INTERVAL_KM, maxDist);
      const rawEle1 = track1 ? getValueAtDist(track1, distKm, 'ele') : null;
      const rawEle2 = track2 ? getValueAtDist(track2, distKm, 'ele') : null;
      result.push({
        distKm: Math.round(distKm * 1000) / 1000,
        ele1: rawEle1 !== null ? rawEle1 - baseEle1 : null,
        ele2: rawEle2 !== null ? rawEle2 - baseEle2 : null,
        grad1: track1 ? getValueAtDist(track1, distKm, 'gradientPct') : null,
        grad2: track2 ? getValueAtDist(track2, distKm, 'gradientPct') : null,
        speed1: track1 ? getValueAtDist(track1, distKm, 'speedKmh') : null,
        speed2: track2 ? getValueAtDist(track2, distKm, 'speedKmh') : null,
        cumGain1: track1 ? getValueAtDist(track1, distKm, 'cumEleGain') : null,
        cumGain2: track2 ? getValueAtDist(track2, distKm, 'cumEleGain') : null,
      });
    }

    return result;
  }, [track1, track2, baseEle1, baseEle2]);

  const byTime = useMemo<ChartPointByTime[]>(() => {
    const hasTime = (t: GpxTrack | null) =>
      t !== null && t.durationSec !== null && t.durationSec > 0;

    if (!hasTime(track1) && !hasTime(track2)) return [];

    const maxSec = Math.max(
      hasTime(track1) ? (track1!.durationSec ?? 0) : 0,
      hasTime(track2) ? (track2!.durationSec ?? 0) : 0
    );
    if (maxSec <= 0) return [];

    const intervalSec = 60;
    const steps = Math.ceil(maxSec / intervalSec);
    const result: ChartPointByTime[] = [];

    for (let i = 0; i <= steps; i++) {
      const elapsedSec = Math.min(i * intervalSec, maxSec);
      const rawEle1 = track1 && hasTime(track1) ? getValueAtTime(track1, elapsedSec, 'ele') : null;
      const rawEle2 = track2 && hasTime(track2) ? getValueAtTime(track2, elapsedSec, 'ele') : null;
      result.push({
        elapsedMin: Math.round((elapsedSec / 60) * 10) / 10,
        ele1: rawEle1 !== null ? rawEle1 - baseEle1 : null,
        ele2: rawEle2 !== null ? rawEle2 - baseEle2 : null,
        speed1: track1 && hasTime(track1) ? getValueAtTime(track1, elapsedSec, 'speedKmh') : null,
        speed2: track2 && hasTime(track2) ? getValueAtTime(track2, elapsedSec, 'speedKmh') : null,
      });
    }

    return result;
  }, [track1, track2, baseEle1, baseEle2]);

  const hasTimeData =
    (track1 !== null && track1.durationSec !== null && track1.durationSec > 0) ||
    (track2 !== null && track2.durationSec !== null && track2.durationSec > 0);

  return { byDistance, byTime, hasTimeData };
}
