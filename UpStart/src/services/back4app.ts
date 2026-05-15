const APP_ID = 'vpl54AmMANUduMCAFOq3pmOrtsxLy3Hdd4dk7uPE';
const JS_KEY = 'cwbo0pBZhFsVYOSqSPaVr2HTvZVT0EnrjbV4u2oo';
const BASE   = 'https://parseapi.back4app.com';

function getHeaders(sessionToken?: string | null): Record<string, string> {
  const h: Record<string, string> = {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-JavaScript-Key': JS_KEY,
    'Content-Type': 'application/json',
  };
  if (sessionToken) h['X-Parse-Session-Token'] = sessionToken;
  return h;
}

export interface ParseUser {
  objectId: string;
  username: string;
  email: string;
  displayName?: string;
  sessionToken: string;
  favoriteCharacter?: string;
  favoriteSpell?: string;
}

export async function signUp(
  username: string,
  email: string,
  password: string
): Promise<ParseUser> {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username: email, email, password, displayName: username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Sign up failed.');
  return { ...data, email, displayName: username };
}

export async function logIn(email: string, password: string): Promise<ParseUser> {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username: email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed.');
  return data;
}

export async function logOut(sessionToken: string): Promise<void> {
  await fetch(`${BASE}/logout`, {
    method: 'POST',
    headers: getHeaders(sessionToken),
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${BASE}/requestPasswordReset`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not send reset email.');
}

export async function getCurrentUser(sessionToken: string): Promise<ParseUser | null> {
  try {
    const res = await fetch(`${BASE}/users/me`, {
      headers: getHeaders(sessionToken),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ── Favorites ────────────────────────────────────────────────────────────────

export async function saveFavorite(
  objectId: string,
  sessionToken: string,
  field: 'favoriteCharacter' | 'favoriteSpell',
  value: string | null
): Promise<void> {
  const body: Record<string, string | null> = { [field]: value };
  const res = await fetch(`${BASE}/users/${objectId}`, {
    method: 'PUT',
    headers: getHeaders(sessionToken),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Could not save favorite.');
  }
}

export async function getFavorites(
  sessionToken: string
): Promise<{ favoriteCharacter: string | null; favoriteSpell: string | null }> {
  const res = await fetch(`${BASE}/users/me`, {
    headers: getHeaders(sessionToken),
  });
  if (!res.ok) return { favoriteCharacter: null, favoriteSpell: null };
  const data = await res.json();
  return {
    favoriteCharacter: data.favoriteCharacter ?? null,
    favoriteSpell:     data.favoriteSpell     ?? null,
  };
}
