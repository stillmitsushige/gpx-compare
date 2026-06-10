import type { GpxPoint } from '../types/gpx';

export function parseGpx(xmlText: string): GpxPoint[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid GPX file');
  }

  const trkpts = doc.querySelectorAll('trkpt');
  const points: GpxPoint[] = [];

  trkpts.forEach((pt) => {
    const lat = parseFloat(pt.getAttribute('lat') ?? '');
    const lon = parseFloat(pt.getAttribute('lon') ?? '');
    const eleEl = pt.querySelector('ele');
    const timeEl = pt.querySelector('time');

    if (isNaN(lat) || isNaN(lon)) return;

    const ele = eleEl ? parseFloat(eleEl.textContent ?? '0') : 0;
    const time = timeEl?.textContent ? new Date(timeEl.textContent) : null;

    points.push({ lat, lon, ele, time });
  });

  return points;
}
