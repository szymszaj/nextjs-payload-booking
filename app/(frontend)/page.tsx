import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'

export default async function HomePage() {
  const payload = await getPayload()

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { isActive: { equals: true } },
    limit: 8,
    sort: '-createdAt',
  })

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Sklep z rezerwacjami</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Zarezerwuj produkty i usługi online — szybko i wygodnie
        </p>
        <Button asChild size="lg">
          <Link href="/products">Przeglądaj ofertę</Link>
        </Button>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Najnowsze produkty</h2>
          <Button asChild variant="outline">
            <Link href="/products">Zobacz wszystkie</Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Brak dostępnych produktów
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as Product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
