"use client"

import * as React from "react"

export type CartItem = {
  id: string
  name: string
  price: number | null
  image?: string | null
  sku?: string | null
  variantId?: string | null
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = React.createContext<CartContextValue | null>(null)
const STORAGE_KEY = "imperio.catalogo.cart"

function readStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])

  React.useEffect(() => {
    setItems(readStorage())
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = React.useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((entry) => entry.id === item.id)
        if (existing) {
          return prev.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry
          )
        }
        return [...prev, { ...item, quantity }]
      })
    },
    []
  )

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clear = React.useCallback(() => {
    setItems([])
  }, [])

  const total = React.useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.price === null) {
        return sum
      }
      return sum + item.price * item.quantity
    }, 0)
  }, [items])

  const count = React.useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      total,
      count,
    }),
    [items, addItem, updateQuantity, removeItem, clear, total, count]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
