import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { ReservationStatusBadge } from '@/components/reservation-status-badge'
import { CancelReservationButton } from '@/components/cancel-reservation-button'
import { formatDate, formatPrice } from '@/lib/utils'
import type { Product } from '@/payload-types'

export const metadata = {
  title: 'Moje rezerwacje',
}

export default async function AccountPage() {
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
    where: { user: { equals: user.id } },
    sort: '-createdAt',
    depth: 2,
    limit: 50,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Moje rezerwacje</h1>
        <p className="text-muted-foreground">
          Witaj, {user.firstName || user.email}
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground">Nie masz jeszcze żadnych rezerwacji</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Produkt</th>
                <th className="px-4 py-3 text-left font-medium">Cena</th>
                <th className="px-4 py-3 text-left font-medium">Data od</th>
                <th className="px-4 py-3 text-left font-medium">Data do</th>
                <th className="px-4 py-3 text-left font-medium">Ilość</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Akcja</th>
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
                    <td className="px-4 py-3 text-muted-foreground">
                      {product ? formatPrice(product.price) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(reservation.reservedFrom)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(reservation.reservedTo)}
                    </td>
                    <td className="px-4 py-3">{reservation.quantity}</td>
                    <td className="px-4 py-3">
                      <ReservationStatusBadge status={reservation.status} />
                    </td>
                    <td className="px-4 py-3">
                      {['pending', 'confirmed'].includes(reservation.status) && (
                        <CancelReservationButton reservationId={String(reservation.id)} />
                      )}
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
