import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Rating } from '../types';

interface RatingsContextType {
  ratings: Rating[];
  rateProduct: (productId: string, stars: number) => void;
  getUserRating: (productId: string) => number | null;
  getAverageRating: (productId: string) => number | null;
  getRatingCount: (productId: string) => number;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';
const USER_RATINGS_STORAGE_KEY = 'onboarding-demo-user-ratings';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>([]);
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

  const rateProduct = (productId: string, stars: number) => {
    const existingUserRating = userRatings[productId];

    if (existingUserRating !== undefined) {
      setRatings((current) =>
        current.map((r) =>
          r.productId === productId && r.stars === existingUserRating
            ? { ...r, stars }
            : r
        )
      );
    } else {
      setRatings((current) => [...current, { productId, stars }]);
    }

    setUserRatings((current) => ({ ...current, [productId]: stars }));
  };

  const getUserRating = (productId: string): number | null => {
    return userRatings[productId] ?? null;
  };

  const getAverageRating = (productId: string): number | null => {
    const productRatings = ratings.filter((r) => r.productId === productId);
    if (productRatings.length === 0) return null;
    const sum = productRatings.reduce((acc, r) => acc + r.stars, 0);
    return sum / productRatings.length;
  };

  const getRatingCount = (productId: string): number => {
    return ratings.filter((r) => r.productId === productId).length;
  };

  return (
    <RatingsContext.Provider
      value={{
        ratings,
        rateProduct,
        getUserRating,
        getAverageRating,
        getRatingCount,
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
