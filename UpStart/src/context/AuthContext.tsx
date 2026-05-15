import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  sessionToken: string | null;
  objectId: string | null;
  setSession: (token: string, objectId: string) => Promise<void>;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  sessionToken: null,
  objectId: null,
  setSession: async () => {},
  clearSession: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [objectId, setObjectId]         = useState<string | null>(null);

  useEffect(() => {
    // Restore session on app start
    AsyncStorage.multiGet(['sessionToken', 'objectId']).then((pairs) => {
      const token = pairs[0][1];
      const id    = pairs[1][1];
      if (token) setSessionToken(token);
      if (id)    setObjectId(id);
    });
  }, []);

  const setSession = async (token: string, id: string) => {
    await AsyncStorage.multiSet([['sessionToken', token], ['objectId', id]]);
    setSessionToken(token);
    setObjectId(id);
  };

  const clearSession = async () => {
    await AsyncStorage.multiRemove(['sessionToken', 'objectId']);
    setSessionToken(null);
    setObjectId(null);
  };

  return (
    <AuthContext.Provider value={{ sessionToken, objectId, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
