import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductRating, StoredRating } from '../types';

interface RatingsContextType {
  rateProduct: (productId: string, stars: number) => void;
  getRating: (productId: string) => ProductRating;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

const emptyRating: ProductRating = { average: 0, count: 0, userRating: null };

function loadRatings(): Record<string, StoredRating> {
  const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
  if (!stored) {
    return {};
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(RATINGS_STORAGE_KEY);
    return {};
  }
}

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Record<string, StoredRating>>(loadRatings);

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const rateProduct = (productId: string, stars: number) => {
    const clamped = Math.min(5, Math.max(1, Math.round(stars)));
    setRatings((current) => {
      const existing = current[productId] ?? { ratings: [], userRating: null };
      const withoutUserRating = [...existing.ratings];
      if (existing.userRating !== null) {
        const previousIndex = withoutUserRating.indexOf(existing.userRating);
        if (previousIndex !== -1) {
          withoutUserRating.splice(previousIndex, 1);
        }
      }
      return {
        ...current,
        [productId]: { ratings: [...withoutUserRating, clamped], userRating: clamped },
      };
    });
  };

  const getRating = (productId: string): ProductRating => {
    const stored = ratings[productId];
    if (!stored || stored.ratings.length === 0) {
      return emptyRating;
    }
    const total = stored.ratings.reduce((sum, rating) => sum + rating, 0);
    return {
      average: total / stored.ratings.length,
      count: stored.ratings.length,
      userRating: stored.userRating,
    };
  };

  return (
    <RatingsContext.Provider value={{ rateProduct, getRating }}>{children}</RatingsContext.Provider>
  );
}

export function useRatings() {
  const context = useContext(RatingsContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
}
