import { headers } from 'next/headers'
import { auth } from './auth'
import type { User } from './auth'

export async function getCurrentUser(reqHeaders?: Headers | unknown): Promise<User | null> {
  // Normalize to a concrete Headers instance for better-auth
  const toConcreteHeaders = async (input?: Headers | unknown): Promise<Headers> => {
    if (input instanceof Headers) return input
    if (input) return new Headers(input as any)
    const h = await headers() as any
    // Copy entries into a mutable Headers
    return new Headers(Object.fromEntries(h))
  }

  const hdrs = await toConcreteHeaders(reqHeaders)
  const session = await auth.api.getSession({
    headers: hdrs
  })
  return session?.user || null
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}
