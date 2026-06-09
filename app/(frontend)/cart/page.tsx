export const metadata = {
  title: 'Koszyk',
}

export default function CartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Koszyk</h1>
      <p className="text-muted-foreground">
        System rezerwacji nie wymaga koszyka — produkty rezerwujesz bezpośrednio
        ze strony produktu.
      </p>
    </div>
  )
}
