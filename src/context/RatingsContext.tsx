import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type ProductRatings = Record<string, Record<string, number>>;

interface RatingsContextType {
  ratings: ProductRatings;
  getUserRating: (productId: string) => number | null;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
  setRating: (productId: string, value: number) => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const ANONYMOUS_KEY = 'anonymous';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<ProductRatings>({});
  const { user } = useAuth();

  const raterKey = user?.email ?? ANONYMOUS_KEY;

  useEffect(() => {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (stored) {
      try {
        setRatings(JSON.parse(stored));
      } catch {
        localStorage.removeItem(RATINGS_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const getUserRating = (productId: string): number | null => {
    return ratings[productId]?.[raterKey] ?? null;
  };

  const getRatingCount = (productId: string): number => {
    return Object.keys(ratings[productId] ?? {}).length;
  };

  const getAverageRating = (productId: string): number => {
    const values = Object.values(ratings[productId] ?? {});
    if (values.length === 0) {
      return 0;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  const setRating = (productId: string, value: number) => {
    const clampedValue = Math.min(5, Math.max(1, Math.round(value)));
    setRatings((current) => ({
      ...current,
      [productId]: { ...current[productId], [raterKey]: clampedValue },
    }));
  };

  return (
    <RatingsContext.Provider
      value={{ ratings, getUserRating, getAverageRating, getRatingCount, setRating }}
    >
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
