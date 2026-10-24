// Test/typecheck fixture only. Keep your application's real Better Auth instance
// at this path. For another auth provider, change the token route's authorize callback.
export const auth = {
  api: {
    getSession: async (_input: {
      headers: Headers;
    }): Promise<{ user: { id: string } } | null> => null,
  },
};
