'use client'

import Link from 'next/link'
import { ShoppingCart, Gamepad2, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

export default function Navbar() {
    const itemCount = useCartStore((state) => state.getItemCount())
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <Gamepad2 className="w-8 h-8 text-accent-primary group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-outfit font-bold">
                            Sublimación<span className="text-accent-primary">Store</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="hover:text-accent-primary transition-colors font-medium"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/catalogo"
                            className="hover:text-accent-primary transition-colors font-medium"
                        >
                            Catálogo
                        </Link>
                        <Link
                            href="/carrito"
                            className="relative hover:text-accent-primary transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-glow">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-4 animate-slide-up">
                        <Link
                            href="/"
                            className="block hover:text-accent-primary transition-colors font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/catalogo"
                            className="block hover:text-accent-primary transition-colors font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Catálogo
                        </Link>
                        <Link
                            href="/carrito"
                            className="flex items-center space-x-2 hover:text-accent-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Carrito ({itemCount})</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
