import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductRatings } from '../types';

interface RatingContextType {
  addRating: (productId: string, rating: number) => void;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
  getUserRating: (productId: string) => number | null;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

interface RatingState {
  ratings: ProductRatings;
  userRatings: Record<string, number>;
}

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

function loadInitialState(): RatingState {
  return {
    ratings: loadFromStorage<ProductRatings>(RATINGS_STORAGE_KEY, {}),
    userRatings: loadFromStorage<Record<string, number>>(USER_RATINGS_STORAGE_KEY, {}),
  };
}

export function RatingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RatingState>(loadInitialState);

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(state.ratings));
  }, [state.ratings]);

  useEffect(() => {
    localStorage.setItem(USER_RATINGS_STORAGE_KEY, JSON.stringify(state.userRatings));
  }, [state.userRatings]);

  const addRating = useCallback((productId: string, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));

    setState((current) => {
      const productRatings = current.ratings[productId] ? [...current.ratings[productId]] : [];
      const previousUserRating = current.userRatings[productId];

      if (previousUserRating !== undefined) {
        const idx = productRatings.lastIndexOf(previousUserRating);
        if (idx !== -1) {
          productRatings.splice(idx, 1);
        }
      }
      productRatings.push(clamped);

      return {
        ratings: { ...current.ratings, [productId]: productRatings },
        userRatings: { ...current.userRatings, [productId]: clamped },
      };
    });
  }, []);

  const getAverageRating = useCallback((productId: string): number => {
    const productRatings = state.ratings[productId];
    if (!productRatings || productRatings.length === 0) return 0;
    const sum = productRatings.reduce((a, b) => a + b, 0);
    return sum / productRatings.length;
  }, [state.ratings]);

  const getRatingCount = useCallback((productId: string): number => {
    const productRatings = state.ratings[productId];
    return productRatings ? productRatings.length : 0;
  }, [state.ratings]);

  const getUserRating = useCallback((productId: string): number | null => {
    return state.userRatings[productId] ?? null;
  }, [state.userRatings]);

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
