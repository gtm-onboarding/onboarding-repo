import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ProductRatings {
  ratings: number[];
  userRating: number | null;
}

interface RatingContextType {
  rateProduct: (productId: string, rating: number) => void;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
  getUserRating: (productId: string) => number | null;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

function loadRatings(): Record<string, ProductRatings> {
  const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(RATINGS_STORAGE_KEY);
    }
  }
  return {};
}

export function RatingProvider({ children }: { children: ReactNode }) {
  const [allRatings, setAllRatings] = useState<Record<string, ProductRatings>>({});

  useEffect(() => {
    setAllRatings(loadRatings());
  }, []);

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(allRatings));
  }, [allRatings]);

  const rateProduct = useCallback((productId: string, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));
    setAllRatings((prev) => {
      const existing = prev[productId];
      if (existing) {
        const hadUserRating = existing.userRating !== null;
        const updatedRatings = hadUserRating
          ? existing.ratings.slice(0, -1).concat(clamped)
          : [...existing.ratings, clamped];
        return {
          ...prev,
          [productId]: { ratings: updatedRatings, userRating: clamped },
        };
      }
      return {
        ...prev,
        [productId]: { ratings: [clamped], userRating: clamped },
      };
    });
  }, []);

  const getAverageRating = useCallback(
    (productId: string): number => {
      const entry = allRatings[productId];
      if (!entry || entry.ratings.length === 0) return 0;
      const sum = entry.ratings.reduce((a, b) => a + b, 0);
      return sum / entry.ratings.length;
    },
    [allRatings]
  );

  const getRatingCount = useCallback(
    (productId: string): number => {
      const entry = allRatings[productId];
      return entry ? entry.ratings.length : 0;
    },
    [allRatings]
  );

  const getUserRating = useCallback(
    (productId: string): number | null => {
      const entry = allRatings[productId];
      return entry ? entry.userRating : null;
    },
    [allRatings]
  );

  return (
    <RatingContext.Provider
      value={{ rateProduct, getAverageRating, getRatingCount, getUserRating }}
    >
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
