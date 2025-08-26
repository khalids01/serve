# Web Components Rule: Server vs Client

- Use server components when it’s simple and provides value (initial data fetch for pages, static sections).
- Do not force server components if they complicate the code. If it gets complex, just use a client component with hooks.
- Pattern for lists with filters:
  - Fetch initial list on the server if easy and pass as `initialData` to the feature hook to avoid first-load delay.
  - Let the client hook (`useQuery`) drive subsequent updates as filters change.
- Keep forms, modals, tables, menus as client components (interactive UI).
- Avoid server actions if a typed API hook exists; prefer the feature hook for create/update/delete and revalidation.
- Prefer small, well-scoped server boundaries: a server page can render a client wrapper that receives `initialData` and then hydrates with the hook.
