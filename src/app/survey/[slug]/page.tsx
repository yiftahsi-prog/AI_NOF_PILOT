import { supabaseAdmin } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import SurveyForm from '@/app/survey/[slug]/SurveyForm'

export const revalidate = 60

export default async function SurveyPage({ params }: { params: { slug: string } }) {
    let { data, error } = await supabaseAdmin
        .from('surveys')
        .select('id, title, slug, questions(id, key, label, type, required, order, options_json)')
        .eq('slug', params.slug)
        .single()


    // If no data comes back (e.g. Supabase isn't hooked up yet), use a fallback mock so the user can see the UI.
    if (error || !data) {
        if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder')) {
            data = {
                id: 'mock-id',
                title: 'סקר שימוש ב-AI בארגון (מצב תצוגה מקומית)',
                slug: params.slug,
                questions: [
                    { id: 'q1', key: 'role', label: 'מה התפקיד העיקרי שלך?', type: 'multi-select', required: true, order: 1, options_json: ["פיתוח תוכנה", "מחקר / אנליזה", "ניהול", "הנדסה (לא תוכנה)", "תפעול / IT / DevOps", "אחר"] },
                    { id: 'q2', key: 'team', label: 'מאיזו מחלקה אתה?', type: 'single-select', required: true, order: 2, options_json: ["1", "2", "3", "4", "5"] },
                    { id: 'q3', key: 'seniority', label: 'רמת ותק מקצועי', type: 'single-select', required: true, order: 3, options_json: ["0–2 שנים", "3–5 שנים", "6–10 שנים", "10+ שנים"] },
                    { id: 'q4', key: 'tools_used_internet', label: 'באילו כלי AI זמינים ברשת האינטרנט אתה משתמש?', type: 'multi-select', required: true, order: 4, options_json: ["ChatGPT", "Claude", "Gemini", "GitHub Copilot", "Midjourney", "DALL-E", "אחר", "לא משתמש"] },
                    { id: 'q5', key: 'tools_used_internal', label: 'באילו כלי AI פנימיים ארגוניים אתה משתמש?', type: 'multi-select', required: true, order: 5, options_json: ["מודל מקומי (LLM on-prem)", "כלי AI ייעודי ארגוני", "אחר", "לא משתמש"] },
                    { id: 'q6', key: 'usage_frequency', label: 'תדירות שימוש בכלי AI', type: 'single-select', required: true, order: 6, options_json: ["מספר פעמים ביום", "פעם ביום", "מספר פעמים בשבוע", "לעיתים רחוקות", "כלל לא"] },
                    { id: 'q7', key: 'use_cases', label: 'לאילו מטרות אתה משתמש ב-AI?', type: 'multi-select', required: true, order: 7, options_json: ["כתיבת קוד", "דיבוג", "כתיבת מסמכים / מיילים", "ניתוח מידע / דאטה", "מחקר / למידה", "הכנת מצגות", "הנדסת מערכת", "סקרי שוק", "אחר"] },
                    { id: 'q8', key: 'use_cases_other', label: 'אם ציינת "אחר" במטרות השימוש, אנא פרט:', type: 'free-text', required: false, order: 8, options_json: null },
                    { id: 'q9', key: 'efficiency_gain', label: 'עד כמה ה-AI משפר את היעילות שלך?', type: 'likert', required: true, order: 9, options_json: [1, 2, 3, 4, 5] },
                    { id: 'q10', key: 'time_saved', label: 'הערכת חיסכון בזמן שבועי הודות ל-AI', type: 'single-select', required: true, order: 10, options_json: ["0 שעות", "0–1 שעות", "1–3 שעות", "3–5 שעות", "5–10 שעות", "10+ שעות"] },
                    { id: 'q11', key: 'data_sensitivity', label: 'איזו רמת רגישות של מידע הוזנה לכלי AI?', type: 'single-select', required: true, order: 11, options_json: ["מידע ציבורי בלבד", "מידע פנימי", "מידע רגיש / מסווג", "לא ידוע / לא בטוח"] },
                    { id: 'q12', key: 'verification_level', label: 'באיזו מידה אתה מאמת את תוצרי ה-AI?', type: 'single-select', required: true, order: 12, options_json: ["תמיד", "לעיתים קרובות", "לעיתים רחוקות", "אף פעם"] },
                    { id: 'q13', key: 'verification_methods', label: 'כיצד אתה מאמת תוצרים?', type: 'multi-select', required: true, order: 13, options_json: ["בדיקה מול מקור נוסף", "הרצה / בדיקת קוד", "ביקורת עמיתים", "תחושת בטן / ניסיון", "שימוש בכלי אימות אוטומטיים", "לא מאמת"] },
                    { id: 'q14', key: 'quality_improvement', label: 'תחושת שיפור איכות התוצר בעקבות שימוש ב-AI', type: 'single-select', required: true, order: 14, options_json: ["איכות התוצרים נמוכה אבל מתקבלת בקלות ומהירות", "איכות התוצר דומה לביצוע ידני - לא משפר את האיכות", "שיפור קטן באיכות התוצרים", "שיפור משמעותי באיכות התוצר"] },
                    { id: 'q15', key: 'risks_encountered', label: 'האם נתקלת בבעיות או סיכונים בשימוש ב-AI?', type: 'multi-select', required: true, order: 15, options_json: ["טעויות מהותיות בתוכן", "קוד שגוי", "חשש לדליפת מידע", "תלות יתר בכלי", "לא נתקלתי בבעיות"] },
                    { id: 'q16', key: 'risk_description', label: 'אם כן – תיאור קצר (אופציונלי)', type: 'free-text', required: false, order: 16, options_json: null },
                    { id: 'q17', key: 'training_needs', label: 'אילו הכשרות או הנחיות היו משפרות את השימוש שלך ב-AI?', type: 'multi-select', required: true, order: 17, options_json: ["קווים מנחים ברורים", "דוגמאות שימוש מאושרות", "הדרכה טכנית", "הדרכת אבטחת מידע", "לא נדרש"] },
                    { id: 'q18', key: 'free_comments', label: 'הערות חופשיות', type: 'free-text', required: false, order: 18, options_json: null },
                    { id: 'q19', key: 'suggested_tool', label: 'יש מודל או כלי מהאינטרנט שעוזר לך בעבודה והיית רוצה להכניס לארגון? (אופציונלי)', type: 'free-text', required: false, order: 19, options_json: null }
                ]
            }
        } else {
            notFound()
        }
    }

    const questions = data.questions.sort((a: any, b: any) => a.order - b.order)

    return (
        <main className="container max-w-3xl py-10 px-4 mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">{data.title}</h1>
            <SurveyForm surveySlug={data.slug} questions={questions} />
            <div className="mt-8 text-center text-sm text-slate-500">
                נבנה באמצעות AI Usage Survey &copy; 2026
            </div>
        </main>
    )
}
