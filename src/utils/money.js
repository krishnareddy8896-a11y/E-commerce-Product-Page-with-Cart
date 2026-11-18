const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function toCents(price) {
  return Math.round(price * 100);
}

export function formatMoney(cents) {
  return formatter.format(cents / 100);
}
