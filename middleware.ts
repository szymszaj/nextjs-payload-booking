import { NextRequest, NextResponse } from 'next/server'
import { proxy } from './proxy'

export async function middleware(request: NextRequest) {
  const proxyResponse = await proxy(request)
  if (proxyResponse) return proxyResponse
  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*'],
}
