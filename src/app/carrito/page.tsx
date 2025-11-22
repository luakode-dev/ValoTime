'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CarritoPage() {
    const router = useRouter()
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()

    const handleUpdateQuantity = (productId: string, newQuantity: number, variantId?: string) => {
        if (newQuantity < 1) return
        updateQuantity(productId, newQuantity, variantId)
    }

    const handleRemoveItem = (productId: string, variantId?: string) => {
        removeItem(productId, variantId)
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <ShoppingBag className="w-24 h-24 mx-auto text-text-secondary mb-6" />
                    <h1 className="text-3xl font-outfit font-bold mb-4">
                        Tu carrito está vacío
                    </h1>
                    <p className="text-text-secondary mb-8">
                        ¡Agrega algunos productos increíbles a tu carrito!
                    </p>
                    <Link href="/catalogo" className="btn-primary">
                        Explorar Catálogo
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-outfit font-bold mb-8">
                    Carrito de <span className="text-gradient">Compras</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const itemPrice = item.product.price + (item.selectedVariant?.priceModifier || 0)
                            const itemTotal = itemPrice * item.quantity

                            return (
                                <div key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`} className="card">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-background-secondary rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product.mockupImages && item.product.mockupImages.length > 0 ? (
                                                <Image
                                                    src={item.product.mockupImages[0]}
                                                    alt={item.product.name}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-outfit font-semibold text-lg mb-1 truncate">
                                                {item.product.name}
                                            </h3>
                                            {item.selectedVariant && (
                                                <p className="text-sm text-text-secondary mb-2">
                                                    {item.selectedVariant.value}
                                                </p>
                                            )}
                                            <p className="text-accent-primary font-semibold">
                                                ${itemPrice.toFixed(2)} c/u
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => handleRemoveItem(item.product.id, item.selectedVariant?.id)}
                                                className="text-text-secondary hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.product.id,
                                                            item.quantity - 1,
                                                            item.selectedVariant?.id
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded bg-background-secondary hover:bg-accent-primary/20 transition-colors flex items-center justify-center"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.product.id,
                                                            item.quantity + 1,
                                                            item.selectedVariant?.id
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded bg-background-secondary hover:bg-accent-primary/20 transition-colors flex items-center justify-center"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <p className="font-outfit font-bold text-lg">
                                                ${itemTotal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <button
                            onClick={clearCart}
                            className="text-text-secondary hover:text-red-500 transition-colors text-sm"
                        >
                            Vaciar carrito
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="text-2xl font-outfit font-bold mb-6">Resumen</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal</span>
                                    <span>${getTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Envío</span>
                                    <span>A calcular</span>
                                </div>
                                <div className="border-t border-text-secondary/20 pt-3 flex justify-between text-xl font-outfit font-bold">
                                    <span>Total</span>
                                    <span className="text-accent-primary">${getTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push('/checkout')}
                                fullWidth
                                className="mb-4"
                            >
                                Proceder al Pago
                            </Button>

                            <Link
                                href="/catalogo"
                                className="block text-center text-text-secondary hover:text-accent-primary transition-colors"
                            >
                                Continuar comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
