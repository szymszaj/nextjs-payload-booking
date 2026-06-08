import { z } from 'zod'

export const reservationSchema = z
  .object({
    productId: z.string().min(1, 'Produkt jest wymagany'),
    reservedFrom: z.string().min(1, 'Data rozpoczęcia jest wymagana'),
    reservedTo: z.string().min(1, 'Data zakończenia jest wymagana'),
    quantity: z.number().int().min(1, 'Minimalna ilość to 1').default(1),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const from = new Date(data.reservedFrom)
      const to = new Date(data.reservedTo)
      return to > from
    },
    {
      message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
      path: ['reservedTo'],
    },
  )
  .refine(
    (data) => {
      const from = new Date(data.reservedFrom)
      return from > new Date()
    },
    {
      message: 'Data rezerwacji musi być w przyszłości',
      path: ['reservedFrom'],
    },
  )

export type ReservationFormData = z.infer<typeof reservationSchema>
