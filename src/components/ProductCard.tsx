'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem(product, 1)
        // TODO: Add toast notification
    }

    return (
        <Link href={`/producto/${product.id}`}>
            <div className="card card-glow group cursor-pointer h-full flex flex-col">
                {/* Product Image */}
                <div className="relative aspect-square bg-background-secondary rounded-lg overflow-hidden mb-4">
                    {product.mockupImages && product.mockupImages.length > 0 ? (
                        <Image
                            src={product.mockupImages[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary">
                            Sin imagen
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 bg-accent-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {product.category}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-outfit font-semibold mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                        {product.name}
                    </h3>

                    <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-1">
                        {product.description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <span className="text-2xl font-outfit font-bold text-accent-primary">
                                ${product.price.toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="btn-primary py-2 px-4 flex items-center space-x-2 group/btn"
                        >
                            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Agregar</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}
