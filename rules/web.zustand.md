# Zustand Usage Rule

Prefer Zustand over React Context for complex or multi-component state management, especially when:
- State spans multiple components/routes.
- You need derived state/selectors and optimized renders.
- Default/initial values must be fetched from an API before components mount.

## Principles
- One store per feature/domain. Keep it small and focused.
- Expose read-only selectors for consumers. Mutations via dedicated actions.
- Keep async fetching in actions; hydrate store with results.
- Avoid storing non-serializable objects when possible.

## Setup
- Install: `bun add zustand` (already present if used elsewhere; check first)
- File structure (example):
  - `apps/web/src/features/<area>/<feature>/store.ts`

## Store template
```ts
import { create } from "zustand";

interface State {
  ready: boolean;
  data: any | null;
  error?: string;
}

interface Actions {
  hydrate: (initial?: Partial<State>) => void;
  fetch: () => Promise<void>;
  reset: () => void;
}

export const useFeatureStore = create<State & Actions>((set, get) => ({
  ready: false,
  data: null,

  hydrate: (initial) => set({ ...get(), ...initial }),

  fetch: async () => {
    try {
      // e.g., const res = await api<YourType>(endpoints.your, { method: 'GET' })
      const res = null;
      set({ data: res, ready: true, error: undefined });
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to fetch", ready: true });
    }
  },

  reset: () => set({ ready: false, data: null, error: undefined }),
}));
```

## Fetching default/initial values
- If defaults come from an API:
  - Call `useFeatureStore.getState().fetch()` in a layout or top-level effect.
  - Or call `hydrate` with server-provided defaults in SSR/initial load.

## Using in components
```ts
import { useFeatureStore } from "./store";

const ready = useFeatureStore((s) => s.ready);
const data = useFeatureStore((s) => s.data);
const fetch = useFeatureStore((s) => s.fetch);
```

## Integration with forms and hooks
- Use Zustand to hold cross-component defaults/filters.
- Keep component-local details in component state or `useObject`.
- For server communication, continue using the shared `api<T>()` and React Query for caching; Zustand should not replace React Query.

## Testing
- Export the store factory if you need isolated instances for tests.
- Provide actions to reset store state between tests.
