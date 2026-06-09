export default function Loading() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="aspect-video animate-pulse rounded-xl bg-gray-200" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  )
}
