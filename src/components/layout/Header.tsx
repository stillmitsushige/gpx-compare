export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <span className="text-2xl">🗻</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">GPX比較ツール</h1>
          <p className="text-xs text-gray-500">標高・勾配・速度を比較して急登箇所を可視化</p>
        </div>
      </div>
    </header>
  );
}
