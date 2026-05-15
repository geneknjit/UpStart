import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  sessionToken: string | null;
  objectId: string | null;
  displayName: string | null;
  email: string | null;
  setSession: (token: string, objectId: string, displayName?: string, email?: string) => Promise<void>;
  clearSession: () => Promise<void>;
  setProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  sessionToken: null,
  objectId: null,
  displayName: null,
  email: null,
  setSession: async () => {},
  clearSession: async () => {},
  setProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [objectId, setObjectId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet(['sessionToken', 'objectId', 'displayName', 'email']).then((pairs) => {
      if (pairs[0][1]) setSessionToken(pairs[0][1]);
      if (pairs[1][1]) setObjectId(pairs[1][1]);
      if (pairs[2][1]) setDisplayName(pairs[2][1]);
      if (pairs[3][1]) setEmail(pairs[3][1]);
    });
  }, []);

  const setSession = async (token: string, id: string, name?: string, mail?: string) => {
    const pairs: [string, string][] = [
      ['sessionToken', token],
      ['objectId', id],
    ];
    if (name) pairs.push(['displayName', name]);
    if (mail) pairs.push(['email', mail]);
    await AsyncStorage.multiSet(pairs);
    setSessionToken(token);
    setObjectId(id);
    if (name) setDisplayName(name);
    if (mail) setEmail(mail);
  };

  const clearSession = async () => {
    await AsyncStorage.multiRemove(['sessionToken', 'objectId', 'displayName', 'email']);
    setSessionToken(null);
    setObjectId(null);
    setDisplayName(null);
    setEmail(null);
  };

  const setProfile = async (name: string) => {
    await AsyncStorage.setItem('displayName', name);
    setDisplayName(name);
  };

  return (
    <AuthContext.Provider value={{ sessionToken, objectId, displayName, email, setSession, clearSession, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
