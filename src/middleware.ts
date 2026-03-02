import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/dashboard/login')) {
        const session = request.cookies.get('session')?.value
        if (!session) {
            return NextResponse.redirect(new URL('/dashboard/login', request.url))
        }
        try {
            await decrypt(session)
            return NextResponse.next()
        } catch (err) {
            return NextResponse.redirect(new URL('/dashboard/login', request.url))
        }
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
}
