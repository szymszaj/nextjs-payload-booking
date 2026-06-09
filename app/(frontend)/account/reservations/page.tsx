import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { ReservationStatusBadge } from '@/components/reservation-status-badge'
import { formatDate } from '@/lib/utils'
import type { Product } from '@/payload-types'

export const metadata = {
  title: 'Historia rezerwacji',
}

export default async function ReservationsHistoryPage() {
  const payload = await getPayload()
  const cookieStore = await cookies()

  let user = null
  try {
    const auth = await payload.auth({
      headers: new Headers({ cookie: cookieStore.toString() }),
    })
    user = auth.user
  } catch {
    redirect('/login')
  }

  if (!user) redirect('/login')

  const { docs: reservations } = await payload.find({
    collection: 'reservations',
    where: {
      and: [
        { user: { equals: user.id } },
        { status: { in: ['cancelled', 'completed'] } },
      ],
    },
    sort: '-createdAt',
    depth: 2,
    limit: 100,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Historia rezerwacji</h1>

      {reservations.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground">Brak historii rezerwacji</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Produkt</th>
                <th className="px-4 py-3 text-left font-medium">Data od</th>
                <th className="px-4 py-3 text-left font-medium">Data do</th>
                <th className="px-4 py-3 text-left font-medium">Ilość</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Anulowano</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reservations.map((reservation) => {
                const product =
                  typeof reservation.product === 'object'
                    ? (reservation.product as Product)
                    : null
                return (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {product?.title ?? 'Nieznany produkt'}
                    </td>
                    <td className="px-4 py-3">{formatDate(reservation.reservedFrom)}</td>
                    <td className="px-4 py-3">{formatDate(reservation.reservedTo)}</td>
                    <td className="px-4 py-3">{reservation.quantity}</td>
                    <td className="px-4 py-3">
                      <ReservationStatusBadge status={reservation.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {reservation.cancelledAt
                        ? formatDate(reservation.cancelledAt)
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
