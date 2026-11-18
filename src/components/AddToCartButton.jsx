import { useCartDispatch } from "../state/CartContext";

export default function AddToCartButton({ product }) {
  const dispatch = useCartDispatch();
  const soldOut = product.stock <= 0;

  return (
    <button
      className="button button-dark"
      type="button"
      disabled={soldOut}
      onClick={() => dispatch({ type: "ADD", product })}
    >
      {soldOut ? "Out of stock" : "Add to bag"} <span aria-hidden="true">↗</span>
    </button>
  );
}
