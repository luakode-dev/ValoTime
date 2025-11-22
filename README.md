# 🎮 Sublimación Store - Tienda Gaming

Una tienda online moderna para vender productos sublimados con diseños gaming. Construida con Next.js 14, Tailwind CSS, Firebase y diseño Dark Gamer Minimal.

## ✨ Características

### Para Clientes
- 🛍️ Catálogo de productos con filtros por categoría
- 🖼️ Vista previa de productos con mockups de alta calidad
- 🛒 Carrito de compras persistente
- 💳 Múltiples métodos de pago (Mercado Pago, Transferencia, Pago Móvil)
- 📱 Diseño responsive (móvil, tablet, desktop)
- ⚡ Carga rápida y animaciones suaves

### Para Administradores
- 🔐 Panel de administración protegido
- 📦 Gestión de productos (CRUD completo)
- 📋 Gestión de pedidos
- 📊 Gestión de inventario de productos en blanco
- ⚙️ Configuración de datos bancarios

## 🚀 Instalación

### Requisitos Previos

1. **Instalar Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar Firebase**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto
   - Habilita Firestore Database
   - Habilita Authentication (Email/Password)
   - Habilita Storage
   - Copia las credenciales del proyecto

3. **Configurar variables de entorno**
   - Copia `.env.example` a `.env.local`
   ```bash
   copy .env.example .env.local
   ```
   - Edita `.env.local` y completa con tus credenciales de Firebase

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   - Abre http://localhost:3000 en tu navegador

## 📁 Estructura del Proyecto

```
sublimacion-store/
├── src/
│   ├── app/                    # Páginas de Next.js 14 (App Router)
│   │   ├── page.tsx           # Página de inicio
│   │   ├── catalogo/          # Catálogo de productos
│   │   ├── producto/[id]/     # Detalle de producto
│   │   ├── carrito/           # Carrito de compras
│   │   ├── checkout/          # Proceso de pago
│   │   ├── pedido/[id]/       # Confirmación de pedido
│   │   └── admin/             # Panel de administración
│   ├── components/            # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── lib/                   # Utilidades y configuraciones
│   │   └── firebase.ts        # Configuración de Firebase
│   ├── store/                 # Estado global (Zustand)
│   │   └── cartStore.ts       # Store del carrito
│   └── types/                 # Tipos de TypeScript
│       └── index.ts
├── public/                    # Archivos estáticos
├── .env.example              # Ejemplo de variables de entorno
├── tailwind.config.ts        # Configuración de Tailwind
├── next.config.js            # Configuración de Next.js
└── package.json
```

## 🎨 Sistema de Diseño

### Colores (Dark Gamer Minimal)
- **Background Primary:** `#1c1c1e` (Gris carbón)
- **Background Secondary:** `#000000` (Negro)
- **Background Card:** `#2c2c2e` (Gris medio)
- **Accent Primary:** `#ff6b35` (Naranja energético)
- **Accent Hover:** `#ff8555` (Naranja claro)
- **Text Primary:** `#ffffff` (Blanco)
- **Text Secondary:** `#6c6c70` (Gris medio)

### Tipografías
- **Títulos:** Outfit (Google Fonts)
- **Texto:** Inter (Google Fonts)

## 🔥 Configuración de Firebase

### Estructura de Firestore

```
products/
  - id (auto)
  - name: string
  - category: "tazas" | "remeras" | "gorras" | "mousepads" | "otros"
  - price: number
  - designImage: string (URL)
  - mockupImages: string[] (URLs)
  - description: string
  - variants: array (opcional)
  - active: boolean
  - createdAt: timestamp
  - updatedAt: timestamp

orders/
  - id (auto)
  - orderNumber: string
  - customer: object
  - items: array
  - total: number
  - paymentMethod: string
  - paymentStatus: "pending" | "confirmed" | "failed"
  - orderStatus: "new" | "processing" | "completed" | "cancelled"
  - createdAt: timestamp
  - updatedAt: timestamp

inventory/
  - id (auto)
  - type: string
  - category: string
  - quantity: number
  - minStock: number
  - supplier: string
  - lastUpdated: timestamp

settings/
  - bankInfo: object
  - pagoMovil: object
  - mercadoPagoEnabled: boolean
  - storeEmail: string
  - storeName: string
```

### Reglas de Seguridad de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - Lectura pública, escritura solo admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders - Solo usuarios autenticados
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
    
    // Inventory - Solo admin
    match /inventory/{itemId} {
      allow read, write: if request.auth != null;
    }
    
    // Settings - Solo admin
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📦 Agregar Productos Manualmente

Puedes agregar productos directamente en Firebase Console:

1. Ve a Firestore Database
2. Crea la colección `products`
3. Agrega un documento con esta estructura:

```json
{
  "name": "Taza Gamer RGB",
  "category": "tazas",
  "price": 15.00,
  "designImage": "https://tu-url-cloudinary.com/design.jpg",
  "mockupImages": [
    "https://tu-url-cloudinary.com/mockup1.jpg",
    "https://tu-url-cloudinary.com/mockup2.jpg"
  ],
  "description": "Taza de cerámica con diseño gaming RGB. Capacidad 350ml.",
  "variants": [
    {
      "id": "v1",
      "name": "Color",
      "type": "color",
      "value": "Negro",
      "priceModifier": 0
    }
  ],
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🚢 Deployment

### Vercel (Recomendado)

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en Vercel
4. Deploy automático en cada push

```bash
npm run build
```

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables de `.env.local` en tu plataforma de hosting.

## 🛠️ Comandos Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
```

## 📝 Próximos Pasos

1. **Configurar Firebase** con tus credenciales
2. **Agregar productos** a la base de datos
3. **Configurar datos bancarios** en settings
4. **Personalizar** colores y textos según tu marca
5. **Integrar Mercado Pago** (opcional)
6. **Deploy** a Vercel

## 🤝 Soporte

Para preguntas o problemas, contacta al desarrollador.

## 📄 Licencia

Este proyecto es privado y propietario.
