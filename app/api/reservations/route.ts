import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { checkAvailability } from '@/lib/checkAvailability'
import { reservationSchema } from '@/lib/validations/reservation.schema'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload()
    const cookieStore = await cookies()

    const { user } = await payload.auth({
      headers: new Headers({
        cookie: cookieStore.toString(),
      }),
    })

    if (!user) {
      return NextResponse.json({ error: 'Nieautoryzowany' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = reservationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { productId, reservedFrom, reservedTo, quantity, notes } = parsed.data

    const availability = await checkAvailability({
      payload,
      productId,
      reservedFrom,
      reservedTo,
      quantity,
    })

    if (!availability.available) {
      return NextResponse.json(
        {
          error: 'Brak dostępnych slotów',
          remainingSlots: availability.remainingSlots,
        },
        { status: 409 },
      )
    }

    const reservation = await payload.create({
      collection: 'reservations',
      data: {
        user: user.id,
        product: productId,
        status: 'pending',
        reservedFrom,
        reservedTo,
        quantity,
        notes,
      },
    })

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })
    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        availableSlots: (product.availableSlots || 0) - quantity,
      },
    })

    revalidatePath('/products')
    revalidatePath(`/products/${productId}`)
    revalidatePath('/account')

    return NextResponse.json({ success: true, reservation }, { status: 201 })
  } catch (error) {
    console.error('Błąd tworzenia rezerwacji:', error)
    const message =
      error instanceof Error ? error.message : 'Wewnętrzny błąd serwera'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
