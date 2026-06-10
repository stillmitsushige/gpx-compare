interface Payload {
  name?: string;
  value?: number | string;
  stroke?: string;
  fill?: string;
}

interface Props {
  active?: boolean;
  payload?: Payload[];
  label?: number | string;
  xLabel: string;
  xUnit: string;
  xDecimals?: number;
}

export function CustomTooltip({ active, payload, label, xLabel, xUnit, xDecimals = 2 }: Props) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="text-gray-500 mb-2">
        {xLabel}: <strong>{typeof label === 'number' ? label.toFixed(xDecimals) : label} {xUnit}</strong>
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.stroke ?? p.fill }} className="font-medium">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
}
