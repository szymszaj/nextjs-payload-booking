import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayload } from '@/lib/payload'
import { ReservationForm } from '@/components/reservation-form'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Media } from '@/payload-types'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const product = docs[0]
  if (!product) return {}
  return {
    title: product.meta?.title || product.title,
    description: product.meta?.description || '',
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
      isActive: { equals: true },
    },
    limit: 1,
  })

  const product = docs[0]
  if (!product) notFound()

  const firstImage =
    product.images && product.images.length > 0
      ? (product.images[0].image as Media | null)
      : null

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        {firstImage && typeof firstImage === 'object' && firstImage.url ? (
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image
              src={firstImage.url}
              alt={firstImage.alt || product.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100 text-gray-400">
            Brak zdjęcia
          </div>
        )}

        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.slice(1).map((item: { image: unknown; id?: string | null }, i: number) => {
              const img = item.image as Media | null
              if (!img || typeof img !== 'object' || !img.url) return null
              return (
                <div
                  key={i}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || ''}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="mt-2 text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={product.availableSlots > 0 ? 'success' : 'destructive'}>
            {product.availableSlots > 0
              ? `${product.availableSlots} wolnych terminów`
              : 'Brak dostępności'}
          </Badge>
          {product.reservationDuration && (
            <Badge variant="outline">
              Czas: {product.reservationDuration} min
            </Badge>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Zarezerwuj</h2>
          <ReservationForm
            productId={String(product.id)}
            availableSlots={product.availableSlots || 0}
            maxQuantity={product.availableSlots || 1}
          />
        </div>
      </div>
    </div>
  )
}
