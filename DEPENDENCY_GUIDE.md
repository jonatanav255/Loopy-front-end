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
**Used in:** `AuthContext.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, `TopicsPage.tsx`, `TopicDetailPage.tsx`, `ConceptDetailPage.tsx`, `TeachBackPage.tsx`, `AIPage.tsx`, `TopicForm.tsx`, `ConceptForm.tsx`, `CardForm.tsx`, `CardItem.tsx`, `AlgorithmToggle.tsx`, `GenerateCardsPanel.tsx`, `GeneratedCardPreview.tsx`, `SelfEvalScreen.tsx`, `SearchPage.tsx`, `DataPortPage.tsx`, `useSearch.ts`, `useDataport.ts`

Returns a `[value, setter]` pair. The value persists across re-renders (unlike a regular variable which resets every render). Calling the setter triggers a re-render with the new value. React batches multiple setter calls in the same event handler into a single re-render.

```ts
const [email, setEmail] = useState('');
setEmail('user@example.com'); // triggers re-render with new value
```

### `useEffect(fn, deps)`
**From:** `react`
**Used in:** `AuthContext.tsx`, `TopicDetailPage.tsx`, `ConceptDetailPage.tsx`, `useTopics.ts`, `useConcepts.ts`, `useCards.ts`, `useStats.ts`, `useTeachBack.ts`, `useAI.ts`, `GenerateCardsPanel.tsx`, `SearchPage.tsx`

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
**Used in:** `AuthContext.tsx`, `useTopics.ts`, `useConcepts.ts`, `useCards.ts`, `useTeachBack.ts`, `useReviewSession.ts`, `ReviewPage.tsx`, `useSearch.ts`, `useDataport.ts`, `SearchPage.tsx`, `DataPortPage.tsx`

Wraps a function so it keeps the same reference across re-renders, unless dependencies change. Without it, a new function is created every render, which can cause infinite loops when used as a `useEffect` dependency.

```ts
const fetchUser = useCallback(async () => {
  // ...
}, []); // same reference across renders
```

### `useRef(initialValue)`
**From:** `react`
**Used in:** `useKeyboard.ts`

Returns a mutable ref object whose `.current` property persists across re-renders without triggering re-renders when changed. Used to hold the latest callback reference for event listeners, so the listener always calls the current handler without needing to re-register.

**Also used in:** `SearchPage.tsx` (input focus), `DataPortPage.tsx` (file input ref)

### `useMemo(fn, deps)`
**From:** `react`
**Used in:** `Heatmap.tsx`

Memoizes a computed value. The factory function `fn` only re-runs when dependencies change. Used for expensive computations (like building the 365-day heatmap grid) to avoid recalculating on every render.

### `useContext(Context)`
**From:** `react`
**Used in:** `useAuth.ts`, `ToastContext.tsx`

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
**Used in:** `LoginPage.tsx`, `RegisterPage.tsx`, `TopicForm.tsx`, `ConceptForm.tsx`, `CardForm.tsx`, `TeachBackPrompt.tsx`, `GenerateCardsPanel.tsx`

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

### `Outlet`
**From:** `react-router-dom`
**Used in:** `AppLayout.tsx`

Renders the child route's component inside a parent layout route. When a `<Route>` contains nested `<Route>` children, the parent's element renders `<Outlet />` to mark where child content appears. This enables shared layouts (sidebar, nav) across pages.

```tsx
<Route element={<AppLayout />}>        {/* layout route — renders sidebar + Outlet */}
  <Route index element={<DashboardPage />} /> {/* fills the Outlet */}
  <Route path="topics" element={<TopicsPage />} />
</Route>
```

### `Navigate`
**Used in:** `App.tsx`, `ProtectedRoute.tsx`

Component that immediately redirects to another path when rendered. `replace` prop swaps the current history entry instead of pushing (so the back button skips the redirect).

```tsx
<Navigate to="/login" replace />
```

### `NavLink`
**From:** `react-router-dom`
**Used in:** `Sidebar.tsx`

Like `<Link>` but adds active styling. Accepts a `className` prop that receives `{ isActive }` — a boolean indicating whether the link's `to` path matches the current URL. The `end` prop ensures exact matching (e.g., `/` only matches `/`, not `/topics`).

```tsx
<NavLink to="/topics" className={({ isActive }) => isActive ? 'active' : ''}>
```

### `useParams()`
**From:** `react-router-dom`
**Used in:** `TopicDetailPage.tsx`, `ConceptDetailPage.tsx`

Returns an object of URL parameters from the current route. Parameters are defined in the route path with `:paramName` syntax. All values are strings (or undefined if optional).

```tsx
// Route: /topics/:topicId
const { topicId } = useParams<{ topicId: string }>();
```

### `Link`
**Used in:** `LoginPage.tsx`, `RegisterPage.tsx`, `TopicCard.tsx`, `ConceptList.tsx`, `TopicDetailPage.tsx`, `ConceptDetailPage.tsx`, `DashboardPage.tsx`, `SearchPage.tsx`

Renders an `<a>` tag that does client-side navigation (no full page reload). Unlike a plain `<a href>`, it uses React Router so app state is preserved.

```tsx
<Link to="/register">Create account</Link>
```

### `useNavigate()`
**Used in:** `LoginPage.tsx`, `RegisterPage.tsx`, `ReviewPage.tsx`

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

### `api.get<T>(url)` / `api.post<T>(url, data)` / `api.put<T>(url, data)` / `api.delete(url)`
**Used in:** `api/auth.ts`, `api/topics.ts`, `api/concepts.ts`, `api/cards.ts`, `api/reviews.ts`, `api/stats.ts`, `api/teachback.ts`, `api/ai.ts`, `api/search.ts`, `api/dataport.ts`

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

---

## @dnd-kit (drag-and-drop)

### `DndContext`
**From:** `@dnd-kit/core`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

The root context provider for drag-and-drop. Wraps the area where dragging occurs. Accepts `sensors`, `collisionDetection`, and event handlers like `onDragEnd`.

### `closestCenter`
**From:** `@dnd-kit/core`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

A collision detection algorithm that finds the droppable element whose center is closest to the pointer. Works well for grids and lists.

### `PointerSensor`
**From:** `@dnd-kit/core`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

Detects drag starts from mouse/touch pointer events. `activationConstraint: { distance: 8 }` prevents accidental drags by requiring 8px of movement first.

### `KeyboardSensor`
**From:** `@dnd-kit/core`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

Allows drag-and-drop via keyboard (arrow keys + Enter). Used with `sortableKeyboardCoordinates` for accessible reordering.

### `useSensor` / `useSensors`
**From:** `@dnd-kit/core`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

`useSensor` configures a single sensor with options. `useSensors` combines multiple sensors (pointer + keyboard) into a single array for `DndContext`.

### `SortableContext`
**From:** `@dnd-kit/sortable`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

Provides the sortable context for a list of items. Takes an `items` array of IDs and a `strategy` (layout algorithm). Each child must use `useSortable` with a matching ID.

### `useSortable`
**From:** `@dnd-kit/sortable`
**Used in:** `SortableTopicCard.tsx`, `SortableConceptItem.tsx`

Hook that makes an element draggable and droppable within a `SortableContext`. Returns `attributes`, `listeners` (spread onto the drag handle), `setNodeRef`, `transform`, `transition`, and `isDragging`.

### `rectSortingStrategy` / `verticalListSortingStrategy`
**From:** `@dnd-kit/sortable`
**Used in:** `TopicsPage.tsx` (rect), `ConceptList.tsx` (vertical)

Sorting strategies that tell dnd-kit how items are laid out. `rectSortingStrategy` works for grid layouts; `verticalListSortingStrategy` works for vertical lists.

### `sortableKeyboardCoordinates`
**From:** `@dnd-kit/sortable`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

Coordinate getter for `KeyboardSensor` that maps arrow keys to the correct movement direction based on the current sorting strategy.

### `arrayMove`
**From:** `@dnd-kit/sortable`
**Used in:** `TopicsPage.tsx`, `ConceptList.tsx`

Utility that returns a new array with an element moved from one index to another. Used in `onDragEnd` to compute the new order after a drag.

### `CSS.Transform.toString`
**From:** `@dnd-kit/utilities`
**Used in:** `SortableTopicCard.tsx`, `SortableConceptItem.tsx`

Converts a `Transform` object (from `useSortable`) into a CSS `transform` string (e.g. `translate3d(0px, 50px, 0)`). Applied as an inline style to animate the dragged element.

---

## React Syntax Highlighter (react-syntax-highlighter)

### `SyntaxHighlighter` (Prism)
**From:** `react-syntax-highlighter/dist/esm/prism`
**Used in:** `CardRenderer.tsx`

React component that renders syntax-highlighted code blocks. Wraps Prism.js for language detection and tokenization. Accepts `language` (e.g. `"javascript"`, `"python"`) and `style` props for theming. Renders a `<pre>` element with colored spans for each token.

### `vscDarkPlus`
**From:** `react-syntax-highlighter/dist/esm/styles/prism`
**Used in:** `CardRenderer.tsx`

VS Code Dark+ theme for Prism-based syntax highlighting. A style object mapping token types (keyword, string, comment, etc.) to CSS properties. Provides a dark background with colored syntax tokens matching the VS Code Dark+ color scheme.

---

## Browser APIs (additional)

### `URL.createObjectURL(blob)` / `URL.revokeObjectURL(url)`
**Used in:** `DataPortPage.tsx`

Creates a temporary URL pointing to a `Blob` in memory. Used to trigger a file download by creating a `<a>` element with this URL and programmatically clicking it. `revokeObjectURL` releases the memory when done.

### `Blob`
**Used in:** `DataPortPage.tsx`

Represents raw binary data. Created with `new Blob([content], { type })`. Used to convert the JSON export string into a downloadable file.

### `File.prototype.text()`
**Used in:** `DataPortPage.tsx`

Reads the entire contents of a `File` object as a UTF-8 string. Returns a `Promise<string>`. Used to read the uploaded JSON import file.

---

## vitest-axe (accessibility testing)

### `axe(container, options?)`
**From:** `vitest-axe`
**Used in:** `components/__tests__/accessibility.test.tsx`, `pages/__tests__/accessibility.test.tsx`

Runs axe-core accessibility analysis on a rendered DOM container. Returns `Promise<AxeResults>` with violations, passes, and incomplete checks. Used with `expect(results).toHaveNoViolations()` to assert WCAG compliance. Accepts an optional `options` parameter to enable/disable specific rules.

```ts
const results = await axe(container);
expect(results).toHaveNoViolations();
```

### `configureAxe(options)`
**From:** `vitest-axe`
**Used in:** `components/__tests__/accessibility.test.tsx`, `pages/__tests__/accessibility.test.tsx`

Creates a configured axe runner with default options (e.g., disabling specific rules globally). Returns a function with the same signature as `axe()`. Used to skip known issues (like color-contrast in jsdom) while still testing other accessibility aspects.

```ts
const axeNoColor = configureAxe({ rules: { 'color-contrast': { enabled: false } } });
const results = await axeNoColor(container);
```

### `toHaveNoViolations`
**From:** `vitest-axe/matchers`
**Used in:** `test/setup.ts` (registered globally)

Custom Vitest matcher that asserts an axe-core result has zero violations. Provides detailed error messages listing each violation, the affected HTML elements, and links to WCAG documentation. Registered via `expect.extend(matchers)` in the test setup file.

### `vitest-axe/extend-expect`
**From:** `vitest-axe`
**Used in:** `test/setup.ts`

Type augmentation import that adds `toHaveNoViolations` to Vitest's `expect` TypeScript types. Must be imported in the setup file for proper type checking.
