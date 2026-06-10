import { getPayload } from "@/lib/payload";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/payload-types";

export const metadata = {
  title: "Produkty",
};

export default async function ProductsPage() {
  const payload = await getPayload();

  const { docs: products } = await payload.find({
    collection: "products",
    where: { isActive: { equals: true } },
    sort: "-createdAt",
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wszystkie produkty</h1>

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
    </div>
  );
}
