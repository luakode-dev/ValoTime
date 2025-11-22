import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/10 to-transparent"></div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-outfit font-bold mb-6 animate-fade-in">
                        Productos Gaming
                        <span className="block text-gradient">Sublimados</span>
                    </h1>
                    <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto animate-slide-up">
                        Diseños exclusivos para gamers. Tazas, remeras, gorras y más con la mejor calidad de sublimación.
                    </p>
                    <div className="flex gap-4 justify-center animate-slide-up">
                        <Link href="/catalogo" className="btn-primary">
                            Ver Catálogo
                        </Link>
                        <Link href="/catalogo" className="btn-outline">
                            Explorar Diseños
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Preview */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-outfit font-bold text-center mb-12">
                        Categorías Populares
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Tazas', href: '/catalogo?category=tazas' },
                            { name: 'Remeras', href: '/catalogo?category=remeras' },
                            { name: 'Gorras', href: '/catalogo?category=gorras' },
                            { name: 'Mousepads', href: '/catalogo?category=mousepads' },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="card card-glow cursor-pointer group"
                            >
                                <div className="aspect-square bg-background-secondary rounded-lg mb-4 flex items-center justify-center">
                                    <Gamepad2 className="w-16 h-16 text-accent-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="text-xl font-outfit font-semibold text-center group-hover:text-accent-primary transition-colors">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-background-secondary/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🎨</span>
                            </div>
                            <h3 className="text-xl font-outfit font-semibold mb-2">Diseños Exclusivos</h3>
                            <p className="text-text-secondary">
                                Diseños únicos creados especialmente para la comunidad gamer
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚡</span>
                            </div>
                            <h3 className="text-xl font-outfit font-semibold mb-2">Alta Calidad</h3>
                            <p className="text-text-secondary">
                                Sublimación de primera calidad que no se desgasta con el tiempo
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🚀</span>
                            </div>
                            <h3 className="text-xl font-outfit font-semibold mb-2">Producción Rápida</h3>
                            <p className="text-text-secondary">
                                Producimos tu pedido bajo demanda con entrega rápida
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
