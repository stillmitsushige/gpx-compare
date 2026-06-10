import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import type { GpxTrack } from '../../types/gpx';

interface Props {
  label: string;
  track: GpxTrack | null;
  loading: boolean;
  error: string | null;
  onFile: (file: File) => void;
  onReset: () => void;
  color: string;
}

export function FileUploadZone({ label, track, loading, error, onFile, onReset, color }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }

  const borderColor = dragging ? color : 'border-gray-300';
  const bgColor = dragging ? 'bg-gray-50' : 'bg-white';

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold" style={{ color }}>
          {label}
        </h3>
        {track && (
          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            ✕ 削除
          </button>
        )}
      </div>

      {!track ? (
        <div
          className={`border-2 border-dashed ${borderColor} ${bgColor} rounded-xl p-6 text-center cursor-pointer transition-colors`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".gpx"
            className="hidden"
            onChange={handleChange}
          />
          {loading ? (
            <p className="text-sm text-gray-500">読み込み中...</p>
          ) : (
            <>
              <div className="text-3xl mb-2">📁</div>
              <p className="text-sm text-gray-600">
                GPXファイルをドロップ
              </p>
              <p className="text-xs text-gray-400 mt-1">またはクリックして選択</p>
            </>
          )}
        </div>
      ) : (
        <div className="border rounded-xl p-4 bg-gray-50">
          <p className="text-sm font-medium text-gray-800 truncate">{track.fileName}</p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
            <span>距離: <strong>{track.totalDistKm.toFixed(2)} km</strong></span>
            <span>獲得標高: <strong>{Math.round(track.totalEleGain)} m</strong></span>
            <span>ポイント数: <strong>{track.points.length}</strong></span>
            {track.durationSec !== null && (
              <span>所要時間: <strong>{Math.round(track.durationSec / 60)} 分</strong></span>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
