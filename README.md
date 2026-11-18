# ShopLite

A responsive e-commerce product page built with React, Vite, and DummyJSON. It includes a searchable and sortable catalog, product details, a quantity-limited cart saved in `localStorage`, and a validated demo checkout. The checkout does not collect payment details or process orders.

## Run locally

```sh
npm install
npm run dev
```

The product catalog is loaded from `https://dummyjson.com/products?limit=100`, so an internet connection is needed to browse products.

## Checks

```sh
npm test
npm run build
```

Search, category, and sort choices are reflected in the URL. Cart values are validated when restored from browser storage, and subtotal calculations use integer cents.
