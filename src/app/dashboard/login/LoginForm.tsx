'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })
            if (res.ok) {
                router.push('/dashboard')
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || 'Login failed')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-6 max-w-md mx-auto mt-32" dir="rtl">
            <h1 className="text-3xl font-bold text-center text-slate-800">
                כניסה למערכת
            </h1>
            <p className="text-center text-slate-500 mb-6 font-medium">הזן את סיסמת הניהול כדי לצפות בנתונים</p>

            {error && <div className="text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 font-medium">{error}</div>}

            <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">סיסמה</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-slate-50 focus:bg-white"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 text-lg shadow-sm"
            >
                {loading ? 'מתחבר...' : 'התחבר'}
            </button>
        </form>
    )
}
