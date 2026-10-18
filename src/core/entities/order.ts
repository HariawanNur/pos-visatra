import { IndustryMode, OrderStatus, PaymentMethod, DineType } from '../types/industry';
import { Customer } from './customer';

export interface SelectedModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string; // unique cart uuid
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  basePrice: number;
  unitPrice: number;    // Effective price after wholesale tier discounts if applicable
  unit: string;
  
  // Specific for F&B
  modifiers?: SelectedModifier[];
  kitchenNotes?: string;
  
  // Specific for Services
  assignedStaffId?: string;
  assignedStaffName?: string;
  
  subtotal: number;     // (unitPrice + modifierDeltas) * quantity
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "VIS-261018-0042"
  industryMode: IndustryMode;
  status: OrderStatus;
  
  // Items
  items: CartItem[];
  
  // Amounts
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  discountPercentage?: number;
  taxPercent: number;
  taxAmount: number;
  serviceChargePercent: number;
  serviceChargeAmount: number;
  grandTotal: number;
  
  // Payment
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  cashChange?: number;
  paymentReference?: string; // QRIS Ref, EDC approval code, transfer ref
  
  // Multi-Industry Context
  dineType?: DineType;
  tableNumber?: string;
  customer?: Customer;
  
  cashierName: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}
