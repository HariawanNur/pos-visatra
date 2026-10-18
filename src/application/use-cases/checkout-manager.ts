import { Order, CartItem } from '../../core/entities/order';
import { Customer } from '../../core/entities/customer';
import { IndustryMode, PaymentMethod, DineType } from '../../core/types/industry';
import { calculateCartTotals } from './cart-calculator';

export interface CheckoutRequest {
  industryMode: IndustryMode;
  items: CartItem[];
  customer?: Customer;
  dineType?: DineType;
  tableNumber?: string;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  paymentReference?: string;
  discountAmount?: number;
  taxRatePercent: number;
  serviceChargePercent: number;
  cashierName: string;
  notes?: string;
}

export interface CheckoutResult {
  success: boolean;
  order?: Order;
  errorMessage?: string;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `VIS-${year}${month}${day}-${randomSuffix}`;
}

export function processCheckout(request: CheckoutRequest): CheckoutResult {
  if (!request.items || request.items.length === 0) {
    return { success: false, errorMessage: "Keranjang belanja masih kosong." };
  }

  const totals = calculateCartTotals(
    request.items,
    request.taxRatePercent,
    request.serviceChargePercent,
    request.discountAmount || 0
  );

  // Validate Cash Payment
  let cashChange = 0;
  if (request.paymentMethod === 'CASH') {
    const received = request.cashReceived || 0;
    if (received < totals.grandTotal) {
      return {
        success: false,
        errorMessage: `Uang tunai kurang. Total tagihan adalah ${totals.grandTotal}, diterima ${received}.`
      };
    }
    cashChange = received - totals.grandTotal;
  }

  // Validate Kasbon / Tempo Payment
  if (request.paymentMethod === 'TEMPO_KASBON') {
    if (!request.customer) {
      return {
        success: false,
        errorMessage: "Pembayaran tempo / kasbon mewajibkan data pelanggan dipilih."
      };
    }
    if (!request.customer.allowKasbon) {
      return {
        success: false,
        errorMessage: `Pelanggan ${request.customer.name} tidak memiliki hak akses kasbon/tempo.`
      };
    }
    const projectedBalance = request.customer.kasbonBalance + totals.grandTotal;
    if (projectedBalance > request.customer.kasbonLimit) {
      return {
        success: false,
        errorMessage: `Plafon kredit kasbon terlampaui! Limit: Rp ${request.customer.kasbonLimit.toLocaleString('id-ID')}, Total jika ditambah: Rp ${projectedBalance.toLocaleString('id-ID')}`
      };
    }
  }

  // Create Order Record
  const newOrder: Order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderNumber: generateOrderNumber(),
    industryMode: request.industryMode,
    status: 'COMPLETED',
    items: [...request.items],
    itemCount: totals.itemCount,
    subtotal: totals.subtotal,
    discountAmount: totals.discountAmount,
    taxPercent: request.taxRatePercent,
    taxAmount: totals.taxAmount,
    serviceChargePercent: request.serviceChargePercent,
    serviceChargeAmount: totals.serviceChargeAmount,
    grandTotal: totals.grandTotal,
    paymentMethod: request.paymentMethod,
    cashReceived: request.cashReceived,
    cashChange: cashChange,
    paymentReference: request.paymentReference,
    dineType: request.dineType,
    tableNumber: request.tableNumber,
    customer: request.customer,
    cashierName: request.cashierName,
    notes: request.notes,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  return {
    success: true,
    order: newOrder,
  };
}
