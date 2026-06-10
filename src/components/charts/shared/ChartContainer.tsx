import type { ReactNode } from 'react';

interface LegendItem {
  color: string;
  label: string;
  dashed?: boolean;
}

interface Props {
  title: string;
  legend?: LegendItem[];
  children: ReactNode;
  disabled?: boolean;
  disabledMessage?: string;
}

export function ChartContainer({ title, legend, children, disabled, disabledMessage }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {legend && (
          <div className="flex gap-3">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <svg width="20" height="8">
                  <line
                    x1="0" y1="4" x2="20" y2="4"
                    stroke={item.color}
                    strokeWidth="2"
                    strokeDasharray={item.dashed ? '4 3' : undefined}
                  />
                </svg>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {disabled ? (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          {disabledMessage ?? 'データなし'}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
