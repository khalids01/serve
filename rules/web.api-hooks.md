# Web API + Hooks Rule

This rule defines how we create API instances and feature hooks using TanStack React Query.

## API instance
- File: `apps/web/src/lib/api.ts`
- Use Axios with:
  - `baseURL` from `process.env.NEXT_PUBLIC_BASE_URL`
  - `withCredentials: true` for Better Auth cookies
  - Request interceptor:
    - `Content-Type`: `multipart/form-data` if `FormData`, else `application/json`
    - `Authorization: Bearer <token>` using `retrieveToken()`
- Export a thin `api<T>()` wrapper:
  - Accepts `(url: string, config: AxiosRequestConfig)`
  - Returns `Promise<T>` (response.data)

## Shared utilities
- `apps/web/src/constants/endpoints.ts`: Collect endpoints (e.g., `category: "/categories"`).
- `apps/web/src/constants/queryKeys.ts`: Shared query keys (e.g., `category.admin`).
- `apps/web/src/lib/helper.ts`: `removeEmptyFields(obj)` to clean filters.
- `apps/web/src/hooks/useObject.ts`: Local object state for filters (`{ object, setValues }`).
- `apps/web/src/types/action.ts`: Common action/OK response shape (`OkRes`).

## Hook structure (feature-specific)
- Feature root: `apps/web/src/features/<area>/<feature>/`
- Types declaration: `type.d.ts` mirroring server DTOs (responses, inputs, list query).
- Hook file: `use<Feature>.ts` exporting a hook that provides:
  - Filters: `setFilters` from `useObject`
  - List query: `useQuery({ queryKey, queryFn, initialData, enabled })`
  - Single query: `useQuery({ queryKey: [..., id], enabled: !!id })`
  - Create/Update/Delete mutations using `useMutation`
  - Revalidation helpers using `queryClient.invalidateQueries`
- Notifications: use `sonner` (`toast.success/error`) for feedback.

## Query keys
- Namespaced and stable arrays, e.g.:
  - List: `[queryKeys.category.admin, "list", page, limit, q, type, parentId, active]`
  - Single: `[queryKeys.category.admin, "single", id]`

## Example usage pattern
```ts
import { useAdminCategory } from "@/features/admin/category/useAdminCategory";

const { listQuery, createMutation, setFilters } = useAdminCategory({ fetchListEnabled: true });

setFilters({ q: "electronics", page: 2 });
createMutation.mutate({ name: "Phones", slug: "phones", type: "product" });
```

## Providers
- Ensure `QueryClientProvider` is registered in `apps/web/src/components/providers.tsx`.

## Endpoint mapping example (server -> client)
- Server groups categories under `"/categories"` (`apps/server/src/modules/app.ts`).
- Controller routes:
  - `POST "/"` create (admin)
  - `GET "/"` list
  - `GET "/:id"` single
  - `PATCH "/:id"` update (admin)
  - `DELETE "/:id"` delete (admin)
- In client: `endpoints.category = "/categories"`.
