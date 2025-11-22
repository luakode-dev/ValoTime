import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, ProductVariant } from '@/types'

interface CartStore {
    items: CartItem[]
    addItem: (product: Product, quantity: number, variant?: ProductVariant) => void
    removeItem: (productId: string, variantId?: string) => void
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity, variant) => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === product.id &&
                            item.selectedVariant?.id === variant?.id
                    )

                    if (existingItemIndex > -1) {
                        // Update quantity if item exists
                        const newItems = [...state.items]
                        newItems[existingItemIndex].quantity += quantity
                        return { items: newItems }
                    } else {
                        // Add new item
                        return {
                            items: [...state.items, { product, quantity, selectedVariant: variant }],
                        }
                    }
                })
            },

            removeItem: (productId, variantId) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(item.product.id === productId && item.selectedVariant?.id === variantId)
                    ),
                }))
            },

            updateQuantity: (productId, quantity, variantId) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && item.selectedVariant?.id === variantId
                            ? { ...item, quantity }
                            : item
                    ),
                }))
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                const { items } = get()
                return items.reduce((total, item) => {
                    const variantPrice = item.selectedVariant?.priceModifier || 0
                    return total + (item.product.price + variantPrice) * item.quantity
                }, 0)
            },

            getItemCount: () => {
                const { items } = get()
                return items.reduce((count, item) => count + item.quantity, 0)
            },
        }),
        {
            name: 'cart-storage',
        }
    )
)
