# Products Dashboard

A product-listing dashboard built with React 19 + TypeScript + Vite, with debounced search, category and price filters, paginated grid, and a product details modal.

## Stack

- **React 19** + **TypeScript** (strict via Vite/tsc)
- **Vite** for build/dev
- **Ant Design 6** + **Tailwind CSS 4** for UI
- **TanStack Query (React Query) 5** for server state, caching, and request cancellation
- **Zustand** for client state (filters + selected product)
- **Axios** for HTTP, with a typed instance and global error toast
- **dummyjson.com** as the public product API

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint     # eslint
```

## Project layout

```
src/
  api/                  Axios instance + product/category endpoints
  components/
    common/             Reusable building blocks (Modal, ...)
    layout/             Page chrome (Header, Sidebar, Footer, PageLayout)
    product/            Filters, ProductCard, ProductDetailsModal
  features/products/    Domain types
  hooks/                useProducts (data + paginate), useDebounce
  pages/                Dashboard
  store/                Zustand stores (filtersStore, uiStore)
```

## Architecture decisions

### Server state vs. client state
- **Server state** (products, categories) lives in React Query. We get caching (`staleTime: 5min` for products, `Infinity` for categories), background refetching, request deduplication, and `AbortSignal` cancellation for free.
- **Client state** (filter inputs, selected product) lives in two small Zustand stores. Components subscribe to the slices they actually use, so e.g. typing in the search input does not re-render the price slider.

### Why Zustand over Redux Toolkit here
- Two thin stores (`filtersStore`, `uiStore`) plus React Query covers the whole app without boilerplate (no actions, reducers, slices, providers).
- Selector subscriptions give us the same render-isolation Redux gets via `useSelector`, with less code.
- Redux Toolkit would make sense if we needed Redux DevTools time-travel debugging, an entity adapter for normalized client-cached entities, or middleware (sagas, listener middleware) — none of which this app needs.

### API filter strategy
The dummyjson API exposes three product endpoints — `/products`, `/products/search?q=...`, `/products/category/{slug}` — and they cannot be combined (the category endpoint ignores `q`, and there is no `minPrice`/`maxPrice` parameter). The dataset is small (~194 products), so the hook fetches all matching results in one call (`limit=0`), then applies price filtering, optional client-side search refinement (when both category and search are active), and pagination locally. This gives accurate `total` for pagination and lets the user combine all three filters meaningfully.

### Filter → query coupling
`useProducts` keys its React Query cache on `["products", search, category]` only. Changing page, limit, or price range never refetches — those are pure client-side derivations from the cached dataset. This keeps the network footprint tiny.

### Re-render isolation
- `Filters` and `ProductCard` are wrapped in `React.memo`.
- `ProductCard` reads `selectProduct` directly from the UI store rather than receiving it as a prop, so flipping `selectedProduct` does not invalidate every card's props.
- Filter controls each subscribe to their own slice (`useFiltersStore((s) => s.search)`), so a single keystroke only re-renders the search `Input`.
- Filtered/paginated arrays are wrapped in `useMemo` keyed on the inputs that actually affect them.

### Loading & error states
- Initial load shows a centred Ant `Spin`.
- Background refetches (filter/page changes) keep the previous data on screen via React Query `placeholderData: (prev) => prev`, with a non-unmounting `Spin` overlay over the grid — the search input keeps focus while data is in flight.
- Network errors raise a global `message.error` via the Axios response interceptor, plus a fallback error panel on the dashboard.

### Lazy loading
- Product images use `loading="lazy"`.
- The product details modal is `React.lazy(() => import(...))` + `Suspense`, so the modal code (gallery, rate, tags) is fetched only when the user clicks a card.

## Trade-offs

- **Single-shot dataset fetch.** With dummyjson's ~194 products, fetching everything once is fast and lets us combine filters cleanly. For a real backend with 10k+ products this would be replaced with server-side `?page=&limit=&q=&category=&minPrice=&maxPrice=` and React Query's `keepPreviousData` for paginated queries. See "Scaling" below.
- **Client-side combined-filter fallback.** When both a category and a search term are active we filter the search text client-side over `title|description|brand`, since dummyjson's category endpoint ignores `q`. With a real backend that supports combined filters, this fallback would be deleted.
- **Tailwind + Ant Design.** Two styling systems can collide (e.g. some `!important` overrides for slick-carousel dots in `index.css`). For a larger app I'd settle on one as the primary design system and reach for the other only as escape hatches.
- **No virtualization.** A grid of 12 cards per page doesn't need it. If `limit` grew to hundreds, I'd swap the grid for `@tanstack/react-virtual`.
- **No router.** Single page; if the app grew, filters/page would move into URL search params via `react-router` so deep-links and back-button work.

## Follow-up answers

### How do you prevent unnecessary re-renders in React?

- Pull state to the lowest level that needs it; lift only when necessary.
- `React.memo` on leaf components that receive stable props.
- Stable callbacks via `useCallback`, stable derived values via `useMemo` — but only when downstream actually benefits, not as a default.
- Use selector-based stores (Zustand's `useStore(s => s.x)`, Redux's `useSelector`) so a component subscribes to the slice it reads, not the whole store.
- For lists, give every item a stable `key` and pass primitive props instead of fresh object literals.
- Avoid context for high-churn values; if you must, split contexts so unrelated consumers don't re-render.
- React 19's compiler can auto-memoize once enabled — opt in for hot paths.

### Why Zustand over Redux Toolkit (or vice versa)?

**Zustand** when:
- You need a small, fast store without boilerplate.
- You don't need time-travel debugging, entity adapters, or middleware ecosystems.
- Most of your "global" state is actually server state (use React Query) and only a handful of UI slices remain.

**Redux Toolkit** when:
- You need normalized client-cached entities (`createEntityAdapter`).
- You want first-class DevTools time travel, action replay, and the Redux ecosystem (sagas, listener middleware, redux-persist).
- Multiple teams contribute to the same store and the explicit action/reducer convention helps coordinate changes.

For this app the state is tiny and Zustand's selector model is enough — RTK would add ceremony without payoff.

### How would you handle extremely large datasets (100k+ items)?

1. **Don't ship them to the client.** Server-side pagination + filtering + sorting; the client only ever holds one page.
2. **Use cursor-based pagination** (`after` cursor) instead of offset for stable pages while data mutates.
3. **Virtualize the visible region** with `@tanstack/react-virtual` (or `react-window`) for windowed rendering.
4. **Push expensive ranking/aggregation** into the backend / a search service (Algolia, Meilisearch, Elasticsearch).
5. **Cache hot queries** in React Query and prefetch the next page on idle.
6. **Compress images** at the CDN edge and serve responsive `srcset` with `loading="lazy"`.
7. If data is mostly static, ship a pre-built search index (FlexSearch / lunr) and run search in a Web Worker so the main thread stays responsive.

### How do you cancel in-flight API requests?

- Use Axios's `signal` option (or fetch's) and pass React Query's per-query `signal` into it. React Query auto-aborts the previous request when the query key changes or the component unmounts. (Implemented in `getProducts(filters, signal)` and `getCategories(signal)`.)
- For non-React-Query code: own the `AbortController`, expose `abort()`, and call it on `useEffect` cleanup or before issuing the next request.
- Debounce or throttle the trigger (search input, etc.) so most cancellations never need to fire.

### How would you scale this application for production?

- **Routing**: `react-router` with code-split route chunks; sync filters/page to URL search params for shareable deep-links and proper back-button behaviour.
- **Auth & user data**: HTTP-only cookies, refresh-token rotation, and a typed API client (OpenAPI codegen → typed hooks).
- **Server state**: React Query persistor (IndexedDB) for offline-friendly cache, optimistic updates for mutations.
- **Forms**: `react-hook-form` + `zod` for typed validation; share schemas with the backend.
- **Performance**: route-level code splitting, virtualization for long lists, image CDN with responsive `srcset`, prefetch on link hover, React 19 compiler.
- **Observability**: Sentry (or equivalent) for runtime errors, web-vitals reporting, structured client logs.
- **Quality gates**: TypeScript strict, ESLint, Prettier, Vitest + React Testing Library for unit/component, Playwright for E2E. PR-blocking CI: typecheck + lint + tests + bundle-size budget.
- **Build & deploy**: deterministic Docker image with `npm ci`, Vite build artefact uploaded to a static host (CloudFront/Vercel) behind a CDN; preview deploys per PR.
- **Security**: CSP headers, sanitise any user-rendered HTML, never store secrets in `import.meta.env.VITE_*` (those ship to the browser).
- **Feature flags**: a flag service (LaunchDarkly / GrowthBook) for gradual rollouts and kill switches.

## Notes / things explicitly *not* done

- No tests are included — see "Scaling" for the testing stack I'd add for a production codebase.
