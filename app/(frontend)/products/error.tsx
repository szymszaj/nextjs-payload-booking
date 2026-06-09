'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Błąd ładowania produktów</h2>
      <button onClick={reset} className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
        Spróbuj ponownie
      </button>
    </div>
  )
}
