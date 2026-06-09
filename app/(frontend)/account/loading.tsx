export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
      <div className="rounded-xl border bg-white p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3">
            <div className="h-5 flex-1 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
