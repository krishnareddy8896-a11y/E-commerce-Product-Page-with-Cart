import { Link } from "react-router-dom";
import { useCartDispatch } from "../state/CartContext";
import { formatMoney, toCents } from "../utils/money";

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useCartDispatch();
  const soldOut = product.stock <= 0;
  const originalPrice = product.discountPercentage > 0
    ? Math.round(toCents(product.price) / (1 - product.discountPercentage / 100))
    : null;

  return (
    <article className="product-card" style={{ "--card-index": index }}>
      <Link className="product-image-link" to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
        <div className="product-image">
          {product.discountPercentage > 0 && <span className="sale-tag">A good deal</span>}
          <img src={product.thumbnail} alt={product.title} loading="lazy" />
        </div>
      </Link>
      <div className="product-info">
        <div className="product-meta"><span>{product.brand || product.category}</span><span>★ {Number(product.rating).toFixed(1)}</span></div>
        <Link className="product-title" to={`/product/${product.id}`}>{product.title}</Link>
        <div className="product-price">
          <strong>{formatMoney(toCents(product.price))}</strong>
          {originalPrice && <del>{formatMoney(originalPrice)}</del>}
        </div>
        <button
          className="add-button"
          type="button"
          disabled={soldOut}
          onClick={() => dispatch({ type: "ADD", product })}
        >
          {soldOut ? "Out of stock" : "Add to bag"} <span aria-hidden="true">↗</span>
        </button>
      </div>
    </article>
  );
}
