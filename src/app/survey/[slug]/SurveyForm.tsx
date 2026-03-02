'use client'

import React, { useState } from 'react'

export default function SurveyForm({ surveySlug, questions }: { surveySlug: string, questions: any[] }) {
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [successId, setSuccessId] = useState('')
    const [honeypot, setHoneypot] = useState('')

    const handleChange = (key: string, type: string, val: any) => {
        setAnswers(prev => ({
            ...prev,
            [key]: val
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Client side validaton for multi-select
        for (const q of questions) {
            if (q.required && q.type === 'multi-select') {
                const vals = answers[q.key]?.values || []
                if (vals.length === 0) {
                    setError(`שדה חובה חסר: ${q.label}`)
                    return
                }
            }
        }

        setSubmitting(true)

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ surveySlug, answers, honeypot })
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'שגיאה בשליחת הסקר')
            } else {
                setSuccessId(data.submissionId)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (successId) {
        return (
            <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-xl text-center shadow-sm">
                <h2 className="text-2xl font-bold mb-4">תודה רבה!</h2>
                <p className="text-lg">הסקר נשלח בהצלחה והתשובות שלך נקלטו במערכת.</p>
                <p className="text-sm mt-6 text-green-600 bg-green-100 inline-block px-3 py-1 rounded">מספר אסמכתא: {successId}</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200">
            <input
                type="text"
                name="email_confirm"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
            />

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 font-medium">
                    {error}
                </div>
            )}

            {questions.map(q => (
                <div key={q.key} className="space-y-4">
                    <label className="block text-lg font-medium text-slate-800">
                        {q.label} {q.required && <span className="text-red-500 font-bold">*</span>}
                    </label>

                    {q.type === 'single-select' && (
                        <div className="space-y-2">
                            {q.options_json?.map((opt: string) => (
                                <label key={opt} className="flex items-center space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                                    <input
                                        type="radio"
                                        name={q.key}
                                        value={opt}
                                        required={q.required}
                                        checked={answers[q.key]?.value === opt}
                                        onChange={() => handleChange(q.key, q.type, { value: opt })}
                                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {q.type === 'multi-select' && (
                        <div className="space-y-2">
                            {q.options_json?.map((opt: string) => {
                                const isChecked = answers[q.key]?.values?.includes(opt) || false
                                return (
                                    <label key={opt} className="flex items-center space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                                        <input
                                            type="checkbox"
                                            value={opt}
                                            checked={isChecked}
                                            onChange={(e) => {
                                                const currentValues = answers[q.key]?.values || []
                                                let newValues = []
                                                if (e.target.checked) {
                                                    newValues = [...currentValues, opt]
                                                } else {
                                                    newValues = currentValues.filter((v: string) => v !== opt)
                                                }
                                                handleChange(q.key, q.type, { values: newValues })
                                            }}
                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="text-slate-700">{opt}</span>
                                    </label>
                                )
                            })}
                        </div>
                    )}

                    {q.type === 'likert' && (
                        <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <span className="text-sm font-medium text-slate-500 w-16 text-center">כלל לא</span>
                            {q.options_json?.map((opt: number) => (
                                <label key={opt} className="flex flex-col items-center space-y-2 cursor-pointer p-2 rounded-lg hover:bg-slate-200 transition-colors">
                                    <input
                                        type="radio"
                                        name={q.key}
                                        value={opt}
                                        required={q.required}
                                        checked={answers[q.key]?.value === opt}
                                        onChange={() => handleChange(q.key, q.type, { value: opt })}
                                        className="w-6 h-6 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700 font-bold text-lg">{opt}</span>
                                </label>
                            ))}
                            <span className="text-sm font-medium text-slate-500 w-16 text-center">במידה רבה</span>
                        </div>
                    )}

                    {q.type === 'free-text' && (
                        <textarea
                            required={q.required}
                            value={answers[q.key]?.text || ''}
                            onChange={(e) => handleChange(q.key, q.type, { text: e.target.value })}
                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-y min-h-[120px] text-slate-700 bg-slate-50 focus:bg-white"
                            placeholder="הקלד כאן את תשובתך..."
                        />
                    )}
                </div>
            ))}

            <div className="pt-8 border-t border-slate-200">
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all text-lg shadow-sm"
                >
                    {submitting ? 'שולח נתונים...' : 'שליחת סקר'}
                </button>
            </div>
        </form>
    )
}
