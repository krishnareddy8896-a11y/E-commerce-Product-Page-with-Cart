import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useCartDispatch } from "../state/CartContext";
import { formatMoney, toCents } from "../utils/money";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (values.address.trim().length < 10) errors.address = "Please enter your full address.";
  return errors;
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const dispatch = useCartDispatch();
  const [values, setValues] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function submitOrder(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setOrder({ name: values.name.trim(), reference: globalThis.crypto?.randomUUID?.().slice(0, 8) || Date.now().toString(36), total: subtotal });
    dispatch({ type: "CLEAR" });
  }

  if (order) {
    return (
      <section className="message-panel order-success">
        <span className="success-mark">✓</span><span className="eyebrow">THAT’S A WRAP</span>
        <h1>Thanks, {order.name}.</h1><p>Your demo order <strong>#{order.reference}</strong> is all set.</p>
        <p className="success-total">Order total · {formatMoney(order.total)}</p>
        <p className="demo-note">This is a demo store. No payment was taken and nothing will be shipped.</p>
        <Link className="button button-dark" to="/">Find more good things <span>↗</span></Link>
      </section>
    );
  }

  if (!items.length) {
    return (
      <div className="message-panel empty-panel checkout-empty">
        <span className="message-icon">♡</span><h1>Nothing to check out yet.</h1>
        <p>Your bag’s empty, but the collection’s full of good finds.</p>
        <Link className="button button-dark" to="/">Browse the collection <span>↗</span></Link>
      </div>
    );
  }

  return (
    <section className="checkout-page">
      <Link className="back-link" to="/cart">← Back to your bag</Link>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submitOrder} noValidate>
          <span className="eyebrow">ALMOST YOURS</span><h1>Let’s make it official<span className="heading-dot">.</span></h1>
          <p>This is a demo checkout. We’ll never ask for payment details here.</p>
          <label>Name
            <input name="name" autoComplete="name" value={values.name} onChange={updateValue} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            {errors.name && <span className="field-error" id="name-error" role="alert">{errors.name}</span>}
          </label>
          <label>Email
            <input name="email" type="email" autoComplete="email" value={values.email} onChange={updateValue} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email && <span className="field-error" id="email-error" role="alert">{errors.email}</span>}
          </label>
          <label>Shipping address
            <textarea name="address" autoComplete="street-address" rows="3" value={values.address} onChange={updateValue} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} />
            {errors.address && <span className="field-error" id="address-error" role="alert">{errors.address}</span>}
          </label>
          <button className="button button-dark place-order" type="submit">Place demo order · {formatMoney(subtotal)} <span>↗</span></button>
        </form>
        <aside className="checkout-summary"><span className="eyebrow">IN YOUR BAG</span><h2>The good stuff.</h2>
          {items.map((item) => <div className="checkout-item" key={item.id}><img src={item.thumbnail} alt="" /><span>{item.title}<small>Qty {item.qty}</small></span><strong>{formatMoney(toCents(item.price) * item.qty)}</strong></div>)}
          <div className="summary-total"><span>Order total</span><strong>{formatMoney(subtotal)}</strong></div>
        </aside>
      </div>
    </section>
  );
}
