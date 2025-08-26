# Web Forms Rule

Standard for building reusable forms (create/update) in the web app.

## Goals
- Reusable single component for create and update.
- Controlled inputs with explicit state and reset behavior.
- Friendly UX with clear submit/reset actions.
- Optional schema validation with Zod.

## File structure
- Feature folder: `apps/web/src/features/<area>/<feature>/`
  - `schema.ts` – Zod schema + `FormValues` type
  - `use<Feature>.ts` – React Query hook (list/single CRUD)
  - `<Feature>Form.tsx` – Reusable form (create/update)
  - `type.d.ts` – DTO-based types mirrored from server where needed

## Props contract
```ts
interface FormProps<TValues> {
  isUpdate?: boolean; // toggles create vs update behavior
  id?: number | string; // required for update mode
  onSuccess?: () => void; // called after successful submit
  initialValues?: Partial<TValues>; // optional extra defaults
}
```

## State management
- Use `useObject<T>()` for local, controlled form state: `{ object: values, setValues, reset }`.
- For complex, multi-component state or cross-page state, prefer Zustand (see `rules/web.zustand.md`).

## Data fetching (update mode)
- Consume the feature hook’s `singleQuery` by id.
- When `singleQuery.data` becomes available and `isUpdate === true`, map it to `FormValues` and call `setValues(mapped)`.
- Example mapping function: `mapEntityToFormValues(serverEntity)` kept inside the form.

## Submit behavior
- Create: call `createMutation.mutate(values)`.
  - On success: `reset()` and then `setValues(initialValuesMerged)` to restore defaults.
- Update: call `updateMutation.mutate({ id, data: values })`.
  - On success: optionally re-validate queries in the feature hook and call `onSuccess?.()`.

## Reset behavior
- Always render a Reset button next to Submit.
- Create mode: `reset()` then `setValues(initialValuesMerged)`.
- Update mode: `reset()` then `setValues(mappedServerValues)` so the form returns to fetched state.

## Validation (optional)
- Define a Zod schema in `schema.ts` and exported `FormValues`.
- You may validate on submit:
  - `const parsed = Schema.safeParse(values)` and show errors/toasts.
  - Or integrate react-hook-form if needed for bigger forms.

## UI components
- Use shadcn/ui primitives from `src/components/ui/*` (Input, Label, Button, Checkbox, Select, etc.).
- Keep labels, placeholders, and helper text clear.

## Notifications
- Use `sonner` `toast.success/error` for submit outcomes.

## Example
See `apps/web/src/features/admin/category/CategoryForm.tsx` for a complete example implementing the above (create/update + reset rules).
