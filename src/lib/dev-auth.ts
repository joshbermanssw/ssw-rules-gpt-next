/**
 * Development authentication bypass.
 * In development mode, we skip auth checks and use a mock user.
 */

export const isDev = process.env.NODE_ENV === 'development';

export const devUser = {
  email: 'dev@ssw.com.au',
  name: 'Dev User',
};

/**
 * Get user info, using mock user in development if no session exists.
 */
export function getDevUser(session: { user?: { email?: string; name?: string } } | null) {
  if (isDev && !session?.user) {
    return devUser;
  }
  return session?.user ?? null;
}
