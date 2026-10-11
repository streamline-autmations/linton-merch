import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { basketKey, clampQuantity, sanitiseBasket, type QuoteItem } from '@/lib/quote'
import { productById } from '@/data/products'

interface BasketContextValue {
  items: QuoteItem[]
  storageUnavailable: boolean
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  add: (id: string) => void
  update: (id: string, changes: Partial<Pick<QuoteItem, 'quantity' | 'specification'>>) => void
  remove: (id: string) => void
  clear: () => void
}
const drawerTaughtKey = 'linton-demo-drawer-taught'
const BasketContext = createContext<BasketContextValue | null>(null)

export function BasketProvider({ children }: { children: ReactNode }) {
  const [storageUnavailable, setStorageUnavailable] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [items, setItems] = useState<QuoteItem[]>(() => {
    try {
      return sanitiseBasket(JSON.parse(localStorage.getItem(basketKey) ?? '[]'))
    } catch {
      return []
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(basketKey, JSON.stringify(items))
    } catch {
      setStorageUnavailable(true)
    }
  }, [items])
  function add(id: string) {
    if (!productById.has(id)) return
    // Teach the drawer once: the first product added in a visit opens it.
    try {
      if (!sessionStorage.getItem(drawerTaughtKey)) {
        sessionStorage.setItem(drawerTaughtKey, '1')
        setDrawerOpen(true)
      }
    } catch {
      /* storage blocked: the header button still opens the drawer */
    }
    setItems((previous) =>
      previous.some((item) => item.productId === id)
        ? previous
        : [...previous, { productId: id, quantity: 25, specification: '' }],
    )
  }
  function update(id: string, changes: Partial<Pick<QuoteItem, 'quantity' | 'specification'>>) {
    setItems((previous) =>
      previous.map((item) =>
        item.productId === id
          ? { ...item, ...changes, quantity: clampQuantity(changes.quantity ?? item.quantity) }
          : item,
      ),
    )
  }
  return (
    <BasketContext.Provider
      value={{
        items,
        storageUnavailable,
        drawerOpen,
        setDrawerOpen,
        add,
        update,
        remove: (id) => setItems((previous) => previous.filter((item) => item.productId !== id)),
        clear: () => setItems([]),
      }}
    >
      {children}
    </BasketContext.Provider>
  )
}
export function useBasket() {
  const value = useContext(BasketContext)
  if (!value) throw new Error('BasketProvider is missing')
  return value
}
