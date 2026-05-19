import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Rating {
  productId: string;
  value: number;
}

interface RatingContextType {
  getRating: (productId: string) => number | null;
  getAverageRating: (productId: string) => number | null;
  getRatingCount: (productId: string) => number;
  setRating: (productId: string, value: number) => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

export function RatingProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRatings, setUserRatings] = useState<Rating[]>([]);

  useEffect(() => {
    const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (storedRatings) {
      try {
        setRatings(JSON.parse(storedRatings));
      } catch {
        localStorage.removeItem(RATINGS_STORAGE_KEY);
      }
    }

    const storedUserRatings = localStorage.getItem(USER_RATINGS_STORAGE_KEY);
    if (storedUserRatings) {
      try {
        setUserRatings(JSON.parse(storedUserRatings));
      } catch {
        localStorage.removeItem(USER_RATINGS_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem(USER_RATINGS_STORAGE_KEY, JSON.stringify(userRatings));
  }, [userRatings]);

  const getRating = useCallback(
    (productId: string): number | null => {
      const userRating = userRatings.find((r) => r.productId === productId);
      return userRating ? userRating.value : null;
    },
    [userRatings]
  );

  const getAverageRating = useCallback(
    (productId: string): number | null => {
      const productRatings = ratings.filter((r) => r.productId === productId);
      if (productRatings.length === 0) return null;
      const sum = productRatings.reduce((acc, r) => acc + r.value, 0);
      return sum / productRatings.length;
    },
    [ratings]
  );

  const getRatingCount = useCallback(
    (productId: string): number => {
      return ratings.filter((r) => r.productId === productId).length;
    },
    [ratings]
  );

  const setRating = useCallback(
    (productId: string, value: number) => {
      const clampedValue = Math.max(1, Math.min(5, Math.round(value)));

      setUserRatings((current) => {
        const existing = current.find((r) => r.productId === productId);
        if (existing) {
          return current.map((r) => (r.productId === productId ? { ...r, value: clampedValue } : r));
        }
        return [...current, { productId, value: clampedValue }];
      });

      setRatings((current) => {
        const existingIndex = current.findIndex(
          (r) => r.productId === productId && r.value === getRating(productId)
        );
        if (existingIndex !== -1) {
          const updated = [...current];
          updated[existingIndex] = { productId, value: clampedValue };
          return updated;
        }
        return [...current, { productId, value: clampedValue }];
      });
    },
    [getRating]
  );

  return (
    <RatingContext.Provider value={{ getRating, getAverageRating, getRatingCount, setRating }}>
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
