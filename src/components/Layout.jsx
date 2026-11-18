import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "../state/CartContext";

export default function Layout() {
  const { count } = useCart();

  return (
    <>
      <div className="announcement">A little something good for every day <span>✳</span> Free shipping on orders over $75</div>
      <header className="topbar">
        <Link className="logo" to="/" aria-label="ShopLite home"><span className="logo-mark">s.</span> shoplite</Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Shop</NavLink>
          <a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">Our picks</a>
        </nav>
        <Link className="cart-link" to="/cart" aria-label={`Shopping bag, ${count} items`}>
          <span>Bag</span><span className="cart-count">{count}</span>
        </Link>
      </header>
      <main className="page-shell"><Outlet /></main>
      <footer className="site-footer">
        <Link className="logo" to="/"><span className="logo-mark">s.</span> shoplite</Link>
        <p>Everyday essentials, picked with care.</p>
        <span>Demo store · No payments are processed</span>
      </footer>
    </>
  );
}
