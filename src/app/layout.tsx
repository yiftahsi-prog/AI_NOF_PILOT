import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "סקר שימוש ב-AI בארגון",
    description: "AI Usage Survey Platform",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="he" dir="rtl">
            <body className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen">
                {children}
            </body>
        </html>
    )
}
