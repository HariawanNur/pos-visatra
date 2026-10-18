import { create } from 'zustand';
import { IndustryMode, DineType, PaymentMethod } from '../../core/types/industry';
import { Product } from '../../core/entities/product';
import { Customer } from '../../core/entities/customer';
import { CartItem, Order, SelectedModifier } from '../../core/entities/order';
import {
  getEffectiveUnitPrice,
  calculateItemSubtotal,
  calculateCartTotals,
  CartTotals,
} from '../../application/use-cases/cart-calculator';
import { processCheckout } from '../../application/use-cases/checkout-manager';
import { useBusinessStore } from './business-store';

interface AddToCartOptions {
  quantity?: number;
  modifiers?: SelectedModifier[];
  kitchenNotes?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
}

interface PosState {
  industryMode: IndustryMode;
  cart: CartItem[];
  selectedCustomer: Customer | null;
  dineType: DineType;
  selectedTable: string | null;
  discountAmount: number;
  lastCompletedOrder: Order | null;
  isReceiptModalOpen: boolean;

  // Actions
  setIndustryMode: (mode: IndustryMode) => void;
  addToCart: (product: Product, options?: AddToCartOptions) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  setExactQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setDineType: (dineType: DineType) => void;
  setSelectedTable: (tableNumber: string | null) => void;
  setDiscountAmount: (amount: number) => void;
  openReceiptModal: (order: Order) => void;
  closeReceiptModal: () => void;

  // Computed helper
  getTotals: () => CartTotals;
  
  // Checkout Execution
  executeCheckout: (
    paymentMethod: PaymentMethod,
    cashReceived?: number,
    paymentReference?: string,
    notes?: string
  ) => { success: boolean; errorMessage?: string; order?: Order };
}

export const usePosStore = create<PosState>((set, get) => ({
  industryMode: 'HYBRID',
  cart: [],
  selectedCustomer: null,
  dineType: 'DINE_IN',
  selectedTable: null,
  discountAmount: 0,
  lastCompletedOrder: null,
  isReceiptModalOpen: false,

  setIndustryMode: (mode) => set({ industryMode: mode }),

  addToCart: (product, options) => {
    const state = get();
    const qty = options?.quantity || 1;
    const modifiers = options?.modifiers || [];

    // Check if an identical item exists (same product & same modifiers & same staff)
    const existingIndex = state.cart.findIndex((item) => {
      if (item.productId !== product.id) return false;
      if (item.assignedStaffId !== options?.assignedStaffId) return false;
      const mod1 = JSON.stringify(item.modifiers || []);
      const mod2 = JSON.stringify(modifiers);
      return mod1 === mod2;
    });

    if (existingIndex > -1) {
      // Increase quantity of existing line
      const existing = state.cart[existingIndex];
      const newQty = existing.quantity + qty;
      const effectiveUnitPrice = getEffectiveUnitPrice(product, newQty);
      const newSubtotal = calculateItemSubtotal(effectiveUnitPrice, newQty, existing.modifiers);

      const updatedCart = [...state.cart];
      updatedCart[existingIndex] = {
        ...existing,
        quantity: newQty,
        unitPrice: effectiveUnitPrice,
        subtotal: newSubtotal,
      };

      set({ cart: updatedCart });
    } else {
      // Add new cart line
      const effectiveUnitPrice = getEffectiveUnitPrice(product, qty);
      const subtotal = calculateItemSubtotal(effectiveUnitPrice, qty, modifiers);

      const newItem: CartItem = {
        cartItemId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: qty,
        basePrice: product.basePrice,
        unitPrice: effectiveUnitPrice,
        unit: product.unit,
        modifiers: modifiers.length > 0 ? modifiers : undefined,
        kitchenNotes: options?.kitchenNotes,
        assignedStaffId: options?.assignedStaffId,
        assignedStaffName: options?.assignedStaffName,
        subtotal,
      };

      set({ cart: [...state.cart, newItem] });
    }
  },

  updateQuantity: (cartItemId, delta) => {
    const state = get();
    const products = useBusinessStore.getState().products;

    const updatedCart = state.cart
      .map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;

        const product = products.find((p) => p.id === item.productId);
        const effectivePrice = product
          ? getEffectiveUnitPrice(product, newQty)
          : item.basePrice;
        const subtotal = calculateItemSubtotal(effectivePrice, newQty, item.modifiers);

        return {
          ...item,
          quantity: newQty,
          unitPrice: effectivePrice,
          subtotal,
        };
      })
      .filter(Boolean) as CartItem[];

    set({ cart: updatedCart });
  },

  setExactQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    const state = get();
    const products = useBusinessStore.getState().products;

    const updatedCart = state.cart.map((item) => {
      if (item.cartItemId !== cartItemId) return item;
      const product = products.find((p) => p.id === item.productId);
      const effectivePrice = product
        ? getEffectiveUnitPrice(product, quantity)
        : item.basePrice;
      const subtotal = calculateItemSubtotal(effectivePrice, quantity, item.modifiers);

      return {
        ...item,
        quantity,
        unitPrice: effectivePrice,
        subtotal,
      };
    });

    set({ cart: updatedCart });
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
    }));
  },

  clearCart: () => {
    set({
      cart: [],
      selectedCustomer: null,
      selectedTable: null,
      discountAmount: 0,
    });
  },

  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setDineType: (dineType) => set({ dineType }),
  setSelectedTable: (tableNumber) => set({ selectedTable: tableNumber }),
  setDiscountAmount: (discountAmount) => set({ discountAmount }),

  openReceiptModal: (order) => set({ lastCompletedOrder: order, isReceiptModalOpen: true }),
  closeReceiptModal: () => set({ isReceiptModalOpen: false }),

  getTotals: () => {
    const state = get();
    const config = useBusinessStore.getState().config;
    return calculateCartTotals(
      state.cart,
      config.taxRatePercent,
      config.serviceChargePercent,
      state.discountAmount
    );
  },

  executeCheckout: (paymentMethod, cashReceived, paymentReference, notes) => {
    const state = get();
    const businessStore = useBusinessStore.getState();
    const cashierName = businessStore.currentShift?.cashierName || 'Kasir Vistara';

    const result = processCheckout({
      industryMode: state.industryMode,
      items: state.cart,
      customer: state.selectedCustomer || undefined,
      dineType: state.dineType,
      tableNumber: state.selectedTable || undefined,
      paymentMethod,
      cashReceived,
      paymentReference,
      discountAmount: state.discountAmount,
      taxRatePercent: businessStore.config.taxRatePercent,
      serviceChargePercent: businessStore.config.serviceChargePercent,
      cashierName,
      notes,
    });

    if (result.success && result.order) {
      // Save order in business store
      businessStore.addOrder(result.order);

      // If F&B table was used and it was Dine-In, we can free or mark table
      if (state.selectedTable) {
        const table = businessStore.tables.find((t) => t.number === state.selectedTable);
        if (table) {
          businessStore.updateTableStatus(table.id, 'AVAILABLE', undefined);
        }
      }

      // Record last order and open receipt dialog
      set({
        lastCompletedOrder: result.order,
        isReceiptModalOpen: true,
        cart: [],
        selectedCustomer: null,
        selectedTable: null,
        discountAmount: 0,
      });

      return { success: true, order: result.order };
    }

    return { success: false, errorMessage: result.errorMessage };
  },
}));
