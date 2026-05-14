import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signUp: (email: string, password: string, name: string) => boolean;
  signInWithGoogle: (credential: string) => boolean;
  signOut: () => void;
  showToast: (message: string) => void;
  toastMessage: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'sko-demo-users';
const SESSION_STORAGE_KEY = 'sko-demo-session';

interface StoredUser {
  email: string;
  password: string;
  name: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getUsers = (): StoredUser[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const signIn = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const sessionUser = { email: found.email, name: found.name };
      setUser(sessionUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      showToast(`Signed in as ${found.email}`);
      return true;
    }
    return false;
  };

  const signUp = (email: string, password: string, name: string): boolean => {
    const users = getUsers();
    const exists = users.find((u) => u.email === email);
    if (exists) {
      return false;
    }
    const newUser = { email, password, name };
    saveUsers([...users, newUser]);
    const sessionUser = { email, name };
    setUser(sessionUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    showToast(`Welcome, ${name}!`);
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    showToast('Signed out');
  };

  const signInWithGoogle = (credential: string): boolean => {
    try {
      const payload = JSON.parse(atob(credential.split('.')[1]));
      const email = payload.email as string;
      const name = (payload.name as string) || email;
      if (!email) return false;
      const sessionUser = { email, name };
      setUser(sessionUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      showToast(`Signed in as ${email}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
