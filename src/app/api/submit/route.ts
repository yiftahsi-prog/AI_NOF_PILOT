import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabaseServer'
import crypto from 'crypto'

function hashIp(ip: string, salt: string) {
    return crypto.createHash('sha256').update(ip + salt).digest('hex')
}

export async function POST(req: Request) {
    try {
        const body = await req.json()

        if (body.honeypot) {
            return NextResponse.json({ success: false, error: 'Spam detected' }, { status: 400 })
        }

        const surveySlug = body.surveySlug || 'ai-usage-2026'

        const { data: surveyData, error: surveyError } = await supabaseAdmin
            .from('surveys')
            .select('id, questions(id, key, type, required)')
            .eq('slug', surveySlug)
            .single()

        if (surveyError || !surveyData) {
            return NextResponse.json({ success: false, error: 'Survey not found' }, { status: 404 })
        }

        const surveyId = surveyData.id
        const questions = surveyData.questions

        const answersToInsert = []
        const answersPayload = body.answers || {}

        for (const q of questions) {
            const ans = answersPayload[q.key]

            if (q.required) {
                if (!ans) {
                    return NextResponse.json({ success: false, error: `Missing required field: ${q.key}` }, { status: 400 })
                }
                if (q.type === 'multi-select' && (!ans.values || ans.values.length === 0)) {
                    return NextResponse.json({ success: false, error: `Field ${q.key} cannot be empty` }, { status: 400 })
                }
                if (q.type === 'single-select' && !ans.value) {
                    return NextResponse.json({ success: false, error: `Field ${q.key} is required` }, { status: 400 })
                }
                if (q.type === 'likert' && !ans.value) {
                    return NextResponse.json({ success: false, error: `Field ${q.key} is required` }, { status: 400 })
                }
                if (q.type === 'free-text' && !ans.text) {
                    return NextResponse.json({ success: false, error: `Field ${q.key} is required` }, { status: 400 })
                }
            }

            if (ans) {
                answersToInsert.push({
                    question_id: q.id,
                    value_json: ans
                })
            }
        }

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
        const userAgent = req.headers.get('user-agent') || ''

        let ipHash = null
        if (ip !== 'unknown' && process.env.IP_HASH_SALT) {
            ipHash = hashIp(ip, process.env.IP_HASH_SALT)
        }

        const { data: subData, error: subError } = await supabaseAdmin
            .from('submissions')
            .insert({
                survey_id: surveyId,
                user_agent: userAgent,
                ip_hash: ipHash
            })
            .select('id')
            .single()

        if (subError) {
            return NextResponse.json({ success: false, error: subError.message }, { status: 500 })
        }

        const submissionId = subData.id

        const finalAnswers = answersToInsert.map(a => ({
            ...a,
            submission_id: submissionId
        }))

        const { error: ansError } = await supabaseAdmin
            .from('answers')
            .insert(finalAnswers)

        if (ansError) {
            await supabaseAdmin.from('submissions').delete().eq('id', submissionId)
            return NextResponse.json({ success: false, error: ansError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, submissionId })
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}
