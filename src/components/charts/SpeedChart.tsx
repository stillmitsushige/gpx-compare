import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './shared/ChartContainer';
import type { ChartPointByDistance } from '../../types/gpx';
import type { GpxTrack } from '../../types/gpx';
import { TRACK_COLORS } from '../../constants/chartConfig';

interface Props {
  data: ChartPointByDistance[];
  track1: GpxTrack | null;
  track2: GpxTrack | null;
}

export function SpeedChart({ data, track1, track2 }: Props) {
  const hasSpeed = track1?.durationSec != null || track2?.durationSec != null;

  const legend = [
    ...(track1 && track1.durationSec != null ? [{ color: TRACK_COLORS.track1, label: track1.fileName }] : []),
    ...(track2 && track2.durationSec != null ? [{ color: TRACK_COLORS.track2, label: track2.fileName, dashed: true }] : []),
  ];

  return (
    <ChartContainer
      title="速度プロファイル（距離）"
      legend={legend}
      disabled={data.length === 0 || !hasSpeed}
      disabledMessage={data.length === 0 ? 'GPXファイルをアップロードしてください' : '時刻データなし（速度計算不可）'}
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="distKm"
            tickFormatter={(v) => `${Number(v).toFixed(1)}`}
            label={{ value: '距離 (km)', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(v) => `${v}`}
            label={{ value: '速度 (km/h)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
                  <p className="text-gray-500 mb-1">距離: <strong>{Number(label).toFixed(2)} km</strong></p>
                  {payload.map((p) => (
                    <p key={p.name} style={{ color: p.stroke as string }} className="font-medium">
                      {p.name}: {Number(p.value).toFixed(1)} km/h
                    </p>
                  ))}
                </div>
              );
            }}
          />
          {track1 && track1.durationSec != null && (
            <Line
              dataKey="speed1"
              name={track1.fileName}
              stroke={TRACK_COLORS.track1}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          )}
          {track2 && track2.durationSec != null && (
            <Line
              dataKey="speed2"
              name={track2.fileName}
              stroke={TRACK_COLORS.track2}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
