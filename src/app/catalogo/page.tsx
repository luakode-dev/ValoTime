'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Product } from '@/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Filter } from 'lucide-react'

export default function CatalogoPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const categories = [
        { id: 'all', name: 'Todos' },
        { id: 'tazas', name: 'Tazas' },
        { id: 'remeras', name: 'Remeras' },
        { id: 'gorras', name: 'Gorras' },
        { id: 'mousepads', name: 'Mousepads' },
        { id: 'otros', name: 'Otros' },
    ]

    useEffect(() => {
        fetchProducts()
    }, [selectedCategory])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const productsRef = collection(db, 'products')

            let q = query(productsRef, where('active', '==', true))

            if (selectedCategory !== 'all') {
                q = query(productsRef, where('category', '==', selectedCategory), where('active', '==', true))
            }

            const querySnapshot = await getDocs(q)
            const productsData: Product[] = []

            querySnapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() } as Product)
            })

            setProducts(productsData)
        } catch (error) {
            console.error('Error fetching products:', error)
            // For demo purposes, set empty array
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">
                        Catálogo de <span className="text-gradient">Productos</span>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Explora nuestra colección de productos gaming sublimados
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Filter className="w-5 h-5 text-accent-primary" />
                        <h2 className="text-lg font-outfit font-semibold">Categorías</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-lg font-medium transition-all ${selectedCategory === category.id
                                        ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/50'
                                        : 'bg-background-card text-text-secondary hover:bg-background-card/80 hover:text-text-primary border border-text-secondary/20'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="aspect-square bg-background-secondary rounded-lg mb-4"></div>
                                <div className="h-6 bg-background-secondary rounded mb-2"></div>
                                <div className="h-4 bg-background-secondary rounded mb-4"></div>
                                <div className="h-10 bg-background-secondary rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎮</div>
                        <h3 className="text-2xl font-outfit font-bold mb-2">
                            No hay productos disponibles
                        </h3>
                        <p className="text-text-secondary mb-6">
                            {selectedCategory === 'all'
                                ? 'Aún no hemos agregado productos al catálogo.'
                                : 'No hay productos en esta categoría por el momento.'}
                        </p>
                        {selectedCategory !== 'all' && (
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className="btn-primary"
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
