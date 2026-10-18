import { create } from 'zustand';
import { BusinessConfig, DEFAULT_VISTARA_CONFIG } from '../../core/entities/business-config';
import { Product } from '../../core/entities/product';
import { Customer } from '../../core/entities/customer';
import { RestaurantTable } from '../../core/entities/table';
import { StaffMember } from '../../core/entities/staff';
import { Order } from '../../core/entities/order';
import { Shift } from '../../core/entities/shift';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_TABLES,
  INITIAL_STAFF,
} from '../../infrastructure/repositories/mock-data';

interface BusinessState {
  config: BusinessConfig;
  products: Product[];
  customers: Customer[];
  tables: RestaurantTable[];
  staff: StaffMember[];
  orders: Order[];
  currentShift: Shift | null;

  // Actions
  updateConfig: (newConfig: Partial<BusinessConfig>) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (productId: string, quantityDeduction: number) => void;

  addCustomer: (customer: Customer) => void;
  updateCustomerKasbon: (customerId: string, amountAdded: number) => void;

  updateTableStatus: (tableId: string, status: RestaurantTable['status'], orderId?: string) => void;
  addOrder: (order: Order) => void;

  openShift: (cashierName: string, initialCash: number) => void;
  closeShift: (actualCash: number, notes?: string) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  config: DEFAULT_VISTARA_CONFIG,
  products: INITIAL_PRODUCTS,
  customers: INITIAL_CUSTOMERS,
  tables: INITIAL_TABLES,
  staff: INITIAL_STAFF,
  orders: [],
  currentShift: {
    id: 'shf_demo_01',
    cashierName: 'Siti Rahmawati',
    openedAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    status: 'OPEN',
    initialCash: 500000,
    cashSalesTotal: 1850000,
    nonCashSalesTotal: 2450000,
    cashIn: 0,
    cashOut: 50000, // kas kecil beli air galon
    expectedCashTotal: 500000 + 1850000 - 50000,
  },

  updateConfig: (newConfig) =>
    set((state) => ({ config: { ...state.config, ...newConfig } })),

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  updateProduct: (id, updated) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProductStock: (productId, quantityDeduction) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantityDeduction) } : p
      ),
    })),

  addCustomer: (customer) =>
    set((state) => ({ customers: [customer, ...state.customers] })),

  updateCustomerKasbon: (customerId, amountAdded) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId ? { ...c, kasbonBalance: c.kasbonBalance + amountAdded } : c
      ),
    })),

  updateTableStatus: (tableId, status, orderId) =>
    set((state) => ({
      tables: state.tables.map((tbl) =>
        tbl.id === tableId ? { ...tbl, status, currentOrderId: orderId } : tbl
      ),
    })),

  addOrder: (order) =>
    set((state) => {
      // Deduct stock for all items
      const updatedProducts = state.products.map((p) => {
        const itemInOrder = order.items.find((it) => it.productId === p.id);
        if (itemInOrder && !p.isService) {
          return { ...p, stock: Math.max(0, p.stock - itemInOrder.quantity) };
        }
        return p;
      });

      // Update kasbon if tempo
      let updatedCustomers = state.customers;
      if (order.paymentMethod === 'TEMPO_KASBON' && order.customer) {
        updatedCustomers = state.customers.map((c) =>
          c.id === order.customer?.id
            ? { ...c, kasbonBalance: c.kasbonBalance + order.grandTotal }
            : c
        );
      }

      // Update Shift totals
      let updatedShift = state.currentShift;
      if (updatedShift && updatedShift.status === 'OPEN') {
        const isCash = order.paymentMethod === 'CASH';
        updatedShift = {
          ...updatedShift,
          cashSalesTotal: updatedShift.cashSalesTotal + (isCash ? order.grandTotal : 0),
          nonCashSalesTotal: updatedShift.nonCashSalesTotal + (!isCash ? order.grandTotal : 0),
          expectedCashTotal:
            updatedShift.expectedCashTotal + (isCash ? order.grandTotal : 0),
        };
      }

      return {
        orders: [order, ...state.orders],
        products: updatedProducts,
        customers: updatedCustomers,
        currentShift: updatedShift,
      };
    }),

  openShift: (cashierName, initialCash) =>
    set({
      currentShift: {
        id: `shf_${Date.now()}`,
        cashierName,
        openedAt: new Date().toISOString(),
        status: 'OPEN',
        initialCash,
        cashSalesTotal: 0,
        nonCashSalesTotal: 0,
        cashIn: 0,
        cashOut: 0,
        expectedCashTotal: initialCash,
      },
    }),

  closeShift: (actualCash, notes) =>
    set((state) => {
      if (!state.currentShift) return state;
      const expected = state.currentShift.expectedCashTotal;
      return {
        currentShift: {
          ...state.currentShift,
          status: 'CLOSED',
          closedAt: new Date().toISOString(),
          actualClosingCash: actualCash,
          cashDifference: actualCash - expected,
          notes,
        },
      };
    }),
}));
