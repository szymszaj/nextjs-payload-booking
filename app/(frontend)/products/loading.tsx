export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-gray-200" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border bg-white p-4 space-y-4"
          >
            <div className="aspect-video rounded-lg bg-gray-200" />
            <div className="h-5 rounded bg-gray-200" />
            <div className="h-7 w-24 rounded bg-gray-200" />
            <div className="h-9 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
