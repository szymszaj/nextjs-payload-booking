import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/payload-types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage =
    product.images && product.images.length > 0 ? product.images[0] : null
  const imageUrl =
    firstImage &&
    typeof firstImage.image === 'object' &&
    firstImage.image !== null
      ? (firstImage.image as { url?: string }).url
      : null

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Brak zdjęcia
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <p className="text-2xl font-bold text-primary">
          {formatPrice(product.price)}
        </p>
        <div className="flex items-center gap-2">
          <Badge
            variant={product.availableSlots > 0 ? 'success' : 'destructive'}
          >
            {product.availableSlots > 0
              ? `${product.availableSlots} dostępnych`
              : 'Niedostępny'}
          </Badge>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/products/${product.slug}`}>Zobacz szczegóły</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
