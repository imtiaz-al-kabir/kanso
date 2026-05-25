/** Safe in-app path for post-login redirects (blocks open redirects). */
export function safeCallbackUrl(url?: string | null) {
  if (url && url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }
  return '/';
}

export function getPostLoginPath(callbackUrl: string, role?: string) {
  const safe = safeCallbackUrl(callbackUrl);
  if (role === 'admin' && safe === '/') return '/admin';
  return safe;
}
