"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ShoppingBag } from "lucide-react";

import type { CartItem } from "@/lib/cart/types";
import { CartDrawer } from "./CartDrawer";

type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  drawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddCartItemInput, options?: { openDrawer?: boolean }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CART_KEY = "ranin-cart";

const CartContext = createContext<CartContextValue | null>(null);

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCartToStorage(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ranin-cart-updated"));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCartFromStorage());
    setHydrated(true);

    function syncCart() {
      setItems(readCartFromStorage());
    }

    window.addEventListener("storage", syncCart);
    window.addEventListener("ranin-cart-updated", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("ranin-cart-updated", syncCart);
    };
  }, []);

  function persist(nextItems: CartItem[]) {
    setItems(nextItems);
    writeCartToStorage(nextItems);
  }

  function addItem(
    item: AddCartItemInput,
    options: { openDrawer?: boolean } = { openDrawer: true }
  ) {
    const quantityToAdd = Math.max(1, item.quantity || 1);

    const nextItems = [...items];
    const existing = nextItems.find((cartItem) => cartItem.id === item.id);

    if (existing) {
      existing.quantity += quantityToAdd;
    } else {
      nextItems.push({
        ...item,
        quantity: quantityToAdd,
      });
    }

    persist(nextItems);

    if (options.openDrawer !== false) {
      setDrawerOpen(true);
    }
  }

  function removeItem(id: string) {
    persist(items.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    persist(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    persist([]);
  }

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const value: CartContextValue = {
    items,
    subtotal,
    itemCount,
    drawerOpen,
    openCart: () => setDrawerOpen(true),
    closeCart: () => setDrawerOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      <CartDrawer />

      {hydrated && itemCount > 0 && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-[#24171f] px-5 text-sm font-extrabold text-white shadow-[0_18px_50px_rgba(36,23,31,0.25)] transition hover:bg-[#F9B2D7] hover:text-[#24171f]"
        >
          <ShoppingBag size={18} />
          Cart
          <span className="rounded-full bg-white/15 px-2 py-0.5">
            {itemCount}
          </span>
        </button>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}