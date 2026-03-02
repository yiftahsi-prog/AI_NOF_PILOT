import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    if (ip !== 'unknown') {
        const { data: attemptData } = await supabaseAdmin.from('auth_attempts').select('*').eq('ip', ip).single()

        if (attemptData) {
            const minDiff = (new Date().getTime() - new Date(attemptData.last_attempt).getTime()) / 60000
            if (attemptData.attempts >= 10 && minDiff < 10) {
                return NextResponse.json({ error: 'יותר מדי ניסיונות. אנא המתן 10 דקות.' }, { status: 429 })
            }
            if (minDiff >= 10) {
                await supabaseAdmin.from('auth_attempts').update({ attempts: 0, last_attempt: new Date().toISOString() }).eq('ip', ip)
            }
        }
    }

    const validPassword = process.env.DASHBOARD_PASSWORD || '1234'

    if (body.password === validPassword) {
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const session = await encrypt({ user: 'admin', expires })

        cookies().set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' })

        if (ip !== 'unknown') {
            await supabaseAdmin.from('auth_attempts').delete().eq('ip', ip)
        }

        return NextResponse.json({ success: true })
    } else {
        if (ip !== 'unknown') {
            const { data: attemptData } = await supabaseAdmin.from('auth_attempts').select('*').eq('ip', ip).single()
            if (attemptData) {
                await supabaseAdmin.from('auth_attempts').update({ attempts: attemptData.attempts + 1, last_attempt: new Date().toISOString() }).eq('ip', ip)
            } else {
                await supabaseAdmin.from('auth_attempts').insert({ ip, attempts: 1, last_attempt: new Date().toISOString() })
            }
        }
        return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
    }
}
