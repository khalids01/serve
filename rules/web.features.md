# Web Features Architecture

This project uses a feature-first structure under `src/`.

- __Feature modules__: `src/features/<feature>/`
  - __components__: UI components specific to the feature
  - __hooks__: React hooks for the feature
  - __types__: TypeScript types and schemas for the feature
- __Core reusable components__: `src/components/core/`
  - Cross-cutting components (e.g., theme provider, user menu, toggles)
- __UI primitives__: `src/components/ui/`
  - Headless or low-level, reusable across features
- __App routes__: `src/app/`
  - Only minimal route shell (layout/page) code. Delegate logic/UI to `features/` or `components/core/`
- __Lib and hooks__: `src/lib/`, `src/hooks/`
  - Generic helpers and hooks not bound to a single feature

## Conventions

- __Paths__: `@/*` maps to `./src/*`. Prefer `@/` for imports. `@/src/*` is kept temporarily for backward compatibility during migration.
- __Do in route files only__:
  - minimal compositions, page metadata, and feature component mounting
- __Do in features__:
  - page-specific UI, business logic hooks, and feature types
- __Do in components/core__:
  - UI used by multiple routes/features
- __Do in ui__:
  - primitive components (buttons, inputs, sidebar, etc.)

## Example

- `src/app/admin/layout.tsx` uses:
  - `@/features/admin/components/sidebar-nav`
  - `@/components/core/mode-toggle`
  - `@/components/core/user-menu`
- `src/app/admin/page.tsx` uses:
  - `@/features/admin/components/dashboard-overview`

## Adding a new feature

1. Create `src/features/<feature>/components`, `hooks`, and `types`.
2. Implement feature UI in `components`.
3. Implement logic in `hooks`.
4. Export types from `types`.
5. In `src/app/...`, import and render the feature components.

## Cleanup

- Old reusable components should be moved into `src/components/core/` and removed from other locations to avoid duplication.
- Prefer `@/` imports. Avoid deep relative paths.
