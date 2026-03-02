import { supabaseAdmin } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const { data, error } = await supabaseAdmin.from('questions').select('key, label, type, required, options_json').order('order')
    return NextResponse.json({ data, error })
}
