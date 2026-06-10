import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './shared/ChartContainer';
import type { ChartPointByTime } from '../../types/gpx';
import type { GpxTrack } from '../../types/gpx';
import { TRACK_COLORS } from '../../constants/chartConfig';

interface Props {
  data: ChartPointByTime[];
  track1: GpxTrack | null;
  track2: GpxTrack | null;
  hasTimeData: boolean;
}

export function ElevationTimeChart({ data, track1, track2, hasTimeData }: Props) {
  const legend = [
    ...(track1 && track1.durationSec != null ? [{ color: TRACK_COLORS.track1, label: track1.fileName }] : []),
    ...(track2 && track2.durationSec != null ? [{ color: TRACK_COLORS.track2, label: track2.fileName, dashed: true }] : []),
  ];

  return (
    <ChartContainer
      title="標高プロファイル（時間）"
      legend={legend}
      disabled={!hasTimeData || data.length === 0}
      disabledMessage={
        data.length === 0 && !hasTimeData
          ? 'GPXファイルをアップロードしてください'
          : '時刻データなし（標高/時間グラフ無効）'
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="elapsedMin"
            tickFormatter={(v) => `${Number(v).toFixed(0)}`}
            label={{ value: '経過時間 (分)', position: 'insideBottomRight', offset: -5, fontSize: 11 }}
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
              const min = Number(label);
              const h = Math.floor(min / 60);
              const m = Math.floor(min % 60);
              const timeStr = h > 0 ? `${h}時間${m}分` : `${m}分`;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
                  <p className="text-gray-500 mb-1">経過: <strong>{timeStr}</strong></p>
                  {payload.map((p) => (
                    <p key={p.name} style={{ color: p.stroke as string }} className="font-medium">
                      {p.name}: {Number(p.value).toFixed(0)} m
                    </p>
                  ))}
                </div>
              );
            }}
          />
          {track1 && track1.durationSec != null && (
            <Line
              dataKey="ele1"
              name={track1.fileName}
              stroke={TRACK_COLORS.track1}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          )}
          {track2 && track2.durationSec != null && (
            <Line
              dataKey="ele2"
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
