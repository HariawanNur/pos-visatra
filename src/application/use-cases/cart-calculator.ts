import { Product, WholesaleTier } from '../../core/entities/product';
import { CartItem, SelectedModifier } from '../../core/entities/order';

/**
 * Calculates effective unit price based on quantity and wholesale tiers
 */
export function getEffectiveUnitPrice(product: Product, quantity: number): number {
  if (!product.wholesaleTiers || product.wholesaleTiers.length === 0) {
    return product.basePrice;
  }

  // Sort tiers descending by minQuantity
  const sortedTiers = [...product.wholesaleTiers].sort((a, b) => b.minQuantity - a.minQuantity);
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQuantity) {
      return tier.unitPrice;
    }
  }

  return product.basePrice;
}

/**
 * Recalculate single cart item subtotal
 */
export function calculateItemSubtotal(
  unitPrice: number,
  quantity: number,
  modifiers?: SelectedModifier[]
): number {
  const modifierTotal = (modifiers || []).reduce((sum, mod) => sum + mod.priceDelta, 0);
  return (unitPrice + modifierTotal) * quantity;
}

export interface CartTotals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  serviceChargeAmount: number;
  grandTotal: number;
  itemCount: number;
}

/**
 * Calculate grand totals for an entire cart
 */
export function calculateCartTotals(
  items: CartItem[],
  taxRatePercent: number,
  serviceChargePercent: number,
  discountAmount: number = 0
): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const serviceChargeAmount = Math.round((taxableAmount * serviceChargePercent) / 100);
  const taxAmount = Math.round(((taxableAmount + serviceChargeAmount) * taxRatePercent) / 100);
  
  const grandTotal = taxableAmount + serviceChargeAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    serviceChargeAmount,
    grandTotal,
    itemCount,
  };
}
