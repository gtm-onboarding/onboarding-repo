import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface RatingEntry {
  total: number;
  count: number;
}

interface RatingsContextType {
  getRating: (productId: string) => { average: number; count: number };
  addRating: (productId: string, rating: number) => void;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Record<string, RatingEntry>>({});

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

  const getRating = useCallback(
    (productId: string) => {
      const entry = ratings[productId];
      if (!entry || entry.count === 0) {
        return { average: 0, count: 0 };
      }
      return { average: entry.total / entry.count, count: entry.count };
    },
    [ratings],
  );

  const addRating = useCallback((productId: string, rating: number) => {
    setRatings((prev) => {
      const existing = prev[productId] ?? { total: 0, count: 0 };
      return {
        ...prev,
        [productId]: {
          total: existing.total + rating,
          count: existing.count + 1,
        },
      };
    });
  }, []);

  return (
    <RatingsContext.Provider value={{ getRating, addRating }}>
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
