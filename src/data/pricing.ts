import { CartItem } from '../types';

export const TAX_RATE = 0.08;

export const JEWELRY_CATEGORY = 'Jewelry';

export const JEWELRY_RIDER_RATE = 0.015;

export const JEWELRY_RIDER_NAME = 'Jewelry Coverage Rider';

export function getJewelrySubtotal(items: CartItem[]): number {
  return items
    .filter((item) => item.product.category === JEWELRY_CATEGORY)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getRiderPrice(jewelrySubtotal: number): number {
  return jewelrySubtotal * JEWELRY_RIDER_RATE;
}
