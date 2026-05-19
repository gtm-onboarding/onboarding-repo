import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductRating } from '../types';

interface RatingsContextType {
  ratings: ProductRating[];
  rateProduct: (productId: string, rating: number) => void;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
  getUserRating: (productId: string) => number | null;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<ProductRating[]>([]);
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

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

  const rateProduct = useCallback((productId: string, rating: number) => {
    const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));
    const previousUserRating = userRatings[productId];

    setRatings((current) => {
      if (previousUserRating !== undefined) {
        const withoutPrevious = current.filter(
          (r) => !(r.productId === productId && r.rating === previousUserRating)
        );
        const removed =
          withoutPrevious.length < current.length
            ? withoutPrevious
            : current.slice(0, -1);
        return [...removed, { productId, rating: clampedRating }];
      }
      return [...current, { productId, rating: clampedRating }];
    });

    setUserRatings((current) => ({
      ...current,
      [productId]: clampedRating,
    }));
  }, [userRatings]);

  const getAverageRating = useCallback(
    (productId: string) => {
      const productRatings = ratings.filter((r) => r.productId === productId);
      if (productRatings.length === 0) return 0;
      const sum = productRatings.reduce((acc, r) => acc + r.rating, 0);
      return sum / productRatings.length;
    },
    [ratings]
  );

  const getRatingCount = useCallback(
    (productId: string) => {
      return ratings.filter((r) => r.productId === productId).length;
    },
    [ratings]
  );

  const getUserRating = useCallback(
    (productId: string) => {
      return userRatings[productId] ?? null;
    },
    [userRatings]
  );

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        rateProduct,
        getAverageRating,
        getRatingCount,
        getUserRating,
      }}
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
