import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RatingData } from '../types';

interface RatingContextType {
  getRating: (productId: string) => RatingData;
  submitRating: (productId: string, rating: number) => void;
  getUserRating: (productId: string) => number | null;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

interface StoredRatings {
  [productId: string]: number[];
}

interface StoredUserRatings {
  [productId: string]: number;
}

export function RatingProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<StoredRatings>({});
  const [userRatings, setUserRatings] = useState<StoredUserRatings>({});

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

  const getRating = (productId: string): RatingData => {
    const productRatings = ratings[productId] || [];
    const count = productRatings.length;
    const average = count > 0
      ? productRatings.reduce((sum, r) => sum + r, 0) / count
      : 0;
    return { ratings: productRatings, average, count };
  };

  const getUserRating = (productId: string): number | null => {
    return userRatings[productId] ?? null;
  };

  const submitRating = (productId: string, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));
    const existingUserRating = userRatings[productId];

    setRatings((current) => {
      const productRatings = [...(current[productId] || [])];
      if (existingUserRating !== undefined) {
        const idx = productRatings.indexOf(existingUserRating);
        if (idx !== -1) {
          productRatings[idx] = clamped;
        } else {
          productRatings.push(clamped);
        }
      } else {
        productRatings.push(clamped);
      }
      return { ...current, [productId]: productRatings };
    });

    setUserRatings((current) => ({ ...current, [productId]: clamped }));
  };

  return (
    <RatingContext.Provider value={{ getRating, submitRating, getUserRating }}>
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
