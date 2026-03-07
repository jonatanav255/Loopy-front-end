# Dependency Guide

Quick reference for every external API used in the Loopy frontend.
Open with `Cmd+P` → type `dependency` → select this file.

Use `Cmd+F` to search for a specific name (e.g. `useEffect`, `BrowserRouter`, `axios.create`).

## Convention

When adding new files or using new dependency-provided APIs:

1. **Add a one-liner** at the top of the file (before `import`s):
   ```ts
   // Dependencies: hookName, ComponentName — see DEPENDENCY_GUIDE.md
   ```
2. **Add an entry** to this file under the appropriate section with `### name`, `**From:**`, `**Used in:**`, and a prose explanation.
3. **Skip the one-liner** if the file only uses our own code (e.g. `auth.ts`, `types/auth.ts`).
4. **Keep normal comments** (business logic, flow explanations) in the source files — only dependency explanations go here.

---

## React (react, react-dom)

### `createRoot(domElement)`
**From:** `react-dom/client`
**Used in:** `main.tsx`

Entry point for React 18+. Takes a real DOM element and returns a root that can render React components into it. Replaces the old `ReactDOM.render()`. The root manages the entire React tree — updates, reconciliation, and unmounting.

### `StrictMode`
**From:** `react`
**Used in:** `main.tsx`

Development-only wrapper component that activates extra checks:
- Renders components twice to detect impure renders (side effects during render)
- Runs effects twice to detect missing cleanup functions
- Warns about deprecated APIs

Does nothing in production. No visible output.

### `useState(initialValue)`
**From:** `react`
**Used in:** `AuthContext.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`

Returns a `[value, setter]` pair. The value persists across re-renders (unlike a regular variable which resets every render). Calling the setter triggers a re-render with the new value. React batches multiple setter calls in the same event handler into a single re-render.

```ts
const [email, setEmail] = useState('');
setEmail('user@example.com'); // triggers re-render with new value
```

### `useEffect(fn, deps)`
**From:** `react`
**Used in:** `AuthContext.tsx`

Runs a side effect after the component renders. The dependency array controls when:
- `[]` — once after initial render (mount)
- `[x, y]` — on mount AND whenever `x` or `y` changes
- no array — after every render (rarely wanted)

The return function is cleanup — runs before re-run and on unmount.

```ts
useEffect(() => {
  fetchUser(); // runs once on mount
}, []);
```

### `useCallback(fn, deps)`
**From:** `react`
**Used in:** `AuthContext.tsx`

Wraps a function so it keeps the same reference across re-renders, unless dependencies change. Without it, a new function is created every render, which can cause infinite loops when used as a `useEffect` dependency.

```ts
const fetchUser = useCallback(async () => {
  // ...
}, []); // same reference across renders
```

### `useContext(Context)`
**From:** `react`
**Used in:** `useAuth.ts`

Reads the current value from a React Context. The value comes from the nearest `<Context.Provider>` above in the component tree. Re-renders the component whenever the context value changes.

### `createContext(defaultValue)`
**From:** `react`
**Used in:** `AuthContext.tsx`

Creates a Context object for sharing state across the component tree without prop drilling:
- `<Context.Provider value={...}>` — wraps a subtree and provides a value
- `useContext(Context)` — reads the value from the nearest Provider

The default value is only used if no Provider exists above the component.

### `ReactNode`
**From:** `react` (TypeScript type)
**Used in:** `AuthContext.tsx`

Type representing anything React can render: elements, strings, numbers, booleans, null, arrays, or fragments. Used to type `children` props.

### `FormEvent`
**From:** `react` (TypeScript type)
**Used in:** `LoginPage.tsx`, `RegisterPage.tsx`

Type for the event object passed to form `onSubmit` handlers. Call `e.preventDefault()` to stop the browser's default form submission (which causes a full page reload).

---

## React Router DOM (react-router-dom)

### `BrowserRouter`
**Used in:** `App.tsx`

Wraps the app to enable client-side routing. Uses the browser's History API (`pushState`, `popstate`) to change the URL without a full page reload. All `<Route>`, `<Link>`, and `useNavigate()` must be inside a `<BrowserRouter>`.

### `Routes`
**Used in:** `App.tsx`

Container for `<Route>` elements. Evaluates all child routes and renders the first one whose `path` matches the current URL. Only one route renders at a time.

### `Route`
**Used in:** `App.tsx`

Maps a URL path to a component:
- `path` — URL pattern to match (`"/login"`, `"/"`, `"*"` for catch-all)
- `element` — React element to render when matched

```tsx
<Route path="/login" element={<LoginPage />} />
```

### `Navigate`
**Used in:** `App.tsx`, `ProtectedRoute.tsx`

Component that immediately redirects to another path when rendered. `replace` prop swaps the current history entry instead of pushing (so the back button skips the redirect).

```tsx
<Navigate to="/login" replace />
```

### `Link`
**Used in:** `LoginPage.tsx`, `RegisterPage.tsx`

Renders an `<a>` tag that does client-side navigation (no full page reload). Unlike a plain `<a href>`, it uses React Router so app state is preserved.

```tsx
<Link to="/register">Create account</Link>
```

### `useNavigate()`
**Used in:** `LoginPage.tsx`, `RegisterPage.tsx`

Returns a function for programmatic navigation. Used after async operations (e.g. redirect to dashboard after login). Unlike `<Navigate>`, this is called from event handlers, not rendered in JSX.

```ts
const navigate = useNavigate();
await login(email, password);
navigate('/'); // redirect to dashboard
```

---

## Axios (axios)

### `axios.create(config)`
**Used in:** `api/client.ts`

Creates a reusable Axios instance with default settings (baseURL, headers). All requests from the instance inherit those defaults, so you don't repeat `baseURL: '/api'` on every call.

```ts
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

### `api.get<T>(url)` / `api.post<T>(url, data)`
**Used in:** `api/auth.ts`

Makes an HTTP request. Returns `Promise<{ data: T, status, headers }>`. The `<T>` generic types the `data` field for TypeScript autocompletion — it does NOT validate the response shape at runtime.

```ts
const { data } = await api.post<TokenResponse>('/auth/login', { email, password });
// data is typed as TokenResponse
```

### `api.interceptors.request.use(fn)`
**Used in:** `api/client.ts`

Registers a function that runs before every outgoing request. Receives the request config and must return it. Used to auto-attach the JWT to the Authorization header.

```ts
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### `api.interceptors.response.use(onSuccess, onError)`
**Used in:** `api/client.ts`

Registers functions that run after every response:
- `onSuccess` — called on 2xx. We pass through unchanged.
- `onError` — called on non-2xx. Used to intercept 401 and auto-refresh the token before retrying the original request. This makes refresh transparent to the rest of the app.

---

## Vite (vite, @vitejs/plugin-react)

### `defineConfig`
**Used in:** `vite.config.ts`

Helper from Vite that provides TypeScript autocompletion for the config object. Functionally identical to exporting a plain object.

### `@vitejs/plugin-react`
**Used in:** `vite.config.ts`

Vite plugin that enables:
- **Fast Refresh** — hot module replacement that preserves component state during development
- **JSX transformation** — converts `<div>` syntax to React function calls
- **Auto React import** — you don't need `import React` in every file

### `server.proxy`
**Used in:** `vite.config.ts`

Development-only feature. Tells Vite's dev server to forward matching requests to another server. `'/api': { target: 'http://localhost:8080' }` means any request to `localhost:5173/api/...` is proxied to `localhost:8080/api/...`. This avoids CORS issues during development because the browser sees all requests going to the same origin. In production, you'd use a reverse proxy (nginx) instead.

---

## Browser APIs

### `localStorage`
**Used in:** `api/client.ts`, `AuthContext.tsx`

Browser-provided key-value storage that persists across page reloads, tab closes, and browser restarts. Data is stored per origin (protocol + domain + port).

- `setItem(key, value)` — stores a string
- `getItem(key)` — retrieves (or null if missing)
- `clear()` — removes all keys for this origin

Used to persist JWT tokens so the user stays logged in.

### `window.location.href`
**Used in:** `api/client.ts`

Setting this to a URL causes a full page reload and navigation. Used in the Axios response interceptor because at that point we're outside the React component tree and can't use `useNavigate()`. React Router's navigation preserves state; `window.location.href` destroys it.
