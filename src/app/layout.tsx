import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Sublimación Store - Productos Gaming Personalizados',
    description: 'Tienda online de productos sublimados para gamers: tazas, remeras, gorras, mousepads y más con diseños exclusivos.',
    keywords: ['sublimación', 'gaming', 'productos personalizados', 'tazas gamer', 'remeras gaming'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    )
}
