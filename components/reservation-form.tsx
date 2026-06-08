'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { reservationSchema } from '@/lib/validations/reservation.schema'
import { format, addHours } from 'date-fns'

type FormValues = z.input<typeof reservationSchema>

interface ReservationFormProps {
  productId: string
  availableSlots: number
  maxQuantity?: number
}

export function ReservationForm({
  productId,
  availableSlots,
  maxQuantity = 1,
}: ReservationFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const now = new Date()
  const defaultFrom = addHours(now, 1)
  const defaultTo = addHours(now, 2)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      productId,
      quantity: 1,
      reservedFrom: format(defaultFrom, "yyyy-MM-dd'T'HH:mm"),
      reservedTo: format(defaultTo, "yyyy-MM-dd'T'HH:mm"),
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          reservedFrom: new Date(data.reservedFrom).toISOString(),
          reservedTo: new Date(data.reservedTo).toISOString(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Zaloguj się, aby dokonać rezerwacji')
          return
        }
        if (response.status === 409) {
          toast.error(
            `Brak dostępnych slotów. Pozostało: ${result.remainingSlots}`,
          )
          return
        }
        toast.error(result.error || 'Wystąpił błąd')
        return
      }

      toast.success('Rezerwacja złożona pomyślnie!')
      reset()
    } catch {
      toast.error('Błąd połączenia z serwerem')
    } finally {
      setIsLoading(false)
    }
  }

  if (availableSlots === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
        Brak dostępnych terminów
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('productId')} />

      <div className="grid gap-2">
        <Label htmlFor="reservedFrom">Data i godzina rozpoczęcia</Label>
        <Input
          id="reservedFrom"
          type="datetime-local"
          {...register('reservedFrom')}
          min={format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm")}
        />
        {errors.reservedFrom && (
          <p className="text-sm text-red-600">{errors.reservedFrom.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reservedTo">Data i godzina zakończenia</Label>
        <Input
          id="reservedTo"
          type="datetime-local"
          {...register('reservedTo')}
        />
        {errors.reservedTo && (
          <p className="text-sm text-red-600">{errors.reservedTo.message}</p>
        )}
      </div>

      {maxQuantity > 1 && (
        <div className="grid gap-2">
          <Label htmlFor="quantity">
            Ilość (dostępne: {availableSlots})
          </Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={Math.min(maxQuantity, availableSlots)}
            {...register('quantity', { valueAsNumber: true })}
          />
          {errors.quantity && (
            <p className="text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="notes">Uwagi (opcjonalne)</Label>
        <Textarea
          id="notes"
          placeholder="Dodatkowe informacje do rezerwacji..."
          {...register('notes')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Rezerwowanie...' : 'Zarezerwuj'}
      </Button>
    </form>
  )
}
