const ADMIN_TOKEN_KEY = 'adminToken';

export function getAdminToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const sessionToken = window.sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (sessionToken) {
    return sessionToken;
  }

  const legacyToken = window.localStorage.getItem(ADMIN_TOKEN_KEY);
  if (legacyToken) {
    window.sessionStorage.setItem(ADMIN_TOKEN_KEY, legacyToken);
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    return legacyToken;
  }

  return null;
}

export function setAdminToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}
