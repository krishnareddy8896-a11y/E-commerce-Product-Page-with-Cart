import { describe, expect, it } from "vitest";
import { cartReducer, selectCount, selectSubtotal, validateCart } from "./cart";

const product = { id: 1, title: "Desk lamp", price: 19.99, thumbnail: "/lamp.png", stock: 3 };

describe("cartReducer", () => {
  it("adds a product and increments an existing product", () => {
    const once = cartReducer([], { type: "ADD", product });
    expect(once[0]).toMatchObject({ id: 1, qty: 1 });
    expect(cartReducer(once, { type: "ADD", product })[0].qty).toBe(2);
  });

  it("caps quantity at the lesser of stock and ten", () => {
    const full = cartReducer([{ ...product, qty: 2 }], { type: "ADD", product });
    expect(full[0].qty).toBe(3);
    expect(cartReducer(full, { type: "SET_QTY", id: 1, qty: 99 })[0].qty).toBe(3);
  });

  it("removes a line when its quantity is set to zero", () => {
    expect(cartReducer([{ ...product, qty: 1 }], { type: "SET_QTY", id: 1, qty: 0 })).toEqual([]);
  });

  it("does not add out-of-stock products and clears all lines", () => {
    expect(cartReducer([], { type: "ADD", product: { ...product, stock: 0 } })).toEqual([]);
    expect(cartReducer([{ ...product, qty: 1 }], { type: "CLEAR" })).toEqual([]);
  });
});

describe("cart selectors and persistence validation", () => {
  it("counts items and totals using integer cents", () => {
    const items = [
      { ...product, qty: 3 },
      { ...product, id: 2, price: 0.1, qty: 1 },
    ];
    expect(selectCount(items)).toBe(4);
    expect(selectSubtotal(items)).toBe(6007);
  });

  it("drops malformed or out-of-range stored cart entries", () => {
    expect(validateCart([
      { ...product, qty: 2 },
      { ...product, id: -1, qty: 1 },
      { ...product, qty: 4 },
    ])).toEqual([{ ...product, qty: 2 }]);
  });
});
