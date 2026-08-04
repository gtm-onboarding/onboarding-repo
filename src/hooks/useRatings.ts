import { useSyncExternalStore } from 'react';
import { ProductRating } from '../types';
import { seedRatings } from '../data/ratings';

const RATINGS_STORAGE_KEY = 'onboarding-demo-ratings';

export const MIN_RATING = 1;
export const MAX_RATING = 5;

type UserRatings = Record<string, number>;

const listeners = new Set<() => void>();
let userRatings: UserRatings | null = null;

function isValidRating(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= MIN_RATING && value <= MAX_RATING;
}

function loadUserRatings(): UserRatings {
  try {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (!stored) {
      return {};
    }
    const parsed: unknown = JSON.parse(stored);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Malformed ratings');
    }
    const entries = Object.entries(parsed as Record<string, unknown>).filter(
      (entry): entry is [string, number] => isValidRating(entry[1])
    );
    return Object.fromEntries(entries);
  } catch {
    removeStoredRatings();
    return {};
  }
}

function removeStoredRatings() {
  try {
    localStorage.removeItem(RATINGS_STORAGE_KEY);
  } catch {
    // Storage is unavailable; ratings stay in memory only.
  }
}

function getUserRatings(): UserRatings {
  if (userRatings === null) {
    userRatings = loadUserRatings();
  }
  return userRatings;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function rateProduct(productId: string, rating: number) {
  if (Number.isNaN(rating)) {
    return;
  }
  const clamped = Math.min(MAX_RATING, Math.max(MIN_RATING, Math.round(rating)));
  userRatings = { ...getUserRatings(), [productId]: clamped };
  try {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(userRatings));
  } catch {
    // Storage is unavailable or full; the rating stays in memory only.
  }
  listeners.forEach((listener) => listener());
}

export function getProductRating(productId: string, ratings: UserRatings): ProductRating {
  const seed = seedRatings[productId] ?? { total: 0, count: 0 };
  const userRating = ratings[productId] ?? null;
  const total = seed.total + (userRating ?? 0);
  const count = seed.count + (userRating === null ? 0 : 1);
  return {
    average: count === 0 ? 0 : total / count,
    count,
    userRating,
  };
}

export function useProductRating(productId: string): ProductRating {
  const ratings = useSyncExternalStore(subscribe, getUserRatings, getUserRatings);
  return getProductRating(productId, ratings);
}

export function resetRatings() {
  userRatings = null;
  removeStoredRatings();
  listeners.forEach((listener) => listener());
}
