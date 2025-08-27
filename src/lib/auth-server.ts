import { headers } from 'next/headers'
import { auth } from './auth'

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  return session?.user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}
