export default function Skeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-label="Loading products" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-block skeleton-image" />
          <div className="skeleton-copy">
            <div className="skeleton-block skeleton-short" />
            <div className="skeleton-block skeleton-line" />
            <div className="skeleton-block skeleton-short" />
            <div className="skeleton-block skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}
