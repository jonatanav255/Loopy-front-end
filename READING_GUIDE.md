# Loopy Frontend — Reading Guide

> **How to read this React + TypeScript codebase in a logical order.**
> 74 source files organized by feature.

---

## Architecture at a Glance

```
main.tsx
  │
  ▼
App.tsx (BrowserRouter + Providers)
  │
  ├── AuthProvider (global auth state)
  ├── ToastProvider (notifications)
  │
  ▼
Routes
  │
  ├── Public:  LoginPage, RegisterPage
  └── Protected (ProtectedRoute wrapper):
      ├── DashboardPage
      ├── TopicsPage → TopicDetailPage → ConceptDetailPage
      ├── ReviewPage
      ├── TeachBackPage
      └── AIPage
```

Each page follows the same pattern:
```
Page → useCustomHook (state + API calls) → api/module.ts (Axios) → Backend
                                         → components/* (UI rendering)
```

---

## Layer Diagram

```
┌─────────────────────────────────────────┐
│  Pages (9)          — route-level views  │
├─────────────────────────────────────────┤
│  Components (32)    — UI building blocks │
├─────────────────────────────────────────┤
│  Hooks (8)          — state + logic      │
├─────────────────────────────────────────┤
│  Contexts (2)       — global state       │
├─────────────────────────────────────────┤
│  API (8 modules)    — HTTP via Axios     │
├─────────────────────────────────────────┤
│  Types (8)          — TypeScript DTOs    │
└─────────────────────────────────────────┘
```

---

## Reading Order

### Phase 1 — Entry & Config

| # | File | What you'll learn |
|---|------|-------------------|
| 1 | `index.html` | Mount point: `<div id="root">` |
| 2 | `main.tsx` | React entry: StrictMode → App |
| 3 | `vite.config.ts` | Dev server proxies `/api` → `localhost:8080` |
| 4 | `tailwind.config.js` | Custom dark theme color palette |
| 5 | `index.css` | Tailwind directives + CSS variables for dark theme |
| 6 | `package.json` | Dependencies: React 18, React Router 7, Axios, react-syntax-highlighter |

### Phase 2 — Types (Data Shapes)

Read all 8 type files first so you know what data flows through the app.

| # | File | Key types |
|---|------|-----------|
| 7 | `types/auth.ts` | TokenResponse, UserResponse, LoginRequest, RegisterRequest |
| 8 | `types/topic.ts` | TopicResponse (id, name, colorHex, cardCount), Create/UpdateTopicRequest |
| 9 | `types/concept.ts` | ConceptStatus enum (LEARNING→REVIEW→MASTERED↔TEACH_BACK_REQUIRED), ConceptResponse |
| 10 | `types/card.ts` | CardType enum (6 types), SchedulingAlgorithm enum (SM2/FSRS), CardResponse |
| 11 | `types/review.ts` | SubmitReviewRequest, ReviewResponse (includes updatedCard) |
| 12 | `types/stats.ts` | StatsOverview, HeatmapEntry, FragileCard |
| 13 | `types/teachback.ts` | SubmitTeachBackRequest, TeachBackResponse |
| 14 | `types/ai.ts` | GeneratedCard, TeachBackEvaluation (clarity/accuracy/completeness scores) |

### Phase 3 — API Layer (HTTP Communication)

Each module maps 1:1 to a backend controller.

| # | File | What you'll learn |
|---|------|-------------------|
| 15 | `api/client.ts` | **Read this first.** Axios instance with JWT interceptor + auto-refresh on 401 |
| 16 | `api/auth.ts` | register, login, refresh, logout, me |
| 17 | `api/topics.ts` | list, get, create, update, delete |
| 18 | `api/concepts.ts` | list (by topicId), get, create, update, delete |
| 19 | `api/cards.ts` | list (by conceptId), get, create, update, delete, switchAlgorithm |
| 20 | `api/reviews.ts` | getDueToday (with topic filtering), submit, getPracticeCards |
| 21 | `api/stats.ts` | overview, accuracy, heatmap, fragile |
| 22 | `api/teachback.ts` | getPending, submit, getHistory |
| 23 | `api/ai.ts` | status, generateCards, evaluateTeachBack |

### Phase 4 — Global State (Contexts)

| # | File | What you'll learn |
|---|------|-------------------|
| 24 | `contexts/AuthContext.tsx` | Auth state machine: token check on mount → fetch `/auth/me` → user object. Login/register/logout actions. localStorage vs sessionStorage ("remember me") |
| 25 | `contexts/ToastContext.tsx` | Toast notifications: addToast(message, type). Auto-dismiss after 3s |

### Phase 5 — Routing & Layout

| # | File | What you'll learn |
|---|------|-------------------|
| 26 | `App.tsx` | All routes defined here. AuthProvider + ToastProvider wrap everything. Public vs protected routes |
| 27 | `components/ui/ProtectedRoute.tsx` | Guards routes: loading spinner → redirect to /login if not authed |
| 28 | `components/layout/AppLayout.tsx` | Two-column: fixed Sidebar + scrollable main content |
| 29 | `components/layout/Sidebar.tsx` | Nav links (Dashboard, Topics, Review, Teach-Back, AI) + user info + logout |

### Phase 6 — Shared UI Components

| # | File | What you'll learn |
|---|------|-------------------|
| 30 | `components/ui/LoadingSpinner.tsx` | Reusable spinner |
| 31 | `components/ui/EmptyState.tsx` | Dashed-border empty placeholder with optional action button |
| 32 | `components/ui/ConfirmDialog.tsx` | Modal with confirm/cancel for destructive actions |
| 33 | `components/ui/Badge.tsx` | Colored pill labels (green, yellow, blue, red, etc.) |

### Phase 7 — Features (Hook → Page → Components)

Read each feature as a vertical slice: **hook** (logic) → **page** (orchestration) → **components** (UI).

---

#### 7a. Dashboard

| # | File | Role |
|---|------|------|
| 34 | `hooks/useStats.ts` | Fetches overview + heatmap + fragile in parallel (Promise.allSettled) |
| 35 | `pages/DashboardPage.tsx` | Renders stat cards, heatmap, fragile list. "Review X cards" CTA |
| 36 | `components/dashboard/StatsOverview.tsx` | 6-stat grid: due, reviewed, total, accuracy, streaks |
| 37 | `components/dashboard/Heatmap.tsx` | GitHub-style 365-day activity calendar |
| 38 | `components/dashboard/FragileCards.tsx` | Cards with high rating but low confidence |
| 39 | `components/dashboard/AccuracyChart.tsx` | Per-topic accuracy bars |

#### 7b. Topics & Concepts & Cards

| # | File | Role |
|---|------|------|
| 40 | `hooks/useTopics.ts` | CRUD state for topics |
| 41 | `hooks/useConcepts.ts` | CRUD state for concepts (filtered by topicId) |
| 42 | `hooks/useCards.ts` | CRUD state for cards (filtered by conceptId) + algorithm toggle |
| 43 | `pages/TopicsPage.tsx` | Topic grid + create/edit/delete |
| 44 | `pages/TopicDetailPage.tsx` | Concept list for a topic + create/edit/delete |
| 45 | `pages/ConceptDetailPage.tsx` | Card list for a concept + create/edit/delete |
| 46 | `components/topics/TopicCard.tsx` | Grid item: colored bar, name, card count |
| 47 | `components/topics/TopicForm.tsx` | Name + description + color picker (8 swatches) |
| 48 | `components/topics/ConceptList.tsx` | Concept rows with status badges |
| 49 | `components/topics/ConceptForm.tsx` | Title + notes + reference explanation |
| 50 | `components/cards/CardList.tsx` | Grid of CardItem components |
| 51 | `components/cards/CardItem.tsx` | Expandable card preview + algorithm badge + next review date |
| 52 | `components/cards/CardForm.tsx` | Type dropdown + front/back textareas + hint + source URL |
| 53 | `components/cards/CardRenderer.tsx` | Rich rendering: code blocks (syntax-highlighted), inline code, bold |
| 54 | `components/cards/AlgorithmToggle.tsx` | SM2 ↔ FSRS toggle button |

#### 7c. Review Session

| # | File | Role |
|---|------|------|
| 55 | `hooks/useReviewSession.ts` | **Most complex hook.** State machine: loading → front → back → confidence → done. Manages card queue, ratings, practice mode |
| 56 | `hooks/useKeyboard.ts` | Global keyboard shortcut listener (skips input/textarea focus) |
| 57 | `pages/ReviewPage.tsx` | Full-screen review experience. Topic multi-select → card flow → summary |
| 58 | `components/review/ReviewCard.tsx` | Card display with "Show Answer" |
| 59 | `components/review/RatingButtons.tsx` | 6 buttons (0-5): Again→Easy, keyboard 1-6 |
| 60 | `components/review/ConfidenceRating.tsx` | 3 buttons (1-3): Low/Medium/High, keyboard 1-3 |
| 61 | `components/review/ProgressBar.tsx` | X/Y progress with animated fill |
| 62 | `components/review/SessionSummary.tsx` | Results: total, passed, accuracy. Practice again or go home |

#### 7d. Teach-Back

| # | File | Role |
|---|------|------|
| 63 | `hooks/useTeachBack.ts` | Pending concepts + submit + history |
| 64 | `pages/TeachBackPage.tsx` | Multi-step flow: list → write → self-eval → results |
| 65 | `components/teachback/PendingList.tsx` | Clickable concept buttons |
| 66 | `components/teachback/TeachBackPrompt.tsx` | Textarea for explanation |
| 67 | `components/teachback/SelfEvalScreen.tsx` | Self-rating (1-5) + gaps textarea |
| 68 | `components/teachback/GapMarking.tsx` | Results summary: rating + gaps list |

#### 7e. AI Features

| # | File | Role |
|---|------|------|
| 69 | `hooks/useAI.ts` | AI availability check + generateCards + evaluateTeachBack |
| 70 | `pages/AIPage.tsx` | Two panels: card generation + teach-back evaluation |
| 71 | `components/ai/GenerateCardsPanel.tsx` | Topic → concept → paste content → generate |
| 72 | `components/ai/GeneratedCardPreview.tsx` | Preview + save individual or all cards |
| 73 | `components/ai/AIEvaluation.tsx` | 3-score display + feedback + gaps + follow-up questions |

### Phase 8 — Auth Pages

| # | File | What you'll learn |
|---|------|-------------------|
| 74 | `hooks/useAuth.ts` | Thin wrapper over AuthContext |
| 75 | `pages/LoginPage.tsx` | Email/password + "remember me" checkbox |
| 76 | `pages/RegisterPage.tsx` | Email/password/confirm + auto-login on success |

---

## Key Patterns to Notice

| Pattern | Where |
|---------|-------|
| **Hook-per-feature** | Each feature has a custom hook that owns its state + API calls |
| **API module per resource** | `api/topics.ts`, `api/cards.ts`, etc. — 1:1 with backend controllers |
| **Axios interceptors** | `api/client.ts` handles JWT attachment + 401 auto-refresh transparently |
| **Component composition** | Pages import hooks for logic + components for rendering — pages themselves have minimal JSX |
| **Keyboard shortcuts** | `useKeyboard` hook used in ReviewPage for rating (1-6) and confidence (1-3) |
| **Promise.allSettled** | `useStats` fetches multiple endpoints in parallel without one failure blocking others |
| **Dark theme only** | CSS variables in `index.css` — no light mode toggle |
| **CardRenderer** | Markdown-lite renderer: backtick code, triple-backtick blocks (syntax-highlighted), bold |

---

## How Frontend Talks to Backend

```
Frontend (port 5173)                    Backend (port 8080)
─────────────────                       ────────────────────
api/client.ts
  ├── baseURL: "/api"
  ├── Vite proxy: /api → localhost:8080  ──→  SecurityConfig
  ├── Request interceptor:                     JwtAuthFilter
  │     adds "Authorization: Bearer <jwt>"     validates token
  └── Response interceptor:                    Controller
        401 → try refresh token                  ↓
        still 401 → clear tokens, → /login     Service → Repository
```

**Token storage:**
- "Remember me" checked → `localStorage` (survives browser close)
- Not checked → `sessionStorage` (cleared on tab close)
