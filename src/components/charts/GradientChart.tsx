import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ChartContainer } from './shared/ChartContainer';
import type { ChartPointByDistance } from '../../types/gpx';
import type { GpxTrack } from '../../types/gpx';
import { gradientToColor } from '../../utils/colorScale';
import { TRACK_COLORS } from '../../constants/chartConfig';

interface Props {
  data: ChartPointByDistance[];
  track1: GpxTrack | null;
  track2: GpxTrack | null;
}

export function GradientChart({ data, track1, track2 }: Props) {
  const legend = [
    ...(track1 ? [{ color: TRACK_COLORS.track1, label: track1.fileName }] : []),
    ...(track2 ? [{ color: TRACK_COLORS.track2, label: track2.fileName, dashed: true }] : []),
  ];

  return (
    <ChartContainer
      title="勾配プロファイル"
      legend={legend}
      disabled={data.length === 0}
      disabledMessage="GPXファイルをアップロードしてください"
    >
      {track1 && (
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">{track1.fileName}</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 10 }} barCategoryGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="distKm" hide />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} width={35} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const val = payload[0]?.value as number;
                  return (
                    <div className="bg-white border border-gray-200 rounded shadow p-2 text-xs">
                      <p className="text-gray-500">{Number(label).toFixed(2)} km</p>
                      <p style={{ color: gradientToColor(val) }} className="font-medium">
                        勾配: {val?.toFixed(1)}%
                      </p>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Bar dataKey="grad1" name="勾配1" isAnimationActive={false}>
                {data.map((entry, index) => (
                  <Cell
                    key={`c1-${index}`}
                    fill={entry.grad1 != null ? gradientToColor(entry.grad1) : '#e5e7eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {track2 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">{track2.fileName}</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 0, right: 10, bottom: 0, left: 10 }} barCategoryGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="distKm"
                tickFormatter={(v) => `${Number(v).toFixed(1)}`}
                tick={{ fontSize: 10 }}
                label={{ value: '距離 (km)', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
              />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} width={35} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const val = payload[0]?.value as number;
                  return (
                    <div className="bg-white border border-gray-200 rounded shadow p-2 text-xs">
                      <p className="text-gray-500">{Number(label).toFixed(2)} km</p>
                      <p style={{ color: gradientToColor(val) }} className="font-medium">
                        勾配: {val?.toFixed(1)}%
                      </p>
                    </div>
                  );
                }}
              />
              <ReferenceLine y={0} stroke="#9ca3af" />
              <Bar dataKey="grad2" name="勾配2" isAnimationActive={false}>
                {data.map((entry, index) => (
                  <Cell
                    key={`c2-${index}`}
                    fill={entry.grad2 != null ? gradientToColor(entry.grad2) : '#e5e7eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {!track1 && !track2 && (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          GPXファイルをアップロードしてください
        </div>
      )}
    </ChartContainer>
  );
}
