import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import Skeleton from "../components/Skeleton";
import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/useProducts";

const PRODUCTS_URL = "https://dummyjson.com/products?limit=100";
const SORTERS = {
  featured: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.title.localeCompare(b.title),
};

export default function ProductListPage() {
  const { data, loading, error, retry } = useProducts(PRODUCTS_URL);
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") || "";
  const [searchText, setSearchText] = useState(urlQuery);
  const debouncedQuery = useDebounce(searchText.trim());
  const category = params.get("category") || "all";
  const requestedSort = params.get("sort") || "featured";
  const sort = Object.hasOwn(SORTERS, requestedSort) ? requestedSort : "featured";
  const products = data?.products ?? [];

  useEffect(() => setSearchText(urlQuery), [urlQuery]);
  useEffect(() => {
    if (debouncedQuery !== searchText.trim() || debouncedQuery === urlQuery) return;
    const next = new URLSearchParams(params);
    if (debouncedQuery) next.set("q", debouncedQuery);
    else next.delete("q");
    setParams(next, { replace: true });
  }, [debouncedQuery, params, searchText, setParams, urlQuery]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );
  const visibleProducts = useMemo(() => products
    .filter((product) => category === "all" || product.category === category)
    .filter((product) => product.title.toLowerCase().includes(urlQuery.toLowerCase()))
    .slice()
    .sort(SORTERS[sort]), [products, category, urlQuery, sort]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value && value !== "all" && value !== "featured") next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  function clearFilters() {
    setSearchText("");
    setParams({}, { replace: true });
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> GOOD THINGS, FOUND</span>
          <h1>Small joys.<br /><em>Big everyday.</em></h1>
          <p>Thoughtful finds for your home, your routine, and all the in-between moments.</p>
          <a href="#collection" className="text-link">Explore the collection <span>↓</span></a>
        </div>
        <div className="hero-art" aria-label="Curated home and lifestyle collection">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-sun" />
          <span className="hero-word hero-word-top">GOOD</span>
          <span className="hero-word hero-word-bottom">THINGS</span>
          <span className="hero-spark">✳</span>
          <span className="hero-sticker">MADE FOR<br />YOUR EVERYDAY</span>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="section-heading">
          <div><span className="eyebrow">THE GOOD STUFF</span><h2>Find your new favorite.</h2></div>
          <span className="collection-note">A little bit of everything, a lot to love.</span>
        </div>
        <div className="filters">
          <label className="search-field">
            <span className="sr-only">Search products</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search the good stuff"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            {searchText && <button type="button" onClick={() => setSearchText("")} aria-label="Clear search">×</button>}
          </label>
          <label className="filter-select">
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={(event) => updateParam("category", event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((item) => <option value={item} key={item}>{item.replaceAll("-", " ")}</option>)}
            </select>
          </label>
          <label className="filter-select">
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        {loading ? <Skeleton /> : error ? (
          <div className="message-panel error-panel" role="alert">
            <span className="message-icon">!</span><h3>We couldn’t load the collection.</h3>
            <p>{error}</p><button className="button button-dark" onClick={retry}>Try again</button>
          </div>
        ) : visibleProducts.length ? (
          <>
            <div className="results-caption"><span>{visibleProducts.length} finds</span>{(urlQuery || category !== "all" || sort !== "featured") && <button onClick={clearFilters}>Clear filters <span>×</span></button>}</div>
            <ProductGrid products={visibleProducts} />
          </>
        ) : (
          <div className="message-panel empty-panel">
            <span className="message-icon">⌕</span><h3>No finds this time.</h3>
            <p>Try a different search or clear your filters to see everything.</p>
            <button className="button button-dark" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </section>
      <section className="newsletter">
        <div><span className="eyebrow">A NOTE FROM US</span><h2>Good things in your inbox.</h2><p>New finds, little rituals, and the occasional very good deal.</p></div>
        <Link to="/cart" className="button button-light">Take a look in your bag <span>↗</span></Link>
      </section>
    </>
  );
}
