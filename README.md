# BNI Payment Dashboard

Membership & payment management dashboard for BNI Indonesia, built with **Vite + React + TypeScript** and organised with **Clean Architecture**.

> Migrated from Next.js (App Router) to a Vite SPA. Routing is handled by React Router; all data currently comes from in-memory mock repositories behind domain interfaces, so swapping in a real API touches only the infrastructure layer.

## Getting Started

```bash
npm install
npm run dev      # start Vite dev server at http://localhost:3000
```

Other scripts:

```bash
npm run build      # type-check (tsc --noEmit) then production build (vite build)
npm run preview    # preview the production build
npm run typecheck  # type-check only
npm run lint       # eslint
```

## Tech Stack

- **Vite 5** + **React 18** + **TypeScript** (strict)
- **React Router 6** for client-side routing
- **Tailwind CSS 3** for styling (BNI brand colours in `tailwind.config.ts`)
- **Recharts** for the payment-status donut chart
- **lucide-react** for icons

## Architecture

The code follows Clean Architecture. Dependencies point **inward** only — outer
layers depend on inner layers, never the reverse.

```
┌─────────────────────────────────────────────────────────┐
│ presentation/   React: pages, components, hooks, router   │  → depends on application + domain
├─────────────────────────────────────────────────────────┤
│ application/    use cases (one responsibility each)       │  → depends on domain
├─────────────────────────────────────────────────────────┤
│ domain/         entities, repository & service interfaces │  → depends on nothing
├─────────────────────────────────────────────────────────┤
│ infrastructure/ in-memory repositories + mock data        │  → implements domain interfaces
└─────────────────────────────────────────────────────────┘
                  di/  composition root wires it all together
```

```
src/
├── domain/                 # Enterprise rules — pure, framework-free
│   ├── entities/           #   Member, Payment, Subscription, MasterData, ImportRecord
│   ├── repositories/       #   repository interfaces (ports)
│   └── services/           #   NotificationService interface (port)
├── application/            # Application rules — use cases + DTOs
│   ├── dto/
│   └── use-cases/          #   GetDashboardOverview, GetPaymentsByCategory, ...
├── infrastructure/         # Frameworks & drivers — implementation details
│   ├── data/               #   mock seed data
│   ├── repositories/       #   InMemory* adapters implementing the ports
│   └── services/           #   MockNotificationService (simulated send)
├── di/
│   └── container.ts        # composition root: wires adapters → use cases
└── presentation/           # UI (React)
    ├── App.tsx             #   route tree
    ├── providers/          #   ServicesProvider (exposes use cases via context)
    ├── hooks/              #   useAsync (loading/error/data)
    ├── layouts/            #   DashboardLayout (sidebar + topbar + <Outlet/>)
    ├── components/         #   ui/ (Modal, StatCard, ...), layout/, dashboard/, members/
    ├── pages/              #   one folder per feature area
    ├── config/             #   navigation + icon registry
    └── utils/              #   formatters
```

### Key ideas

- **Ports & adapters.** The presentation/application layers depend on interfaces
  in `domain/repositories` and `domain/services`. Concrete `InMemory*` adapters
  live in `infrastructure/`. To move to a real backend, add e.g. `HttpMemberRepository`
  and swap it in `di/container.ts` — no use case or component changes.
- **Use cases** encapsulate one piece of application logic (`GetPaymentsByCategory`
  also knows that the "renewal" bucket is derived from members, not payments).
- **Dependency injection** happens once in `createServices()` and is exposed to
  React through `ServicesProvider` / `useServices()`. The provider accepts an
  optional `services` override, which makes the UI trivial to test with fakes.

## Notable changes vs. the original

- Migrated Next.js App Router → Vite + React Router.
- Fixed a build-breaking JSX corruption (`003e` tokens) on the Lark page.
- Single dashboard route (removed the duplicate, drifted `/dashboard` copy).
- Extracted the send-confirmation + success modals that were copy-pasted across
  the four payment pages into shared, accessible components.
- The four payment pages collapse into one config-driven `PaymentCategoryPage`.
- Accessible modals (role/aria, Escape, focus trap, scroll lock, focus restore).
- Replaced the unused Geist font wiring with a single Inter font (loaded in `index.html`).
- All mock data moved out of the UI into `infrastructure/data` behind repositories.
