'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useCartStore } from '@/store/cartStore'
import { Order, CustomerInfo } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { CreditCard, Building2, Smartphone } from 'lucide-react'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotal, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transferencia' | 'pago-movil'>('mercadopago')

    const [formData, setFormData] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
    })

    const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name as keyof CustomerInfo]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<CustomerInfo> = {}

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
        if (!formData.email.trim()) newErrors.email = 'El email es requerido'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido'
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido'
        if (!formData.address.trim()) newErrors.address = 'La dirección es requerida'
        if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida'
        if (!formData.state.trim()) newErrors.state = 'El estado es requerido'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const generateOrderNumber = () => {
        const date = new Date()
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        return `ORD-${dateStr}-${random}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return
        if (items.length === 0) {
            alert('El carrito está vacío')
            return
        }

        setLoading(true)

        try {
            const orderData: Omit<Order, 'id'> = {
                orderNumber: generateOrderNumber(),
                customer: formData,
                items: items.map((item) => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price + (item.selectedVariant?.priceModifier || 0),
                    variant: item.selectedVariant?.value,
                    mockupImage: item.product.mockupImages?.[0] || '',
                })),
                total: getTotal(),
                paymentMethod,
                paymentStatus: 'pending',
                orderStatus: 'new',
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const ordersRef = collection(db, 'orders')
            const docRef = await addDoc(ordersRef, {
                ...orderData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })

            // Clear cart
            clearCart()

            // Redirect to confirmation page
            router.push(`/pedido/${docRef.id}`)
        } catch (error) {
            console.error('Error creating order:', error)
            alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        router.push('/carrito')
        return null
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-outfit font-bold mb-8">
                    Finalizar <span className="text-gradient">Compra</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Customer Information */}
                    <div className="card">
                        <h2 className="text-2xl font-outfit font-semibold mb-6">Información de Contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre Completo"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={errors.name}
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={errors.email}
                                required
                            />
                            <Input
                                label="Teléfono"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={errors.phone}
                                required
                            />
                            <Input
                                label="Ciudad"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                error={errors.city}
                                required
                            />
                            <Input
                                label="Estado"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                error={errors.state}
                                required
                            />
                            <Input
                                label="Dirección Completa"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                error={errors.address}
                                required
                                className="md:col-span-2"
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="card">
                        <h2 className="text-2xl font-outfit font-semibold mb-6">Método de Pago</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('mercadopago')}
                                className={`p-6 rounded-xl border-2 transition-all ${paymentMethod === 'mercadopago'
                                        ? 'border-accent-primary bg-accent-primary/10'
                                        : 'border-text-secondary/20 hover:border-accent-primary/50'
                                    }`}
                            >
                                <CreditCard className="w-8 h-8 mx-auto mb-3 text-accent-primary" />
                                <h3 className="font-outfit font-semibold mb-1">Mercado Pago</h3>
                                <p className="text-sm text-text-secondary">Tarjetas y más</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('transferencia')}
                                className={`p-6 rounded-xl border-2 transition-all ${paymentMethod === 'transferencia'
                                        ? 'border-accent-primary bg-accent-primary/10'
                                        : 'border-text-secondary/20 hover:border-accent-primary/50'
                                    }`}
                            >
                                <Building2 className="w-8 h-8 mx-auto mb-3 text-accent-primary" />
                                <h3 className="font-outfit font-semibold mb-1">Transferencia</h3>
                                <p className="text-sm text-text-secondary">Bancaria</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('pago-movil')}
                                className={`p-6 rounded-xl border-2 transition-all ${paymentMethod === 'pago-movil'
                                        ? 'border-accent-primary bg-accent-primary/10'
                                        : 'border-text-secondary/20 hover:border-accent-primary/50'
                                    }`}
                            >
                                <Smartphone className="w-8 h-8 mx-auto mb-3 text-accent-primary" />
                                <h3 className="font-outfit font-semibold mb-1">Pago Móvil</h3>
                                <p className="text-sm text-text-secondary">C2P Venezuela</p>
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="card">
                        <h2 className="text-2xl font-outfit font-semibold mb-6">Resumen del Pedido</h2>
                        <div className="space-y-3 mb-6">
                            {items.map((item) => (
                                <div
                                    key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`}
                                    className="flex justify-between text-text-secondary"
                                >
                                    <span>
                                        {item.product.name} {item.selectedVariant && `(${item.selectedVariant.value})`} x{item.quantity}
                                    </span>
                                    <span>
                                        ${((item.product.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <div className="border-t border-text-secondary/20 pt-3 flex justify-between text-2xl font-outfit font-bold">
                                <span>Total</span>
                                <span className="text-accent-primary">${getTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Procesando...' : 'Confirmar Pedido'}
                        </Button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    )
}
