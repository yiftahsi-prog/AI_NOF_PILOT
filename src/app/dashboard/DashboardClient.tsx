'use client'
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts'

// Original Soft Palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']

export default function DashboardClient({ data }: { data: any }) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
                    <p className="font-bold text-slate-800 mb-1">{label || payload[0].name}</p>
                    <p className="text-blue-600 font-bold">{payload[0].value} משיבים</p>
                </div>
            )
        }
        return null
    }

    const StatCard = ({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) => (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col justify-center items-center h-full text-white">
            <h3 className="text-slate-300 text-xs font-bold mb-2 uppercase tracking-wider text-center line-clamp-2">{title}</h3>
            <div className="text-4xl font-black text-amber-400">{value}</div>
            {subtitle && <div className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</div>}
        </div>
    )

    const ComparisonCard = ({ title, val1, label1, val2, label2 }: any) => (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col justify-center items-center h-full text-white">
            <h3 className="text-slate-300 text-xs font-bold mb-4 uppercase tracking-wider text-center">{title}</h3>
            <div className="w-full flex justify-between items-center px-4">
                <div className="flex flex-col items-center">
                    <div className="text-3xl font-black text-blue-400">{val1}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{label1}</div>
                </div>
                <div className="h-8 w-px bg-slate-600 mx-2"></div>
                <div className="flex flex-col items-center">
                    <div className="text-3xl font-black text-emerald-400">{val2}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{label2}</div>
                </div>
            </div>
        </div>
    )

    const AreaFillChart = ({ chartData, title }: { chartData: any[], title: string }) => (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col justify-between">
            <h3 className="text-slate-800 font-bold mb-2 text-sm border-b pb-2">{title}</h3>
            <div className="flex-1 w-full h-full relative min-h-[180px]">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Area type="monotone" name="כמות משיבים ביום" dataKey="count" stroke="#0088FE" fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )

    const SimpleBarChart = ({ chartData, title, hideY = false }: { chartData: any[], title: string, hideY?: boolean }) => (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full justify-between">
            <h3 className="text-slate-800 font-bold mb-2 text-sm border-b pb-2 line-clamp-1">{title}</h3>
            <div className="flex-1 w-full h-full relative min-h-[180px]">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: hideY ? -20 : -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} hide />
                            {!hideY && <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={() => (
                                <ul className="flex flex-wrap justify-center gap-2 mt-4 dir-rtl">
                                    {chartData.map((entry, index) => (
                                        <li key={`item-${index}`} className="flex items-center text-[10px] text-slate-500">
                                            <span className="w-2.5 h-2.5 rounded-full ml-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                            {entry.name}
                                        </li>
                                    ))}
                                </ul>
                            )} />
                            <Bar dataKey="value" name="משיבים" radius={[4, 4, 0, 0]} barSize={24}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )

    const SimplePieChart = ({ chartData, title }: { chartData: any[], title: string }) => (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full justify-between overflow-hidden">
            <h3 className="text-slate-800 font-bold mb-2 text-sm border-b pb-2 line-clamp-1">{title}</h3>
            <div className="flex-1 w-full h-full relative min-h-[180px]">
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" labelLine={false}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={() => (
                                <ul className="flex flex-wrap justify-center gap-2 mt-4 dir-rtl">
                                    {chartData.map((entry, index) => (
                                        <li key={`item-${index}`} className="flex items-center text-[10px] text-slate-500">
                                            <span className="w-2.5 h-2.5 rounded-full ml-1.5 shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                            {entry.name}
                                        </li>
                                    ))}
                                </ul>
                            )} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-4 pb-4 h-full flex flex-col justify-start">

            {/* Top row: Key Metrics & Timeline (Span full width) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-h-[300px]">
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="flex-1"><StatCard title="סה״כ הגשות" value={data.total} subtitle={`${data.last24h} ב-24 שעות האחרונות`} /></div>
                    <div className="flex-1"><ComparisonCard title="שימוש (אינטרנט מול פנים)" val1={data.totalInternetUsers} label1="אינטרנט" val2={data.totalInternalUsers} label2="פנימי" /></div>
                    <div className="flex-1"><StatCard title="חיסכון (שעות שבועיות)" value={data.totalTimeSavedHrs} subtitle="אינטגרציה לכלל משיבי הסקר" /></div>
                </div>
                <div className="col-span-4">
                    <AreaFillChart chartData={data.timeSeries} title="קצב מילוי הסקר (הגשות לפי תאריך)" />
                </div>
            </div>

            {/* Second Row: 4 charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[300px]">
                <SimpleBarChart chartData={data.toolsInternet} title="כלי AI רשת אינטרנט" />
                <SimpleBarChart chartData={data.toolsInternal} title="כלי AI ברשת הפנימית" />
                <SimplePieChart chartData={data.timeSavedDist} title="חיסכון זמן שבועי פילוח" />
                <SimpleBarChart chartData={data.useCases} title="מטרות שימוש עיקריות" />
            </div>

            {/* Third Row: 3 charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
                <SimplePieChart chartData={data.roles} title="פילוח משיבים לפי תפקיד" />
                <SimplePieChart chartData={data.teams} title="פילוח לפי מחלקה (1-5)" />
                <SimplePieChart chartData={data.dataSensitivity} title="רגישות מידע בדיאלוג" />
            </div>

            {/* Fourth Row: 3 charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
                <SimpleBarChart chartData={data.verificationMethods} title="שיטות אימות תוצרים" />
                <SimplePieChart chartData={data.qualityImprovement} title="תחושת שיפור איכות תוצר" />
                <SimpleBarChart chartData={data.trainingNeeds} title="צורכי הדרכה והכשרה" />
            </div>

            {/* Lists/Comments Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[150px]">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto custom-scrollbar h-[200px]">
                    <h3 className="text-slate-800 font-bold mb-3 text-sm bg-white pb-2 border-b sticky top-0">הערות / מטרות שימוש אחרות</h3>
                    <ul className="space-y-2">
                        {data.freeComments.length === 0 && <p className="text-slate-400 text-xs">אין נתונים.</p>}
                        {data.freeComments.map((c: any, i: number) => (
                            <li key={i} className="text-slate-700 text-xs bg-slate-50 border border-slate-100 p-2 rounded-lg">{c.text}</li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto custom-scrollbar h-[200px]">
                    <h3 className="text-slate-800 font-bold mb-3 text-sm bg-white pb-2 border-b sticky top-0">כלים מוצעים לבחינה</h3>
                    <ul className="space-y-2">
                        {data.suggestedTools.length === 0 && <p className="text-slate-400 text-xs">אין נתונים.</p>}
                        {data.suggestedTools.map((c: any, i: number) => (
                            <li key={i} className="text-slate-700 text-xs bg-slate-50 border border-slate-100 p-2 rounded-lg">{c.text}</li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    )
}
