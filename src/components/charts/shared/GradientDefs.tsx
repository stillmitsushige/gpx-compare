import type { GradientStop } from '../../../utils/colorScale';

interface Props {
  id: string;
  stops: GradientStop[];
}

export function GradientDefs({ id, stops }: Props) {
  if (stops.length === 0) return null;
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
        {stops.map((stop, i) => (
          <stop key={i} offset={stop.offset} stopColor={stop.color} />
        ))}
      </linearGradient>
    </defs>
  );
}
