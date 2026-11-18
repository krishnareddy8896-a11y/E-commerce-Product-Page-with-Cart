import { Link } from "react-router-dom";
import QuantityStepper from "../components/QuantityStepper";
import { useCart, useCartDispatch } from "../state/CartContext";
import { formatMoney, toCents } from "../utils/money";

export default function CartPage() {
  const { items, subtotal } = useCart();
  const dispatch = useCartDispatch();

  return (
    <section className="cart-page">
      <div className="cart-heading"><div><span className="eyebrow">YOUR GOOD FINDS</span><h1>Your bag<span className="heading-dot">.</span></h1></div><Link className="back-link" to="/">← Keep looking</Link></div>
      {!items.length ? (
        <div className="message-panel empty-panel cart-empty">
          <span className="message-icon">♡</span><h2>Your bag’s taking a breather.</h2>
          <p>There’s nothing in here just yet. Your next favorite is waiting.</p>
          <Link className="button button-dark" to="/">Explore the collection <span>↗</span></Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-row" key={item.id}>
                <Link to={`/product/${item.id}`} className="cart-thumb"><img src={item.thumbnail} alt="" /></Link>
                <div className="cart-item-copy">
                  <Link to={`/product/${item.id}`} className="cart-item-title">{item.title}</Link>
                  <span>{formatMoney(toCents(item.price))} each</span>
                  <QuantityStepper
                    value={item.qty}
                    max={Math.min(10, item.stock)}
                    onChange={(qty) => dispatch({ type: "SET_QTY", id: item.id, qty })}
                  />
                </div>
                <div className="cart-line-total">
                  <strong>{formatMoney(toCents(item.price) * item.qty)}</strong>
                  <button type="button" onClick={() => dispatch({ type: "REMOVE", id: item.id })}>Remove</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <span className="eyebrow">THE TOTALS</span><h2>Little details.</h2>
            <div className="summary-row"><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong>{subtotal >= 7500 ? "On us" : "Calculated at checkout"}</strong></div>
            <p className="shipping-note">{subtotal >= 7500 ? "You’ve unlocked free shipping." : `You’re ${formatMoney(7500 - subtotal)} away from free shipping.`}</p>
            <div className="summary-total"><span>Total</span><strong>{formatMoney(subtotal)}</strong></div>
            <Link to="/checkout" className="button button-dark checkout-link">Continue to checkout <span>↗</span></Link>
            <p className="demo-note">Demo checkout · No payment details needed</p>
          </aside>
        </div>
      )}
    </section>
  );
}
