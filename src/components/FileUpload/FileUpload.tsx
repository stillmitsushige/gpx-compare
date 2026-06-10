import { FileUploadZone } from './FileUploadZone';
import type { GpxTrack } from '../../types/gpx';
import { TRACK_COLORS } from '../../constants/chartConfig';

interface Props {
  track1: GpxTrack | null;
  track2: GpxTrack | null;
  loading1: boolean;
  loading2: boolean;
  error1: string | null;
  error2: string | null;
  onFile1: (file: File) => void;
  onFile2: (file: File) => void;
  onReset1: () => void;
  onReset2: () => void;
}

export function FileUpload({
  track1, track2, loading1, loading2, error1, error2,
  onFile1, onFile2, onReset1, onReset2,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-700 mb-4">GPXファイルをアップロード</h2>
      <div className="flex gap-4">
        <FileUploadZone
          label="トラック 1"
          track={track1}
          loading={loading1}
          error={error1}
          onFile={onFile1}
          onReset={onReset1}
          color={TRACK_COLORS.track1}
        />
        <div className="w-px bg-gray-200 self-stretch" />
        <FileUploadZone
          label="トラック 2"
          track={track2}
          loading={loading2}
          error={error2}
          onFile={onFile2}
          onReset={onReset2}
          color={TRACK_COLORS.track2}
        />
      </div>
    </div>
  );
}
