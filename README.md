# Dino Top Trumps UI

React frontend for an online multiplayer dinosaur card game with a dark prehistoric theme, league point ranking, social features, and an educational quiz.

**Live App:** https://dino-top-trumps-ui.onrender.com
**Backend API:** https://dino-top-trumps-api.onrender.com
**Backend Repo:** https://github.com/Josh-WrightADA/dino-top-trumps-api

> **Note for assessors:** Render free tier may take ~30 seconds to serve the frontend. The backend JVM takes ~2 minutes to cold start on the first API call. Hit the live URL and wait for the page to load before testing. Registration is open, and seed test accounts exist on the backend. The admin panel is demonstrated in the video.

---

## About This Project

This is the frontend for Dino Top Trumps, a competitive multiplayer card game where players battle using dinosaur stats. I chose React because it's the framework used in the module, it felt like the industry standard, and I have some past experience with it.

The frontend communicates exclusively with the Spring Boot REST API. It never touches the database directly. All game logic, authentication, and validation happen server-side. The frontend handles presentation, user interaction, and polling for game state updates.

I put significant effort into the visual design. The app started with no theming at all, just raw functionality. Once the features were working, I did a design pass by looking at other sites in the competitive gaming space and the dark prehistoric aesthetic grew from there. The cards are the visual hero of the application, and the pre-game ceremony flowing into the game board is the part I'm most proud of on the frontend.

![Home page hero with floating card fan and amber CTA](https://res.cloudinary.com/djnj9zlw3/image/upload/v1774730393/Homepagehero_pjiokd.png)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Key Technical Decisions](#key-technical-decisions)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)
- [Known Limitations and Future Improvements](#known-limitations-and-future-improvements)

---

## Features

**Authentication:** Registration, login, JWT token management, password reset via email, profile editing (display name, bio, favourite dinosaur), avatar upload and dino portrait picker, password change, account deletion with password confirmation. Users can customise their profile with either a custom photo upload (stored on Cloudinary) or by choosing from the dinosaur portrait gallery.

**Game:** Lobby with live game list, game creation and joining, pre-game ceremony (opponent reveal, animated coin flip, countdown), turn-based gameplay with stat selection, 30-second turn timer with urgency states, draw pile accumulation on ties, game over with LP/rank display.

![Game board with side-by-side card and stat selector layout](https://res.cloudinary.com/djnj9zlw3/image/upload/v1774730393/gameboard_ns11q1.png)

**Social:** Friends system (add, accept, decline, remove), game invites with 5-minute expiry, user reports, public player profiles accessible from the leaderboard.

**Discovery:** Card gallery with 36 dinosaur cards, detail modal with stats and fun facts, educational quiz (10 rounds, optional hints, rank titles based on score).

![Card gallery showing dinosaur cards with stat bars and diet tags](https://res.cloudinary.com/djnj9zlw3/image/upload/v1774730393/gallery_u5n9z0.png)

**Admin:** User management (ban/unban), game management (delete), report review (dismiss). Protected by a role-based route guard.

**Ranking:** Leaderboard with tier badges, gold/silver/bronze top-3 distinction, LP and tier progression explained on the How to Play page.

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19 |
| Build tool | Vite | 7 |
| Routing | React Router | 7 |
| HTTP client | Axios | 1.x |
| Testing | Vitest + Testing Library | 4.1 |
| Linting | ESLint | 9 |
| Coverage | @vitest/coverage-v8 | - |
| CSS methodology | BEM + CSS custom properties | - |
| Deployment | Render (static site) | - |
| CI | GitHub Actions | - |

I chose npm over yarn because it's what I'm familiar with and the CI uses `npm ci` for deterministic installs. I didn't use a CSS framework like Tailwind or Bootstrap because I wanted full control over the visual design. The custom property system gives me the same consistency benefits with more flexibility over the final look.

---

## Getting Started

### Prerequisites

- Node 22 (I recommend nvm for version management)
- npm (not yarn)
- Backend API running locally or on Render

### Local Setup

```bash
# Clone
git clone https://github.com/Josh-WrightADA/dino-top-trumps-ui.git
cd dino-top-trumps-ui

# Install dependencies
npm install

# Start dev server
npm run dev

# App available at http://localhost:5173
```

The app expects the backend API at `http://localhost:8080` by default. To point to a different URL, create a `.env` file:

```
VITE_API_URL=http://localhost:8080
```

A `.env.example` file is included in the repo.

---

<details>
<summary><strong>Project Structure</strong> (click to expand)</summary>

```
src/
  api/                    Axios client with JWT interceptor
    authApi.js            Auth endpoints (register, login, profile, avatar)
    gameApi.js            Game endpoints (create, join, turns, history)
    socialApi.js          Friends, invites, reports
    adminApi.js           Admin endpoints (users, games, reports)
    axiosClient.js        Base instance with token injection and error handling

  components/
    admin/                UsersTab, GamesTab, ReportsTab
    auth/                 LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, PasswordField
    game/                 GameBoard, WaitingForOpponent, DinoCard, CardStats, StatSelector,
                          TurnResult, TurnTimer, GameOver, PreGameCeremony, GameLobby,
                          CardDetailModal
    history/              MatchHistory
    layout/               Navbar, ErrorBoundary, ProtectedRoute
    leaderboard/          Leaderboard
    profile/              AvatarSection, AvatarPicker, ProfileInfoSection, SecuritySection,
                          PlayerStatsCard
    quiz/                 QuizGame, QuizQuestion, QuizSummary, quizLogic
    rank/                 RankBadge
    shared/               LoadingSpinner, ErrorMessage, Pagination, Avatar

  constants/              rankTiers, defaultAvatars, statOrder
  context/                AuthProvider (JWT token management)
  hooks/                  useAuth, useCards, useGameBoard, usePolling
  pages/                  21 route-level page components
  test/                   Setup, render helpers, mock fixtures
  utils/                  formatWinRate, shuffleArray, extractErrorMessage
  index.css               Design system (90+ CSS custom properties)
```

Each component has its own co-located CSS file. The `.btn` utility and design tokens live in `index.css` as global utilities.

</details>

---

## Design System

The frontend uses a custom CSS design system built on **CSS custom properties** with **BEM naming** throughout.

**90+ design tokens** in `index.css` covering colours (amber accent palette with 10 opacity variants), typography (Cinzel for display headings, Inter for body, JetBrains Mono for stats), a 4px spacing grid, shadows, gradients, filters, border radii, transitions, and aspect ratios.

**Global utility classes** in `index.css`: `.btn` and variants for buttons, `.page-heading` and `.section-heading` for consistent heading treatment, `.card--hoverable` and `.avatar--glow` for interactive effects, `.visually-hidden` for accessible hidden content.

**Animations** are CSS-only with no JavaScript animation libraries: `fade-in-up` and `reveal-enter` for page transitions, a 3D coin flip (`rotateY(1080deg)`) for the pre-game ceremony, holographic sheen sweep on card hover, and an auto-dismiss progress bar on turn results.

I chose CSS custom properties over Sass because they work at runtime and don't need a build step. I chose BEM over CSS Modules or Styled Components because the specificity model is explicit and framework-agnostic.

<details>
<summary><strong>Design approach</strong> (click to expand)</summary>

The visual direction is a dark prehistoric theme with amber/gold as the primary accent. I built it by looking at competitive gaming sites and adapting their patterns for a card game. Every page has atmospheric depth through radial vignettes and gradient backgrounds.

Key principles I followed:
- **Cards are the hero.** They appear on the home page, game board, gallery, and quiz. Every card context uses the correct aspect ratio for the 572x1024 images to avoid cropping.
- **No inline styles.** All styling is in CSS files with BEM classes and design tokens.
- **Global selectors are minimal.** The `button` and heading resets are opt-in via utility classes. I learned this the hard way after a global button reset caused style bleed across the entire app.
- **Co-located CSS.** Each component imports its own CSS file. I split a 1597-line monolithic `Game.css` into 13 component-level files during the modularity refactor.
- **Scaling card images was the hardest frontend challenge.** I went through several iterations of `object-fit: contain` vs `cover`, different aspect ratios, and vignette overlays before landing on matching the container ratio to the actual image dimensions (572x1024). The lesson was that fighting the image's natural ratio always results in either cropping or dead space.

</details>

---

## Key Technical Decisions

### Component Architecture
- **Pages own layout, components own rendering, hooks own data.** Pages are thin route-level wrappers. Components handle their own rendering and CSS. Custom hooks encapsulate side effects.
- **GameBoard decomposition:** The original was 335 lines handling polling, card cache, turn detection, ceremony gating, friend invites, and three different UI branches. I extracted `useGameBoard` (102 lines) for state/data and `WaitingForOpponent` (88 lines) for the waiting state, reducing GameBoard to 174 lines.
- **AdminPage decomposition:** 295 lines with 3 inline tab components became a 32-line orchestrator importing `UsersTab`, `GamesTab`, `ReportsTab` from `components/admin/`.
- **ProtectedRoute with `requiredRole`:** A reusable route guard that checks both authentication and optional role. Non-admin users get redirected to `/lobby`.

### State Management
- **React Context for auth only.** `AuthProvider` manages JWT token storage, user state, login/logout, and profile refresh. Everything else uses local component state.
- **No Redux or Zustand.** The application state is simple enough that React's built-in tools handle it. Game state comes from server polling, not client-side stores.
- **`usePolling` custom hook:** Encapsulates the poll-every-N-seconds pattern with pause/resume. Used by the game board and lobby.

### Shared Components and Utilities (DRY)
During the code quality pass I identified and extracted several patterns that were duplicated across the codebase:

- **`PasswordField`:** Extracted from 7 copy-pasted password toggle blocks across 4 files. Manages its own show/hide state.
- **`Avatar`:** Replaced the conditional image-or-placeholder pattern in 5 files.
- **`CardStats`:** Shared stat bar rendering for DinoCard and CardDetailModal, fixing a BEM coupling issue where the modal was using DinoCard's CSS classes directly.
- **`PlayerStatsCard`:** Deduplicated the stats grid from ProfilePage and PlayerProfilePage.
- **`Pagination`:** Extracted from duplicate markup in Leaderboard and MatchHistory.
- **`useCards` hook:** Replaced duplicate fetch-cards-then-set-state in CardsPage and QuizPage.
- **`formatWinRate`:** Replaced identical calculation in 3 files.
- **`extractErrorMessage`:** Replaced the `err.response?.data?.detail || fallback` pattern in 15 files.
- **`shuffleArray`:** Fisher-Yates shuffle extracted from quiz logic, also fixing a biased `Array.sort` shuffle on the home page.

### Quiz
The quiz is intentionally frontend-only. It uses the existing cards endpoint but does no state mutation and no persistence. Quiz scores are session-local because the quiz is educational, not competitive. The pure logic extraction into `quizLogic.js` means scoring and question generation are testable without rendering components.

<details>
<summary><strong>Accessibility</strong> (click to expand)</summary>

- `role="status"` and `aria-live="polite"` on LoadingSpinner (used site-wide)
- `role="alert"` on error messages, GameOver, TurnResult outcomes, and quiz feedback
- `aria-live` on TurnTimer and PreGameCeremony stage transitions
- Escape key support on modals
- `.visually-hidden` utility class for screen-reader-only content
- Semantic HTML (no `<button>` inside `<a>` anti-pattern)
- Image `onError` fallbacks on DinoCard and TurnResult
- Descriptive `alt` text on navbar avatar and brand logo
- Clipboard "Copied!" feedback on game ID copy

</details>

---

## Testing Strategy

**195 tests** across 31 test files, all co-located next to their components.

- **Auth critical path:** LoginForm (6), RegisterForm (5), ForgotPasswordForm (4), ResetPasswordForm (5), AuthProvider (5), PasswordField (5)
- **Game components:** GameBoard hook (4), DinoCard, PreGameCeremony, TurnResult, GameOver, StatSelector, TurnTimer, CardDetailModal
- **Shared:** Pagination (6), Avatar, ErrorMessage
- **Quiz:** quizLogic pure function tests (shuffle, scoring, rank titles)
- **Hooks:** useCards (4), useGameBoard (4), usePolling (9)
- **Utilities:** formatWinRate (7), shuffleArray (6), extractErrorMessage (7)
- **Pages:** HomePage, AdminPage, FriendsPage, Navbar (5 tests including hamburger toggle)

**Run:** `npx vitest run`
**Coverage:** `npx vitest run --coverage` (CI uploads report as artifact)
**Lint:** `npx eslint src/ --max-warnings 0 --ignore-pattern "src/context/**"`
**Build:** `npm run build`

<details>
<summary><strong>Mocking patterns</strong> (click to expand)</summary>

- `vi.mock` for `useAuth` with mutable `mockIsAuthenticated` variable
- API calls mocked with `Promise.resolve({ data: mockData })`
- IntersectionObserver mock using class constructor (not `vi.fn()`)
- `globalThis` for mocks (ESLint `no-undef` rule)
- `waitFor` for async API-dependent rendering
- Shared `renderWithRouter` helper and `mockFixtures` for consistent test data

</details>

---

## Deployment

**Platform:** Render (static site), auto-deploys from `main`.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA routing:** Render rewrite rule `/* -> /index.html` (status 200) so React Router handles all client-side routes
- **Environment variable:** `VITE_API_URL` points to the backend Render URL
- **Bundle size:** ~78KB CSS, ~350KB JS (gzipped: ~12KB + ~107KB)

<details>
<summary><strong>CI/CD Pipeline</strong> (click to expand)</summary>

GitHub Actions runs on every push to `main` and every pull request:

1. Checkout code
2. Setup Node 22 with npm cache
3. `npm ci` (deterministic install)
4. Install coverage provider (`@vitest/coverage-v8`)
5. Lint with zero warnings
6. Run tests with coverage
7. Build production bundle
8. Upload coverage report as artifact

</details>

---

## External Services

The frontend doesn't call external services directly. All integrations (SendGrid, Cloudinary, PostgreSQL) go through the backend API. The frontend loads:

- **Backend REST API** at `VITE_API_URL` for all data operations
- **Cloudinary CDN** for card images and avatars (URLs returned by the API, loaded as standard `<img>` elements)

All 36 card images, 5 rank badge icons, 11 profile portraits, and the brand assets (claw mark logo, feature icons) were generated using Google Gemini's Nano Banana custom Gem tool. The generation required significant iteration for consistency across the full deck, dealing with style drift, context poisoning between sessions, and getting scale accuracy right for different dinosaur species. The images are hosted on Cloudinary and referenced by URL.

---

## Known Limitations and Future Improvements

| What | Current Approach | What I'd Improve |
|------|-----------------|-----------------|
| **Game state polling** | `usePolling` fetches every 3 seconds | WebSockets or Server-Sent Events for real-time updates |
| **Client-side pagination** | All results fetched, paginated in React | Server-side pagination with `?page=0&size=10` |
| **Quiz scores not persisted** | Session-local only | Backend endpoint for quiz high scores |
| **Cross-component CSS imports** | Some components import CSS from sibling directories | Move shared styles to a dedicated utility layer |
| **No offline support** | Requires network connectivity | Service worker with cache-first for static assets |
| **No mobile optimisation** | Desktop-focused design with responsive breakpoints at 768px and 480px | Full mobile testing and touch-optimised interactions |
| **Lobby-based matchmaking** | Players manually create/join games from a lobby list | Automated matchmaking queue that pairs players by rank tier, similar to competitive games |

---

## Use of Generative AI

I used generative AI tools throughout this project as development aids. All output was reviewed, tested, and integrated by me. I understand every piece of code in both repositories and can explain any implementation decision.

### Image Generation

All visual assets were created using Google Gemini with a custom Nano Banana Gem:
- 36 dinosaur card images (572x1024, consistent art style across the full deck)
- 5 rank tier badge icons
- 11 dinosaur profile portraits
- Brand assets (claw mark logo, feature panel icons)

The generation process required significant iteration. I dealt with style drift between sessions, context poisoning where the model would forget the established style, and scale accuracy issues for different dinosaur species. Each image was individually reviewed and several were regenerated multiple times.

### Development Assistance

I used AI-assisted development tools for the following areas. In each case I directed what needed to be done, reviewed the output, ran tests, and made the final decisions:

- **Research and learning:** Investigating industry patterns for hexagonal architecture, BEM methodology, ELO rating systems, RFC 7807 error standards, JWT authentication flows, and competitive game design patterns
- **Scaffolding and boilerplate:** Initial project structure, repetitive adapter/mapper patterns, and configuration files where the pattern was already established elsewhere in the codebase
- **Educational guidance:** The tool was configured in a learning mode that created structured TODOs for me to implement, rather than generating complete solutions. This guided me through concepts like port/adapter wiring, domain model behaviour methods, and test architecture
- **Code quality auditing:** Systematic reviews against DRY, KISS, SOLID, and BEM principles. This identified issues like duplicated password toggle patterns, cross-component CSS coupling, and missing transaction boundaries that I then fixed
- **Refactoring suggestions:** Identifying extraction candidates (PasswordField, Avatar, CardStats, PlayerStatsCard, shared utilities) and architectural improvements (GameBoard decomposition, Game.css split, AdminPage tab extraction)
- **Test coverage analysis:** Identifying untested critical paths (auth module had zero frontend tests) and reviewing test quality across both repositories
- **Debugging support:** Investigating FK cascade failures during user testing, card image scaling issues, CSS specificity conflicts from global selectors, and race conditions in concurrent game state updates
- **Documentation structure:** README organisation, Mermaid diagram design, and ensuring rubric criteria were naturally addressed in the documentation
- **Deployment and infrastructure:** Render configuration, Docker setup, CI/CD pipeline design, health check configuration, and environment variable management
- **CSS design system:** Token definitions, utility class patterns, and the approach to the design pass (studying competitive gaming sites for visual direction)
- **Feature suggestions:** Ideas for additional features like profanity filtering, correlation IDs, security audit logging, rate limiting, and the card quiz mini-game, which I then evaluated, prioritised, and implemented

### What I did independently

- All game design decisions (Top Trumps rules, draw pile mechanics, tier system, stat balancing)
- The visual design direction (dark prehistoric theme, amber accent palette, card-as-hero principle)
- Manually balancing all 36 dinosaur stat values for competitive gameplay
- Curating educational fun facts for each card
- Configuring and wiring external services (SendGrid account setup, Cloudinary account and image management, Render deployment configuration for both repos)
- User testing with real testers on the live deployment, interpreting feedback, and prioritising fixes
- All final decisions on architecture, features, and trade-offs documented in the Known Limitations sections

