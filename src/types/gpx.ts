export interface GpxPoint {
  lat: number;
  lon: number;
  ele: number;
  time: Date | null;
}

export interface TrackPoint {
  index: number;
  lat: number;
  lon: number;
  ele: number;
  time: Date | null;
  elapsedSec: number;
  distKm: number;
  gradientPct: number;
  speedKmh: number;
  cumEleGain: number;
}

export interface GpxTrack {
  fileName: string;
  points: TrackPoint[];
  totalDistKm: number;
  totalEleGain: number;
  durationSec: number | null;
}

export interface ChartPointByDistance {
  distKm: number;
  ele1: number | null;
  ele2: number | null;
  grad1: number | null;
  grad2: number | null;
  speed1: number | null;
  speed2: number | null;
  cumGain1: number | null;
  cumGain2: number | null;
}

export interface ChartPointByTime {
  elapsedMin: number;
  ele1: number | null;
  ele2: number | null;
  speed1: number | null;
  speed2: number | null;
}
