import type { GpxPoint, GpxTrack, TrackPoint } from '../types/gpx';
import { haversineKm } from './distance';
import { MAX_SPEED_KMH } from '../constants/chartConfig';

export function computeTrack(fileName: string, points: GpxPoint[]): GpxTrack {
  if (points.length === 0) {
    return { fileName, points: [], totalDistKm: 0, totalEleGain: 0, durationSec: null };
  }

  const trackPoints: TrackPoint[] = [];
  let cumulativeDist = 0;
  let totalEleGain = 0;
  let cumEleGain = 0;
  const firstTime = points[0].time;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    let distKm = 0;
    let gradientPct = 0;
    let speedKmh = 0;
    let elapsedSec = 0;

    if (i > 0) {
      const prev = points[i - 1];
      const segDist = haversineKm(prev.lat, prev.lon, p.lat, p.lon);
      cumulativeDist += segDist;

      const elevDiff = p.ele - prev.ele;
      if (segDist > 0) {
        gradientPct = (elevDiff / (segDist * 1000)) * 100;
      }

      if (elevDiff > 0) {
        totalEleGain += elevDiff;
        cumEleGain += elevDiff;
      }

      if (p.time && prev.time) {
        const dtSec = (p.time.getTime() - prev.time.getTime()) / 1000;
        if (dtSec > 0) {
          speedKmh = (segDist / dtSec) * 3600;
          if (speedKmh > MAX_SPEED_KMH) {
            speedKmh = 0;
          }
        }
      }
    }

    if (firstTime && p.time) {
      elapsedSec = (p.time.getTime() - firstTime.getTime()) / 1000;
    }

    distKm = cumulativeDist;

    trackPoints.push({
      index: i,
      lat: p.lat,
      lon: p.lon,
      ele: p.ele,
      time: p.time,
      elapsedSec,
      distKm,
      gradientPct,
      speedKmh,
      cumEleGain,
    });
  }

  const lastPoint = trackPoints[trackPoints.length - 1];
  const durationSec =
    firstTime && lastPoint.time
      ? (lastPoint.time.getTime() - firstTime.getTime()) / 1000
      : null;

  return {
    fileName,
    points: trackPoints,
    totalDistKm: lastPoint.distKm,
    totalEleGain,
    durationSec,
  };
}
