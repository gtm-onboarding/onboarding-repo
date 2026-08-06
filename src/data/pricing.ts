import { CartItem } from '../types';

export const TAX_RATE = 0.08;
export const JEWELRY_RIDER_RATE = 0.02;
export const JEWELRY_RIDER_PRODUCT_ID = 'jewelry-1';

export function getRiderEligibleSubtotal(items: CartItem[]): number {
  return items
    .filter((item) => item.product.id === JEWELRY_RIDER_PRODUCT_ID)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getRiderPrice(items: CartItem[], riderSelected: boolean): number {
  if (!riderSelected) {
    return 0;
  }
  return getRiderEligibleSubtotal(items) * JEWELRY_RIDER_RATE;
}
