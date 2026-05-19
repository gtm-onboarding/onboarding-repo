import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface RatingEntry {
  rating: number;
  timestamp: number;
}

interface RatingsMap {
  [productId: string]: RatingEntry[];
}

interface RatingContextType {
  addRating: (productId: string, rating: number) => void;
  getAverageRating: (productId: string) => number | null;
  getRatingCount: (productId: string) => number;
  getUserRating: (productId: string) => number | null;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

function loadFromStorage<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      localStorage.removeItem(key);
    }
  }
  return fallback;
}

export function RatingProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<RatingsMap>(() =>
    loadFromStorage<RatingsMap>(RATINGS_STORAGE_KEY, {})
  );
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() =>
    loadFromStorage<Record<string, number>>(USER_RATINGS_STORAGE_KEY, {})
  );

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(USER_RATINGS_STORAGE_KEY, JSON.stringify(userRatings));
  }, [userRatings]);

  const addRating = useCallback((productId: string, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));
    const entry: RatingEntry = { rating: clamped, timestamp: Date.now() };

    setRatings((prev) => {
      const existing = prev[productId] ?? [];
      const hadUserRating = userRatings[productId] !== undefined;

      if (hadUserRating) {
        const withoutOld = existing.slice(0, -1);
        return { ...prev, [productId]: [...withoutOld, entry] };
      }

      return { ...prev, [productId]: [...existing, entry] };
    });

    setUserRatings((prev) => ({ ...prev, [productId]: clamped }));
  }, [userRatings]);

  const getAverageRating = useCallback((productId: string): number | null => {
    const entries = ratings[productId];
    if (!entries || entries.length === 0) return null;
    const sum = entries.reduce((acc, e) => acc + e.rating, 0);
    return sum / entries.length;
  }, [ratings]);

  const getRatingCount = useCallback((productId: string): number => {
    return ratings[productId]?.length ?? 0;
  }, [ratings]);

  const getUserRating = useCallback((productId: string): number | null => {
    return userRatings[productId] ?? null;
  }, [userRatings]);

  return (
    <RatingContext.Provider value={{ addRating, getAverageRating, getRatingCount, getUserRating }}>
      {children}
    </RatingContext.Provider>
  );
}

export function useRating() {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
}
