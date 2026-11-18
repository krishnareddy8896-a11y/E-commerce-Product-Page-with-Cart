import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { cartReducer, selectCount, selectSubtotal, validateCart } from "../utils/cart";

const CartStateContext = createContext(null);
const CartDispatchContext = createContext(null);
const STORAGE_KEY = "shop-cart-v1";

function initializeCart() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? validateCart(JSON.parse(stored)) : [];
  } catch (error) {
    console.error("Could not read the saved cart.", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, initializeCart);
  const value = useMemo(() => ({
    items,
    count: selectCount(items),
    subtotal: selectSubtotal(items),
  }), [items]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Could not save the cart in this browser.", error);
    }
  }, [items]);

  useEffect(() => {
    function syncCart(event) {
      if (event.key !== STORAGE_KEY) return;
      try {
        dispatch({ type: "LOAD", items: validateCart(event.newValue ? JSON.parse(event.newValue) : []) });
      } catch (error) {
        console.error("Could not sync the cart from another tab.", error);
      }
    }
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  return (
    <CartStateContext.Provider value={value}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartStateContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (!context) throw new Error("useCartDispatch must be used inside CartProvider");
  return context;
}
