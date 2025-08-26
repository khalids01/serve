# Frontend CRUD Rules (Web)

Scope: Use this rule to scaffold new admin CRUD features in `apps/web` following the Category implementation.

- Reference implementation: `apps/web/src/features/admin/category/`
- Shared utilities: `@/lib/api`, `@/constants/endpoints`, `@/constants/queryKeys`
- UI: shadcn/ui components
- Data: TanStack Query

## Directory and Files
Create a feature directory: `apps/web/src/features/admin/<entity>/` with:
- `useAdmin<Entity>.ts` — all data fetching/mutations with React Query
- `<Entity>Form.tsx` — create/update form (client component)
- `<Entity>Modal.tsx` — dialog wrapper for the form
- `<Entity>Table.tsx` — list table
- `<Entities>Client.tsx` — filters, pagination, table and modals orchestration
- `type.d.ts` — types for responses, inputs, queries
- `schema.ts` — optional form schema/types
- Optional relation inputs (e.g., `SelectCategory.tsx`)

## Conventions
- Add endpoint path in `@/constants/endpoints.ts`:
  - `endpoints.<entity> = "/<entities>"`
- Add query key in `@/constants/queryKeys.ts`:
  - `queryKeys.<entity>.admin = "admin.<entity>"`
- Use `api()` from `@/lib/api` for HTTP. Base URL = `NEXT_PUBLIC_BASE_URL`.
- Use shadcn `Select`, `Input`, `Button`, `Checkbox`, `Dialog`, etc.
- Label spacing: add `className="mb-2 block"` to every `<Label>`.

## Types (type.d.ts)
Define types that mirror server DTOs:
- `export type <Entity> = { id: number; ... }`
- `export type <Entity>Response = <Entity> & { /* relations */ }`
- `export type <Entity>ListResponse = { data: <Entity>Response[]; total: number; page: number; limit: number }`
- `export type Create<Entity>Input = { ... }`
- `export type Update<Entity>Input = Partial<Create<Entity>Input>`
- `export type List<Entities>Query = { q?: string; page?: number; limit?: number; /* filters */ }`

## Data Hook (useAdmin<Entity>.ts)
Expose React Query resources and mutations:
- `listQuery` GET `endpoints.<entity>`
  - `queryKey: [queryKeys.<entity>.admin, "list", ...filters]`
  - Filters managed via `useObject<List<Entities>Query>()`
- `singleQuery` GET `endpoints.<entity>/:id`
- `createMutation` POST `endpoints.<entity>`
- `updateMutation` PATCH `endpoints.<entity>/:id`
- `deleteMutation` DELETE `endpoints.<entity>/:id`
- Invalidate: list after create/update/delete; single after update
- Toast messages on success/error like Category

## Form (<Entity>Form.tsx)
- Local state via `useObject<...FormValues>(defaults)`
- Map server response to form values (`map<Entity>ToFormValues()`)
- Normalize to API input (`to<Entity>Input()`):
  - trim strings, convert empty to `undefined`
  - `null` -> `undefined` for optional numeric fields
- `onSubmit`:
  - update: `updateMutation.mutate({ id, data: toInput(values) })`
  - create: `createMutation.mutate(toInput(values))`
- `onReset` restores fetched values (update) or defaults (create)
- Use shadcn `Select` for dropdowns. For empty value in Radix Select, use a sentinel (e.g., `"none"`).
- For relations, create reusable selectors (e.g., `SelectCategory`) with props:
  - `value`, `onChange`, `label?`, `placeholder?`, `errormsg?`
  - Show red border/text on error

## Modal (<Entity>Modal.tsx)
- Wrap form with `Dialog` and pass `isUpdate`, `id`, `initialValues`, `onSuccess`.

## Table (<Entity>Table.tsx)
- Stateless table with props: `data`, `loading`, `onEdit`, `onView`, `onDelete`, and optional `onToggleActive`.
- Use shadcn `DropdownMenu` for row actions.

## Client (<Entities>Client.tsx)
- Local UI filters mirror hook filters; apply via `setFilters({ ... })`
- Use shadcn `Select` and `Input` for filters
- Implement create/edit modals and delete confirmation dialog
- Render `<Entity>Table />` with `listQuery.data?.data`

## Pagination and Filters
- Defaults: `page = 1`, `limit = 20`
- Convert tri-state filters to proper types before calling `setFilters`

## Checklists
- [ ] Endpoint added in `endpoints.ts`
- [ ] Query key added in `queryKeys.ts`
- [ ] Types defined in `type.d.ts` (aligned with server DTO)
- [ ] `useAdmin<Entity>` hook built with invalidations and toasts
- [ ] Form uses shadcn inputs/selects and sanitizer
- [ ] Modal, Table, and Client implemented
- [ ] Relation selectors (if any) implemented
- [ ] Labels have `mb-2 block`
- [ ] Works with bearer token via `@/lib/api`
