export type IndustryMode = 'RETAIL' | 'FNB' | 'SERVICE' | 'WHOLESALE' | 'HYBRID';

export type PaymentMethod = 
  | 'CASH' 
  | 'QRIS' 
  | 'DEBIT_CARD' 
  | 'CREDIT_CARD' 
  | 'TRANSFER' 
  | 'TEMPO_KASBON';

export type OrderStatus = 
  | 'COMPLETED' 
  | 'PENDING' 
  | 'CANCELLED' 
  | 'KITCHEN_PREPARING' 
  | 'READY_FOR_PICKUP';

export type DineType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'DIRTY';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
  decimals: number;
}
