export const MAX_QTY = 10;

const limitFor = (item) => Math.min(MAX_QTY, item.stock);

export function validateCart(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((item) => (
    item
    && Number.isSafeInteger(item.id)
    && item.id > 0
    && typeof item.title === "string"
    && Number.isFinite(item.price)
    && item.price >= 0
    && typeof item.thumbnail === "string"
    && Number.isFinite(item.stock)
    && item.stock > 0
    && Number.isSafeInteger(item.qty)
    && item.qty >= 1
    && item.qty <= limitFor(item)
  ));
}

export function cartReducer(items, action) {
  switch (action.type) {
    case "LOAD":
      return validateCart(action.items);
    case "ADD": {
      const product = action.product;
      if (!product || !Number.isSafeInteger(product.id) || product.stock <= 0) return items;

      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) => (
          item.id === product.id
            ? { ...item, qty: Math.min(item.qty + 1, limitFor(item)) }
            : item
        ));
      }

      return [...items, {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        stock: product.stock,
        qty: 1,
      }];
    }
    case "SET_QTY": {
      if (!Number.isSafeInteger(action.qty)) return items;
      if (action.qty <= 0) return items.filter((item) => item.id !== action.id);
      return items.map((item) => (
        item.id === action.id
          ? { ...item, qty: Math.min(action.qty, limitFor(item)) }
          : item
      ));
    }
    case "REMOVE":
      return items.filter((item) => item.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return items;
  }
}

export const selectCount = (items) => items.reduce((count, item) => count + item.qty, 0);

export const selectSubtotal = (items) => items.reduce(
  (subtotal, item) => subtotal + Math.round(item.price * 100) * item.qty,
  0,
);
