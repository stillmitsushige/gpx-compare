import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './shared/ChartContainer';
import type { ChartPointByDistance } from '../../types/gpx';
import type { GpxTrack } from '../../types/gpx';
import { computeGradientStops } from '../../utils/colorScale';
import { TRACK_COLORS } from '../../constants/chartConfig';

interface Props {
  data: ChartPointByDistance[];
  track1: GpxTrack | null;
  track2: GpxTrack | null;
}

export function ElevationDistanceChart({ data, track1, track2 }: Props) {
  const stops1 = useMemo(() => {
    if (!track1) return [];
    return computeGradientStops(
      track1.points.map(p => p.distKm),
      track1.points.map(p => p.gradientPct),
      track1.totalDistKm
    );
  }, [track1]);

  return (
    <ChartContainer
      title="標高プロファイル（距離）"
      disabled={data.length === 0}
      disabledMessage="GPXファイルをアップロードしてください"
    >
      {/* Track legend */}
      {(track1 || track2) && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {track1 && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ background: TRACK_COLORS.track1 }}
            >
              <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="white" strokeWidth="2" /></svg>
              {track1.fileName.length > 20 ? track1.fileName.slice(0, 19) + '…' : track1.fileName}
            </span>
          )}
          {track2 && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ background: TRACK_COLORS.track2 }}
            >
              <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="white" strokeWidth="2" strokeDasharray="6 4" /></svg>
              {track2.fileName.length > 20 ? track2.fileName.slice(0, 19) + '…' : track2.fileName}
            </span>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 10, right: 80, bottom: 5, left: 10 }}>
          <defs>
            {track1 && stops1.length > 0 && (
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                {stops1.map((s, i) => (
                  <stop key={i} offset={s.offset} stopColor={s.color} />
                ))}
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="distKm"
            tickFormatter={(v) => `${v.toFixed(1)}`}
            label={{ value: '距離 (km)', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(v) => `${v}`}
            label={{ value: '標高差 (m)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
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
                      {p.name}: {Number(p.value).toFixed(0)} m
                    </p>
                  ))}
                </div>
              );
            }}
          />
          {track1 && (
            <Line
              dataKey="ele1"
              name={track1.fileName}
              stroke={stops1.length > 0 ? 'url(#grad1)' : TRACK_COLORS.track1}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          )}
          {track2 && (
            <Line
              dataKey="ele2"
              name={track2.fileName}
              stroke={TRACK_COLORS.track2}
              strokeWidth={3}
              strokeDasharray="10 6"
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <GradientLegend />
    </ChartContainer>
  );
}

function GradientLegend() {
  const items = [
    { color: '#3b82f6', label: '下り' },
    { color: '#22c55e', label: '0–5%' },
    { color: '#eab308', label: '5–10%' },
    { color: '#f97316', label: '10–15%' },
    { color: '#ef4444', label: '≥15% 急登' },
  ];
  return (
    <div className="flex gap-3 justify-center mt-2 flex-wrap">
      {items.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: color }} />
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  );
}
