import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RatingSummary } from '../types';

interface RatingsContextType {
  rateProduct: (productId: string, rating: number) => void;
  getUserRating: (productId: string) => number | null;
  getRatingSummary: (productId: string) => RatingSummary;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

export const MIN_RATING = 1;
export const MAX_RATING = 5;

type StoredRatings = Record<string, number[]>;

interface RatingsState {
  ratings: StoredRatings;
  userRatings: Record<string, number>;
}

const EMPTY_STATE: RatingsState = { ratings: {}, userRatings: {} };

function isValidRating(rating: number) {
  return Number.isInteger(rating) && rating >= MIN_RATING && rating <= MAX_RATING;
}

function readStoredRatings(): RatingsState {
  const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
  if (!stored) return EMPTY_STATE;
  try {
    const parsed = JSON.parse(stored) as Partial<RatingsState>;
    return { ratings: parsed.ratings ?? {}, userRatings: parsed.userRatings ?? {} };
  } catch {
    localStorage.removeItem(RATINGS_STORAGE_KEY);
    return EMPTY_STATE;
  }
}

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RatingsState>(readStoredRatings);
  const { ratings, userRatings } = state;

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const rateProduct = (productId: string, rating: number) => {
    if (!isValidRating(rating)) return;

    setState((current) => {
      const previous = current.userRatings[productId];
      const productRatings = current.ratings[productId] ?? [];
      const index = previous === undefined ? -1 : productRatings.indexOf(previous);
      const updated = [...productRatings];
      if (index === -1) {
        updated.push(rating);
      } else {
        updated[index] = rating;
      }
      return {
        ratings: { ...current.ratings, [productId]: updated },
        userRatings: { ...current.userRatings, [productId]: rating },
      };
    });
  };

  const getUserRating = (productId: string) => userRatings[productId] ?? null;

  const getRatingSummary = (productId: string): RatingSummary => {
    const productRatings = ratings[productId] ?? [];
    if (productRatings.length === 0) {
      return { average: 0, count: 0 };
    }
    const total = productRatings.reduce((sum, rating) => sum + rating, 0);
    return { average: total / productRatings.length, count: productRatings.length };
  };

  return (
    <RatingsContext.Provider value={{ rateProduct, getUserRating, getRatingSummary }}>
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
