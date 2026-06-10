import { useState, useCallback } from 'react';
import type { GpxTrack } from '../types/gpx';
import { parseGpx } from '../utils/gpxParser';
import { computeTrack } from '../utils/metrics';

interface UseGpxFileState {
  track: GpxTrack | null;
  loading: boolean;
  error: string | null;
}

export function useGpxFile() {
  const [state, setState] = useState<UseGpxFileState>({
    track: null,
    loading: false,
    error: null,
  });

  const loadFile = useCallback((file: File) => {
    setState({ track: null, loading: true, error: null });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const points = parseGpx(text);
        if (points.length === 0) {
          setState({ track: null, loading: false, error: 'GPXファイルにトラックポイントがありません' });
          return;
        }
        const track = computeTrack(file.name, points);
        setState({ track, loading: false, error: null });
      } catch (err) {
        setState({
          track: null,
          loading: false,
          error: err instanceof Error ? err.message : 'GPXファイルの読み込みに失敗しました',
        });
      }
    };
    reader.onerror = () => {
      setState({ track: null, loading: false, error: 'ファイルの読み込みに失敗しました' });
    };
    reader.readAsText(file);
  }, []);

  const reset = useCallback(() => {
    setState({ track: null, loading: false, error: null });
  }, []);

  return { ...state, loadFile, reset };
}
