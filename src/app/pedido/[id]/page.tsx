'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Order } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle, Clock, Package } from 'lucide-react'
import Link from 'next/link'

export default function OrderConfirmationPage() {
    const params = useParams()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string)
        }
    }, [params.id])

    const fetchOrder = async (id: string) => {
        try {
            const orderRef = doc(db, 'orders', id)
            const orderSnap = await getDoc(orderRef)

            if (orderSnap.exists()) {
                setOrder({ id: orderSnap.id, ...orderSnap.data() } as Order)
            }
        } catch (error) {
            console.error('Error fetching order:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="animate-pulse">Cargando...</div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-outfit font-bold mb-4">Pedido no encontrado</h1>
                    <Link href="/" className="btn-primary">
                        Volver al inicio
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const getPaymentInstructions = () => {
        switch (order.paymentMethod) {
            case 'transferencia':
                return (
                    <div className="bg-background-card p-6 rounded-xl border border-text-secondary/20">
                        <h3 className="font-outfit font-semibold text-lg mb-4">Datos para Transferencia Bancaria</h3>
                        <div className="space-y-2 text-text-secondary">
                            <p><strong>Banco:</strong> [Tu Banco]</p>
                            <p><strong>Titular:</strong> [Tu Nombre]</p>
                            <p><strong>Cédula:</strong> [Tu Cédula]</p>
                            <p><strong>Número de Cuenta:</strong> [Tu Cuenta]</p>
                            <p><strong>Tipo:</strong> Corriente/Ahorro</p>
                        </div>
                        <p className="mt-4 text-sm text-accent-primary">
                            Por favor envía el comprobante de pago al email o WhatsApp que aparece en tu confirmación.
                        </p>
                    </div>
                )
            case 'pago-movil':
                return (
                    <div className="bg-background-card p-6 rounded-xl border border-text-secondary/20">
                        <h3 className="font-outfit font-semibold text-lg mb-4">Datos para Pago Móvil</h3>
                        <div className="space-y-2 text-text-secondary">
                            <p><strong>Teléfono:</strong> [Tu Teléfono]</p>
                            <p><strong>Banco:</strong> [Tu Banco]</p>
                            <p><strong>Cédula:</strong> [Tu Cédula]</p>
                        </div>
                        <p className="mt-4 text-sm text-accent-primary">
                            Por favor envía el comprobante de pago al email o WhatsApp que aparece en tu confirmación.
                        </p>
                    </div>
                )
            case 'mercadopago':
                return (
                    <div className="bg-background-card p-6 rounded-xl border border-text-secondary/20">
                        <h3 className="font-outfit font-semibold text-lg mb-4">Pago con Mercado Pago</h3>
                        <p className="text-text-secondary mb-4">
                            Serás redirigido a Mercado Pago para completar tu pago de forma segura.
                        </p>
                        <button className="btn-primary">
                            Ir a Mercado Pago
                        </button>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Message */}
                <div className="text-center mb-12">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-outfit font-bold mb-4">
                        ¡Pedido Recibido!
                    </h1>
                    <p className="text-xl text-text-secondary">
                        Número de pedido: <span className="text-accent-primary font-semibold">{order.orderNumber}</span>
                    </p>
                </div>

                {/* Order Status */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-outfit font-semibold">Estado del Pedido</h2>
                        <div className="flex items-center space-x-2">
                            {order.orderStatus === 'new' && (
                                <>
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                    <span className="text-yellow-500 font-semibold">Nuevo</span>
                                </>
                            )}
                            {order.orderStatus === 'processing' && (
                                <>
                                    <Package className="w-5 h-5 text-blue-500" />
                                    <span className="text-blue-500 font-semibold">En Proceso</span>
                                </>
                            )}
                            {order.orderStatus === 'completed' && (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-green-500 font-semibold">Completado</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Información de Contacto</h3>
                            <p className="text-text-secondary">{order.customer.name}</p>
                            <p className="text-text-secondary">{order.customer.email}</p>
                            <p className="text-text-secondary">{order.customer.phone}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Dirección de Envío</h3>
                            <p className="text-text-secondary">{order.customer.address}</p>
                            <p className="text-text-secondary">
                                {order.customer.city}, {order.customer.state}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Instructions */}
                {order.paymentStatus === 'pending' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-outfit font-semibold mb-4">Instrucciones de Pago</h2>
                        {getPaymentInstructions()}
                    </div>
                )}

                {/* Order Items */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-outfit font-semibold mb-6">Productos</h2>
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center pb-4 border-b border-text-secondary/20 last:border-0">
                                <div>
                                    <h3 className="font-semibold">{item.productName}</h3>
                                    {item.variant && (
                                        <p className="text-sm text-text-secondary">{item.variant}</p>
                                    )}
                                    <p className="text-sm text-text-secondary">Cantidad: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 text-2xl font-outfit font-bold">
                            <span>Total</span>
                            <span className="text-accent-primary">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="card bg-accent-primary/10 border-accent-primary/30">
                    <h2 className="text-2xl font-outfit font-semibold mb-4">Próximos Pasos</h2>
                    <ul className="space-y-2 text-text-secondary">
                        <li>✅ Recibirás un email de confirmación con los detalles de tu pedido</li>
                        <li>📧 Te contactaremos para confirmar el pago y coordinar la entrega</li>
                        <li>🎨 Comenzaremos la producción de tus productos personalizados</li>
                        <li>📦 Te notificaremos cuando tu pedido esté listo para envío</li>
                    </ul>
                </div>

                <div className="text-center mt-8">
                    <Link href="/catalogo" className="btn-outline">
                        Seguir Comprando
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}
