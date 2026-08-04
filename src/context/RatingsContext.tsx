import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ProductRating } from '../types';

interface RatingsContextType {
  rateProduct: (productId: string, rating: number) => void;
  getUserRating: (productId: string) => number | null;
  getAverageRating: (productId: string) => number | null;
  getRatingCount: (productId: string) => number;
}

interface RatingsState {
  ratings: Record<string, ProductRating>;
  userRatings: Record<string, number>;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);
const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Record<string, ProductRating>>({});
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as RatingsState;
        setRatings(parsed.ratings || {});
        setUserRatings(parsed.userRatings || {});
      } catch {
        localStorage.removeItem(RATINGS_STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify({ ratings, userRatings }));
  }, [ratings, userRatings, isLoaded]);

  const rateProduct = (productId: string, rating: number) => {
    if (!Number.isFinite(rating)) {
      return;
    }

    const normalizedRating = Math.min(5, Math.max(1, Math.round(rating)));
    setRatings((currentRatings) => {
      const existing = currentRatings[productId] || { sum: 0, count: 0 };
      const previousRating = userRatings[productId];
      const nextRating = previousRating
        ? { sum: existing.sum + normalizedRating - previousRating, count: existing.count }
        : { sum: existing.sum + normalizedRating, count: existing.count + 1 };
      return { ...currentRatings, [productId]: nextRating };
    });
    setUserRatings((currentUserRatings) => ({
      ...currentUserRatings,
      [productId]: normalizedRating,
    }));
  };

  const getUserRating = (productId: string) => userRatings[productId] ?? null;

  const getAverageRating = (productId: string) => {
    const rating = ratings[productId];
    return rating && rating.count > 0 ? rating.sum / rating.count : null;
  };

  const getRatingCount = (productId: string) => ratings[productId]?.count ?? 0;

  return (
    <RatingsContext.Provider
      value={{ rateProduct, getUserRating, getAverageRating, getRatingCount }}
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
