import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Product } from '../data/mockData'

export interface CartItem {
  cartId: string
  product: Product
  quantity: number
  selectedPosition?: string
  userInputValues: Record<string, string>
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cartId'>) => void
  removeItem: (cartId: string) => void
  updateQuantity: (cartId: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (item: Omit<CartItem, 'cartId'>) => {
    const cartId = `${item.product.id}-${Date.now()}`
    setItems(prev => [...prev, { ...item, cartId }])
    setIsOpen(true)
  }

  const removeItem = (cartId: string) => setItems(prev => prev.filter(i => i.cartId !== cartId))

  const updateQuantity = (cartId: string, qty: number) => {
    if (qty <= 0) { removeItem(cartId); return }
    setItems(prev => prev.map(i => (i.cartId === cartId ? { ...i, quantity: qty } : i)))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart,
        totalItems, totalPrice,
        isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
