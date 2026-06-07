import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
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

    const reservation = await payload.findByID({
      collection: 'reservations',
      id,
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Rezerwacja nie znaleziona' },
        { status: 404 },
      )
    }

    const reservationUserId =
      typeof reservation.user === 'object'
        ? reservation.user.id
        : reservation.user

    const isOwner = reservationUserId === user.id
    const isAdmin = user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    if (!['pending', 'confirmed'].includes(reservation.status)) {
      return NextResponse.json(
        { error: 'Nie można anulować tej rezerwacji' },
        { status: 400 },
      )
    }

    const updated = await payload.update({
      collection: 'reservations',
      id,
      data: {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
      },
    })

    revalidatePath('/account')
    revalidatePath('/account/reservations')

    return NextResponse.json({ success: true, reservation: updated })
  } catch (error) {
    console.error('Błąd anulowania rezerwacji:', error)
    return NextResponse.json(
      { error: 'Wewnętrzny błąd serwera' },
      { status: 500 },
    )
  }
}
