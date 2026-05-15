// Back4App (Parse) auth service — UpStart backend.
const APP_ID     = 'PCLLKvm6OzUMutEtVJCuHMCs6q5QBIYCVoV5SVHa';
const JS_KEY     = '3bvlGQyAUrqfq6CRVOyrJmnEsNDWnsRtvRO1ggN1';
const CLIENT_KEY = 'HnvIi2lNhmzV1FIFwxFmNfE7RFzRIh2aUNzuXSBg';
const BASE       = 'https://parseapi.back4app.com';

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
    const res = await fetch(`${BASE}/users/me`, { headers: getHeaders(sessionToken) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
