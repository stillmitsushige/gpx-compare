import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
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

export function CumulativeGainChart({ data, track1, track2 }: Props) {
  const finalGain1 = track1 ? Math.round(track1.totalEleGain) : null;
  const finalGain2 = track2 ? Math.round(track2.totalEleGain) : null;

  return (
    <ChartContainer
      title="累積獲得標高（距離）"
      disabled={data.length === 0}
      disabledMessage="GPXファイルをアップロードしてください"
    >
      {(track1 || track2) && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {track1 && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ background: TRACK_COLORS.track1 }}
            >
              <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="white" strokeWidth="2" /></svg>
              {track1.fileName.length > 20 ? track1.fileName.slice(0, 19) + '…' : track1.fileName}
              {finalGain1 !== null && <span className="opacity-80">（+{finalGain1} m）</span>}
            </span>
          )}
          {track2 && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ background: TRACK_COLORS.track2 }}
            >
              <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="white" strokeWidth="2" strokeDasharray="4 3" /></svg>
              {track2.fileName.length > 20 ? track2.fileName.slice(0, 19) + '…' : track2.fileName}
              {finalGain2 !== null && <span className="opacity-80">（+{finalGain2} m）</span>}
            </span>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 10, right: 80, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="distKm"
            tickFormatter={(v) => `${Number(v).toFixed(1)}`}
            label={{ value: '距離 (km)', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(v) => `${v}`}
            label={{ value: '累積獲得標高 (m)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
            tick={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="#9ca3af" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
                  <p className="text-gray-500 mb-1">距離: <strong>{Number(label).toFixed(2)} km</strong></p>
                  {payload.map((p) => (
                    <p key={p.name} style={{ color: p.stroke as string }} className="font-medium">
                      {p.name}: +{Number(p.value).toFixed(0)} m
                    </p>
                  ))}
                </div>
              );
            }}
          />
          {track1 && (
            <Line
              dataKey="cumGain1"
              name={track1.fileName}
              stroke={TRACK_COLORS.track1}
              strokeWidth={2.5}
              dot={false}
              connectNulls
            />
          )}
          {track2 && (
            <Line
              dataKey="cumGain2"
              name={track2.fileName}
              stroke={TRACK_COLORS.track2}
              strokeWidth={2.5}
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
