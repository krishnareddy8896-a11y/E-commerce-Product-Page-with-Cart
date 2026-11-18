import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AddToCartButton from "../components/AddToCartButton";
import { useProducts } from "../hooks/useProducts";
import { formatMoney, toCents } from "../utils/money";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, loading, error, retry } = useProducts(`https://dummyjson.com/products/${encodeURIComponent(id)}`);
  const [activeImage, setActiveImage] = useState("");
  const images = product?.images?.length ? product.images : product ? [product.thumbnail] : [];

  useEffect(() => setActiveImage(""), [id]);

  if (loading) return <div className="detail-loading" role="status">Finding the good stuff…</div>;
  if (error || !product?.id) {
    return (
      <div className="message-panel error-panel detail-message" role="alert">
        <span className="message-icon">!</span><h1>We couldn’t find that one.</h1>
        <p>{error || "That product may have moved."}</p>
        <button className="button button-dark" onClick={retry}>Try again</button>
        <Link className="text-link" to="/">Back to the collection</Link>
      </div>
    );
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to="/">← Back to the collection</Link>
      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-image"><img src={activeImage || images[0]} alt={product.title} /></div>
          {images.length > 1 && <div className="detail-thumbnails" aria-label="Product images">
            {images.map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={(activeImage || images[0]) === image ? "active" : ""}
                onClick={() => setActiveImage(image)}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={(activeImage || images[0]) === image}
              ><img src={image} alt="" /></button>
            ))}
          </div>}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{product.brand || product.category}</span>
          <h1>{product.title}</h1>
          <div className="detail-rating">★ {Number(product.rating).toFixed(1)} <span>·</span> {product.category.replaceAll("-", " ")}</div>
          <div className="detail-price">{formatMoney(toCents(product.price))}{product.discountPercentage > 0 && <span>{product.discountPercentage}% off</span>}</div>
          <p className="detail-description">{product.description}</p>
          <div className={`stock-note ${product.stock <= 0 ? "sold-out" : ""}`}>
            <span />{product.stock > 0 ? `${product.stock} in stock · ready when you are` : "Currently out of stock"}
          </div>
          <AddToCartButton product={product} />
          <div className="detail-perks"><span>✳ Thoughtfully picked</span><span>↗ Easy 30-day returns</span></div>
        </div>
      </div>
    </section>
  );
}
