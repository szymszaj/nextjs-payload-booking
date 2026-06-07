import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import { checkAvailability } from '@/lib/checkAvailability'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const productId = searchParams.get('productId')

    if (!date || !productId) {
      return NextResponse.json(
        { error: 'Wymagane parametry: date, productId' },
        { status: 400 },
      )
    }

    const payload = await getPayload()

    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const result = await checkAvailability({
      payload,
      productId,
      reservedFrom: dayStart.toISOString(),
      reservedTo: dayEnd.toISOString(),
      quantity: 1,
    })

    return NextResponse.json({ remainingSlots: result.remainingSlots })
  } catch (error) {
    console.error('Błąd sprawdzania dostępności:', error)
    return NextResponse.json(
      { error: 'Wewnętrzny błąd serwera' },
      { status: 500 },
    )
  }
}
