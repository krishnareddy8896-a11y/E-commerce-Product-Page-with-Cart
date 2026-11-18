export default function QuantityStepper({ value, max, onChange }) {
  return (
    <div className="quantity-stepper" aria-label="Quantity">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">+</button>
    </div>
  );
}
