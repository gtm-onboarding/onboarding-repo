import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RatingData {
  [productId: string]: number[];
}

interface RatingContextType {
  addRating: (productId: string, rating: number) => void;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

export function RatingProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<RatingData>(() => {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const addRating = (productId: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), rating],
    }));
  };

  const getAverageRating = (productId: string): number => {
    const productRatings = ratings[productId];
    if (!productRatings || productRatings.length === 0) return 0;
    return productRatings.reduce((sum, r) => sum + r, 0) / productRatings.length;
  };

  const getRatingCount = (productId: string): number => {
    return ratings[productId]?.length || 0;
  };

  return (
    <RatingContext.Provider value={{ addRating, getAverageRating, getRatingCount }}>
      {children}
    </RatingContext.Provider>
  );
}

export function useRatings() {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingProvider');
  }
  return context;
}
