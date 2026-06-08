import type { Payload, Where } from 'payload'

interface CheckAvailabilityParams {
  payload: Payload
  productId: string
  reservedFrom: string
  reservedTo: string
  quantity: number
  excludeReservationId?: string
}

interface CheckAvailabilityResult {
  available: boolean
  remainingSlots: number
}

export async function checkAvailability({
  payload,
  productId,
  reservedFrom,
  reservedTo,
  quantity,
  excludeReservationId,
}: CheckAvailabilityParams): Promise<CheckAvailabilityResult> {
  const product = await payload.findByID({
    collection: 'products',
    id: productId,
  })

  if (!product || !product.isActive) {
    return { available: false, remainingSlots: 0 }
  }

  const where: Where = {
    and: [
      { product: { equals: productId } },
      { status: { in: ['pending', 'confirmed'] } },
      { reservedFrom: { less_than: reservedTo } },
      { reservedTo: { greater_than: reservedFrom } },
      ...(excludeReservationId
        ? [{ id: { not_equals: excludeReservationId } }]
        : []),
    ],
  }

  const overlapping = await payload.find({
    collection: 'reservations',
    where,
    limit: 0,
  })

  const bookedQuantity = overlapping.docs.reduce(
    (sum, r) => sum + ((r.quantity as number) || 1),
    0,
  )

  const remainingSlots = (product.availableSlots || 0) - bookedQuantity

  return {
    available: remainingSlots >= quantity,
    remainingSlots: Math.max(0, remainingSlots),
  }
}
