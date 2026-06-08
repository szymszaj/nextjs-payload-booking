import Link from 'next/link'
import { cookies } from 'next/headers'
import { getPayload } from '@/lib/payload'
import { Button } from '@/components/ui/button'

export async function Navbar() {
  const payload = await getPayload()
  const cookieStore = await cookies()

  let user = null
  try {
    const authResult = await payload.auth({
      headers: new Headers({ cookie: cookieStore.toString() }),
    })
    user = authResult.user
  } catch {
    // not authenticated
  }

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          Sklep Rezerwacji
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/products" className="text-sm hover:text-primary">
            Produkty
          </Link>

          {user ? (
            <>
              <Link href="/account" className="text-sm hover:text-primary">
                Moje rezerwacje
              </Link>
              <form action="/api/auth/logout" method="POST">
                <Button variant="outline" size="sm" type="submit">
                  Wyloguj
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Zaloguj się</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Zarejestruj się</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
