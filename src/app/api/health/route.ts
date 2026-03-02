import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin.from('surveys').select('id').limit(1)
        if (error) {
            return NextResponse.json({ status: 'error', error: error.message }, { status: 500 })
        }
        return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
    } catch (err: any) {
        return NextResponse.json({ status: 'error', error: err.message }, { status: 500 })
    }
}
