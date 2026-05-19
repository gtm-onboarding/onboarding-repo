import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductRatings } from '../types';
import { defaultRatings } from '../data/ratings';

interface RatingsContextType {
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
  getUserRating: (productId: string) => number | null;
  rateProduct: (productId: string, rating: number) => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

function loadFromStorage<T>(key: string, fallback: T): T {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(key);
    }
  }
  return fallback;
}

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Record<string, ProductRatings>>(() =>
    loadFromStorage(RATINGS_STORAGE_KEY, defaultRatings)
  );
  const [userRatings, setUserRatings] = useState<Record<string, number>>(() =>
    loadFromStorage(USER_RATINGS_STORAGE_KEY, {})
  );

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(USER_RATINGS_STORAGE_KEY, JSON.stringify(userRatings));
  }, [userRatings]);

  const getAverageRating = useCallback(
    (productId: string): number => {
      const r = ratings[productId];
      if (!r || r.count === 0) return 0;
      return r.total / r.count;
    },
    [ratings]
  );

  const getRatingCount = useCallback(
    (productId: string): number => {
      return ratings[productId]?.count ?? 0;
    },
    [ratings]
  );

  const getUserRating = useCallback(
    (productId: string): number | null => {
      return userRatings[productId] ?? null;
    },
    [userRatings]
  );

  const rateProduct = useCallback(
    (productId: string, rating: number) => {
      const clamped = Math.max(1, Math.min(5, Math.round(rating)));
      const previousUserRating = userRatings[productId] ?? null;

      setUserRatings((prev) => ({ ...prev, [productId]: clamped }));
      setRatings((prev) => {
        const current = prev[productId] ?? { total: 0, count: 0 };
        if (previousUserRating !== null) {
          return {
            ...prev,
            [productId]: {
              total: current.total - previousUserRating + clamped,
              count: current.count,
            },
          };
        }
        return {
          ...prev,
          [productId]: {
            total: current.total + clamped,
            count: current.count + 1,
          },
        };
      });
    },
    [userRatings]
  );

  return (
    <RatingsContext.Provider value={{ getAverageRating, getRatingCount, getUserRating, rateProduct }}>
      {children}
    </RatingsContext.Provider>
  );
}

export function useRatings() {
  const context = useContext(RatingsContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
}
