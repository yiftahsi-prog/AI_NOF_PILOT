import { supabaseAdmin } from '@/lib/supabaseServer'
import DashboardClient from '@/app/dashboard/DashboardClient'


export const revalidate = 0

export default async function DashboardPage() {
    let { data: rawData, error } = await supabaseAdmin
        .from('v_answers_keyed')
        .select('*')


    if (error || !rawData) {
        if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
            rawData = [
                { submission_id: 'sub1', submitted_at: new Date().toISOString(), question_key: 'role', value_json: { value: 'פיתוח תוכנה' } },
                { submission_id: 'sub1', submitted_at: new Date().toISOString(), question_key: 'seniority', value_json: { value: '3–5 שנים' } },
                { submission_id: 'sub1', submitted_at: new Date().toISOString(), question_key: 'tools_used', value_json: { values: ['ChatGPT', 'Claude'] } },
                { submission_id: 'sub2', submitted_at: new Date().toISOString(), question_key: 'role', value_json: { value: 'ניהול' } },
                { submission_id: 'sub2', submitted_at: new Date().toISOString(), question_key: 'verification_level', value_json: { value: 'תמיד' } },
                { submission_id: 'sub2', submitted_at: new Date().toISOString(), question_key: 'free_comments', value_json: { text: 'זוהי מערכת הדגמה מקומית. הנתונים יוזנו מהמסד כאשר יחובר.' } }
            ]
        } else {
            return (
                <main className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-8 border border-red-200">
                    שגיאה בטעינת הנתונים: {error?.message}
                </main>
            )
        }
    }

    const submissions = {} as Record<string, any>
    const roles = {} as Record<string, number>
    const seniorities = {} as Record<string, number>
    const teams = {} as Record<string, number>
    const toolsInternet = {} as Record<string, number>
    const toolsInternal = {} as Record<string, number>
    const useCases = {} as Record<string, number>
    const verificationLevels = {} as Record<string, number>
    const verificationMethods = {} as Record<string, number>
    const dataSensitivity = {} as Record<string, number>
    const trainingNeeds = {} as Record<string, number>
    const timeSavedDist = {} as Record<string, number>
    const qualityImprovement = {} as Record<string, number>
    const freeComments: any[] = []
    const suggestedTools: any[] = []

    let totalTimeSavedHrs = 0

    let last24h = 0
    let last7d = 0
    const now = new Date()

    for (const row of rawData) {
        if (!submissions[row.submission_id]) {
            submissions[row.submission_id] = {
                submitted_at: new Date(row.submitted_at),
                usesInternet: false,
                usesInternal: false
            }

            const diffHours = (now.getTime() - submissions[row.submission_id].submitted_at.getTime()) / (1000 * 3600)
            if (diffHours <= 24) last24h++
            if (diffHours <= 24 * 7) last7d++
        }

        const val = row.value_json
        const key = row.question_key

        if (key === 'role' && val?.values) {
            for (const v of val.values) roles[v] = (roles[v] || 0) + 1
        }
        if (key === 'seniority' && val?.value) { seniorities[val.value] = (seniorities[val.value] || 0) + 1 }
        if (key === 'team' && val?.value) { teams[val.value] = (teams[val.value] || 0) + 1 }
        if (key === 'verification_level' && val?.value) { verificationLevels[val.value] = (verificationLevels[val.value] || 0) + 1 }
        if (key === 'data_sensitivity' && val?.value) { dataSensitivity[val.value] = (dataSensitivity[val.value] || 0) + 1 }
        if (key === 'quality_improvement' && val?.value) { qualityImprovement[val.value] = (qualityImprovement[val.value] || 0) + 1 }

        // Time saved parse logic
        if (key === 'time_saved' && val?.value) {
            timeSavedDist[val.value] = (timeSavedDist[val.value] || 0) + 1
            if (val.value === '0 שעות') totalTimeSavedHrs += 0
            if (val.value === '0–1 שעות') totalTimeSavedHrs += 0.5
            if (val.value === '1–3 שעות') totalTimeSavedHrs += 2
            if (val.value === '3–5 שעות') totalTimeSavedHrs += 4
            if (val.value === '5–10 שעות') totalTimeSavedHrs += 7.5
            if (val.value === '10+ שעות') totalTimeSavedHrs += 12
        }

        if (key === 'tools_used_internet' && val?.values) {
            for (const v of val.values) {
                toolsInternet[v] = (toolsInternet[v] || 0) + 1
                if (v !== 'לא משתמש') submissions[row.submission_id].usesInternet = true
            }
        }
        if (key === 'tools_used_internal' && val?.values) {
            for (const v of val.values) {
                toolsInternal[v] = (toolsInternal[v] || 0) + 1
                if (v !== 'לא משתמש') submissions[row.submission_id].usesInternal = true
            }
        }
        if (key === 'use_cases' && val?.values) {
            for (const v of val.values) useCases[v] = (useCases[v] || 0) + 1
        }
        if (key === 'verification_methods' && val?.values) {
            for (const v of val.values) verificationMethods[v] = (verificationMethods[v] || 0) + 1
        }
        if (key === 'training_needs' && val?.values) {
            for (const v of val.values) trainingNeeds[v] = (trainingNeeds[v] || 0) + 1
        }

        if (key === 'free_comments' && val?.text) {
            freeComments.push({ text: val.text, date: row.submitted_at })
        }
        if (key === 'use_cases_other' && val?.text) {
            freeComments.push({ text: `מטרת שימוש אחרת: ${val.text}`, date: row.submitted_at })
        }
        if (key === 'suggested_tool' && val?.text) {
            suggestedTools.push({ text: val.text, date: row.submitted_at })
        }
    }

    let totalInternetUsers = 0
    let totalInternalUsers = 0
    Object.values(submissions).forEach(s => {
        if (s.usesInternet) totalInternetUsers++
        if (s.usesInternal) totalInternalUsers++
    })

    const timeSeriesMap: Record<string, number> = {}
    Object.values(submissions).forEach(s => {
        const dateStr = s.submitted_at.toISOString().split('T')[0]
        timeSeriesMap[dateStr] = (timeSeriesMap[dateStr] || 0) + 1
    })
    const timeSeries = Object.entries(timeSeriesMap).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date))

    const toChartData = (obj: Record<string, number>) => Object.entries(obj).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

    const dto = {
        total: Object.keys(submissions).length,
        last24h,
        last7d,
        timeSeries,
        totalTimeSavedHrs,
        totalInternetUsers,
        totalInternalUsers,
        timeSavedDist: toChartData(timeSavedDist),
        roles: toChartData(roles),
        seniorities: toChartData(seniorities),
        teams: toChartData(teams),
        toolsInternet: toChartData(toolsInternet),
        toolsInternal: toChartData(toolsInternal),
        useCases: toChartData(useCases),
        verificationLevels: toChartData(verificationLevels),
        verificationMethods: toChartData(verificationMethods),
        dataSensitivity: toChartData(dataSensitivity),
        trainingNeeds: toChartData(trainingNeeds),
        qualityImprovement: toChartData(qualityImprovement),
        freeComments: freeComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50),
        suggestedTools: suggestedTools.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50),
    }

    return (
        <main className="p-4 md:p-8 bg-slate-50 min-h-screen" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">NOF AI PILOT</h1>
                    <div className="text-sm text-slate-500">עודכן הרגע</div>
                </header>
                <DashboardClient data={dto} />
            </div>
        </main>
    )
}
