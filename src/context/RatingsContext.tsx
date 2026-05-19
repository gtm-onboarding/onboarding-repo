import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductRatings } from '../types';

interface RatingsContextType {
  ratings: ProductRatings;
  addRating: (productId: string, rating: number) => void;
  getAverageRating: (productId: string) => number | null;
  getRatingCount: (productId: string) => number;
}

const RatingsContext = createContext<RatingsContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<ProductRatings>({});

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

  const addRating = (productId: string, rating: number) => {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));
    setRatings((current) => ({
      ...current,
      [productId]: [...(current[productId] || []), clamped],
    }));
  };

  const getAverageRating = (productId: string): number | null => {
    const productRatings = ratings[productId];
    if (!productRatings || productRatings.length === 0) return null;
    const sum = productRatings.reduce((a, b) => a + b, 0);
    return sum / productRatings.length;
  };

  const getRatingCount = (productId: string): number => {
    return ratings[productId]?.length || 0;
  };

  return (
    <RatingsContext.Provider value={{ ratings, addRating, getAverageRating, getRatingCount }}>
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
