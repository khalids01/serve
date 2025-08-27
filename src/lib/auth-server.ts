import { headers } from 'next/headers'
import { auth } from './auth'
import type { User } from './auth'

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth.api.getSession({
    headers: await headers()
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
