import { use } from 'react'
import type { AuthContextValue } from './context'
import { AuthContext } from './context'

/**
 * Access the current auth session.
 *
 * Kept out of AuthContext.tsx so that file only exports components, which
 * is what lets Vite's fast refresh work reliably during development.
 */
export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
