import type { Product } from './types';

export const JEWELRY_COVERAGE_RATE = 0.02;
export const SALES_TAX_RATE = 0.08;

export const isCoverageEligible = (product: Product): boolean => product.category === 'Jewelry';
