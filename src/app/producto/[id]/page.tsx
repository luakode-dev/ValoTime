'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cartStore'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Image from 'next/image'
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const addItem = useCartStore((state) => state.addItem)

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>()
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string)
        }
    }, [params.id])

    const fetchProduct = async (id: string) => {
        try {
            setLoading(true)
            const productRef = doc(db, 'products', id)
            const productSnap = await getDoc(productRef)

            if (productSnap.exists()) {
                const productData = { id: productSnap.id, ...productSnap.data() } as Product
                setProduct(productData)

                // Set first variant as default if exists
                if (productData.variants && productData.variants.length > 0) {
                    setSelectedVariant(productData.variants[0])
                }
            } else {
                console.error('Product not found')
            }
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity, selectedVariant)
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2000)
        }
    }

    const calculatePrice = () => {
        if (!product) return 0
        const basePrice = product.price
        const variantPrice = selectedVariant?.priceModifier || 0
        return (basePrice + variantPrice) * quantity
    }

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="aspect-square bg-background-secondary rounded-xl"></div>
                            <div className="space-y-4">
                                <div className="h-12 bg-background-secondary rounded"></div>
                                <div className="h-6 bg-background-secondary rounded w-1/3"></div>
                                <div className="h-24 bg-background-secondary rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl font-outfit font-bold mb-4">Producto no encontrado</h1>
                    <Button onClick={() => router.push('/catalogo')}>Volver al catálogo</Button>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-text-secondary hover:text-accent-primary transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        {/* Main Image */}
                        <div className="aspect-square bg-background-secondary rounded-xl overflow-hidden mb-4">
                            {product.mockupImages && product.mockupImages.length > 0 ? (
                                <Image
                                    src={product.mockupImages[selectedImage]}
                                    alt={product.name}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-secondary">
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.mockupImages && product.mockupImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.mockupImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-accent-primary'
                                                : 'border-transparent hover:border-text-secondary'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - Vista ${index + 1}`}
                                            width={150}
                                            height={150}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Category Badge */}
                        <div className="inline-block bg-accent-primary/20 text-accent-primary px-4 py-1 rounded-full text-sm font-semibold mb-4">
                            {product.category}
                        </div>

                        <h1 className="text-4xl font-outfit font-bold mb-4">{product.name}</h1>

                        <div className="text-4xl font-outfit font-bold text-accent-primary mb-6">
                            ${calculatePrice().toFixed(2)}
                        </div>

                        <p className="text-text-secondary mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-outfit font-semibold mb-3">Opciones:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedVariant?.id === variant.id
                                                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                                                    : 'border-text-secondary/20 hover:border-accent-primary/50'
                                                }`}
                                        >
                                            {variant.value}
                                            {variant.priceModifier && variant.priceModifier > 0 && (
                                                <span className="text-sm ml-1">+${variant.priceModifier}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-8">
                            <h3 className="font-outfit font-semibold mb-3">Cantidad:</h3>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg bg-background-card border border-text-secondary/20 hover:border-accent-primary transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg bg-background-card border border-text-secondary/20 hover:border-accent-primary transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            onClick={handleAddToCart}
                            fullWidth
                            className="flex items-center justify-center space-x-2 text-lg py-4"
                        >
                            {addedToCart ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>¡Agregado al carrito!</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Agregar al carrito</span>
                                </>
                            )}
                        </Button>

                        {/* Product Features */}
                        <div className="mt-8 p-6 bg-background-card rounded-xl border border-text-secondary/20">
                            <h3 className="font-outfit font-semibold mb-4">Características:</h3>
                            <ul className="space-y-2 text-text-secondary">
                                <li className="flex items-start space-x-2">
                                    <Check className="w-5 h-5 text-accent-primary mt-0.5 flex-shrink-0" />
                                    <span>Sublimación de alta calidad</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <Check className="w-5 h-5 text-accent-primary mt-0.5 flex-shrink-0" />
                                    <span>Diseños exclusivos para gamers</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <Check className="w-5 h-5 text-accent-primary mt-0.5 flex-shrink-0" />
                                    <span>Producción bajo demanda</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <Check className="w-5 h-5 text-accent-primary mt-0.5 flex-shrink-0" />
                                    <span>Colores vibrantes y duraderos</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
