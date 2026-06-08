import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

const protectedPaths = ['/account']

export async function proxy(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))
  if (!isProtected) return null

  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return null
}
