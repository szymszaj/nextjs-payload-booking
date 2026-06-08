'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function CancelReservationButton({ reservationId }: { reservationId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm('Czy na pewno chcesz anulować tę rezerwację?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Błąd anulowania rezerwacji')
        return
      }

      toast.success('Rezerwacja anulowana')
      router.refresh()
    } catch {
      toast.error('Błąd połączenia z serwerem')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleCancel}
      disabled={isLoading}
    >
      {isLoading ? 'Anulowanie...' : 'Anuluj'}
    </Button>
  )
}
