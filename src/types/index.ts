// Product Types
export interface Product {
    id: string
    name: string
    category: 'tazas' | 'remeras' | 'gorras' | 'mousepads' | 'otros'
    price: number
    designImage: string // URL to design image
    mockupImages: string[] // Array of mockup URLs
    description: string
    variants?: ProductVariant[]
    active: boolean
    createdAt: Date
    updatedAt: Date
}

export interface ProductVariant {
    id: string
    name: string // e.g., "Color: Negro", "Talla: M"
    type: 'color' | 'size' | 'other'
    value: string
    priceModifier?: number // Additional cost for this variant
}

// Inventory Types (Blank Products)
export interface InventoryItem {
    id: string
    type: string // e.g., "taza-blanca", "remera-negra-M"
    category: 'tazas' | 'remeras' | 'gorras' | 'mousepads' | 'otros'
    quantity: number
    minStock: number // Alert threshold
    supplier?: string
    lastUpdated: Date
}

// Order Types
export interface Order {
    id: string
    orderNumber: string // e.g., "ORD-20231121-001"
    customer: CustomerInfo
    items: OrderItem[]
    total: number
    paymentMethod: 'mercadopago' | 'transferencia' | 'pago-movil'
    paymentStatus: 'pending' | 'confirmed' | 'failed'
    paymentProof?: string // URL to payment proof image
    orderStatus: 'new' | 'processing' | 'completed' | 'cancelled'
    createdAt: Date
    updatedAt: Date
    notes?: string
}

export interface CustomerInfo {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
}

export interface OrderItem {
    productId: string
    productName: string
    quantity: number
    price: number
    variant?: string
    mockupImage: string
}

// Cart Types (Client-side)
export interface CartItem {
    product: Product
    quantity: number
    selectedVariant?: ProductVariant
}

// Settings Types
export interface BankInfo {
    bank: string
    accountNumber: string
    accountHolder: string
    idNumber: string
    accountType: 'corriente' | 'ahorro'
}

export interface PagoMovilInfo {
    phone: string
    bank: string
    idNumber: string
}

export interface StoreSettings {
    bankInfo: BankInfo
    pagoMovil: PagoMovilInfo
    mercadoPagoEnabled: boolean
    storeEmail: string
    storeName: string
    storePhone: string
}
