import { ElevationDistanceChart } from '../charts/ElevationDistanceChart';
import { GradientChart } from '../charts/GradientChart';
import { CumulativeGainChart } from '../charts/CumulativeGainChart';
import type { GpxTrack, ChartPointByDistance } from '../../types/gpx';

interface Props {
  track1: GpxTrack | null;
  track2: GpxTrack | null;
  byDistance: ChartPointByDistance[];
}

export function ChartGrid({ track1, track2, byDistance }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <ElevationDistanceChart data={byDistance} track1={track1} track2={track2} />
      <CumulativeGainChart data={byDistance} track1={track1} track2={track2} />
      <GradientChart data={byDistance} track1={track1} track2={track2} />
    </div>
  );
}
