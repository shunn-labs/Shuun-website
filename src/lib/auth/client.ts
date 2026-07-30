// ═══════════════════════════════════════════════════════════
//  client.ts — typed client for the Shunn Labs auth API
//
//  Session tokens live in httpOnly cookies, so nothing here reads or
//  stores them: the browser attaches them automatically because every
//  request sets `credentials: 'include'`.
//
//  The one value JavaScript does handle is the CSRF token, which the
//  server also exposes in a readable cookie. We echo it back in a header
//  on state-changing requests to prove the call came from our own page.
// ═══════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:8001'

const CSRF_COOKIE = 'shuun_csrf'
const CSRF_HEADER = 'X-CSRF-Token'

export interface AuthUser {
  id: string
  email: string
  full_name: string
  is_email_verified: boolean
  has_password: boolean
  has_google: boolean
}

export interface SessionResponse {
  user: AuthUser
  csrf_token: string
  expires_in: number
}

export interface FieldError {
  field: string
  message: string
}

/** A non-2xx response, carrying whatever the API chose to disclose. */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldError[]
  readonly retryAfterSeconds?: number

  constructor(
    message: string,
    status: number,
    fieldErrors: FieldError[] = [],
    retryAfterSeconds?: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.retryAfterSeconds = retryAfterSeconds
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isRateLimited(): boolean {
    return this.status === 429
  }
}

function readCsrfCookie(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

async function request<T>(
  path: string,
  { method = 'GET', body }: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (!SAFE_METHODS.has(method)) {
    const csrf = readCsrfCookie()
    if (csrf) headers[CSRF_HEADER] = csrf
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      // Required for the session cookies to be sent and accepted.
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection.', 0)
  }

  if (response.status === 204) return undefined as T

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const retryAfter = response.headers.get('Retry-After')
    throw new ApiError(
      payload?.detail ?? 'Something went wrong. Please try again.',
      response.status,
      payload?.errors ?? [],
      retryAfter ? Number(retryAfter) : undefined,
    )
  }

  return payload as T
}

export const authApi = {
  signup: (input: { email: string; full_name: string; password: string }) =>
    request<SessionResponse>('/api/auth/signup', { method: 'POST', body: input }),

  login: (input: { email: string; password: string }) =>
    request<SessionResponse>('/api/auth/login', { method: 'POST', body: input }),

  logout: () => request<{ detail: string }>('/api/auth/logout', { method: 'POST' }),

  refresh: () => request<SessionResponse>('/api/auth/refresh', { method: 'POST' }),

  me: () => request<AuthUser>('/api/auth/me'),

  /**
   * Full-page navigation, not fetch: the browser has to follow Google's
   * redirect and land back on our callback so the cookies are set on a
   * real navigation.
   */
  startGoogleSignIn: () => {
    window.location.href = `${API_BASE}/api/auth/google/authorize`
  },
}

/** Human-readable copy for the `?error=` codes the callback can redirect with. */
export const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_cancelled: 'Google sign-in was cancelled.',
  google_failed: 'Google sign-in failed. Please try again.',
  google_invalid_response: 'Google returned an unexpected response.',
  google_not_configured: 'Google sign-in is not configured on this server yet.',
  google_link_failed:
    'That Google account could not be linked. Sign in with your password instead.',
  account_disabled: 'This account has been disabled.',
}
