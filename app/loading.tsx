import { GridSkeleton } from "@/components/ui/Skeleton";
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-8 w-48 rounded-xl mb-6 animate-pulse" style={{ background: "var(--card)" }} />
      <GridSkeleton count={8} />
    </div>
  );
}
