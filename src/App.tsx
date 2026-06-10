import { Header } from './components/layout/Header';
import { FileUpload } from './components/FileUpload/FileUpload';
import { ChartGrid } from './components/layout/ChartGrid';
import { useGpxFile } from './hooks/useGpxFile';
import { useGpxMetrics } from './hooks/useGpxMetrics';

export default function App() {
  const gpx1 = useGpxFile();
  const gpx2 = useGpxFile();
  const { byDistance } = useGpxMetrics(gpx1.track, gpx2.track);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        <FileUpload
          track1={gpx1.track}
          track2={gpx2.track}
          loading1={gpx1.loading}
          loading2={gpx2.loading}
          error1={gpx1.error}
          error2={gpx2.error}
          onFile1={gpx1.loadFile}
          onFile2={gpx2.loadFile}
          onReset1={gpx1.reset}
          onReset2={gpx2.reset}
        />
        <ChartGrid
          track1={gpx1.track}
          track2={gpx2.track}
          byDistance={byDistance}
        />
      </main>
    </div>
  );
}
