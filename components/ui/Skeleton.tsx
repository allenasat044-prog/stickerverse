export function StickerSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div style={{ height: 180, background: "var(--border)" }} />
      <div className="p-3 space-y-2">
        <div className="h-4 rounded-lg w-3/4" style={{ background: "var(--border)" }} />
        <div className="h-3 rounded-lg w-1/2" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => <StickerSkeleton key={i} />)}
    </div>
  );
}
