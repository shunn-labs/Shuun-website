import { createContext } from 'react'
import type { AuthUser } from './client'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  signup: (input: { email: string; full_name: string; password: string }) => Promise<void>
  login: (input: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Lives in its own module so both the provider component and the `useAuth`
 * hook can import it without either file exporting a mix of components and
 * non-components (which breaks fast refresh).
 */
export const AuthContext = createContext<AuthContextValue | null>(null)
