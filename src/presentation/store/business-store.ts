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
  INITIAL_ORDERS,
  INITIAL_INVENTORY_LOGS,
  InventoryLog,
} from '../../infrastructure/repositories/mock-data';

interface BusinessState {
  config: BusinessConfig;
  products: Product[];
  customers: Customer[];
  tables: RestaurantTable[];
  staff: StaffMember[];
  orders: Order[];
  inventoryLogs: InventoryLog[];
  currentShift: Shift | null;

  // Actions - Config
  updateConfig: (newConfig: Partial<BusinessConfig>) => void;

  // Actions - Products & Inventory
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (productId: string, quantityDeduction: number) => void;
  addInventoryLog: (log: Omit<InventoryLog, 'id' | 'date'>) => void;

  // Actions - Customers & Kasbon
  addCustomer: (customer: Customer) => void;
  updateCustomerKasbon: (customerId: string, amountAdded: number) => void;

  // Actions - Tables (F&B)
  addTable: (table: RestaurantTable) => void;
  updateTable: (id: string, updated: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;
  updateTableStatus: (tableId: string, status: RestaurantTable['status'], orderId?: string) => void;

  // Actions - Staff (Services & Commissions)
  addStaff: (member: StaffMember) => void;
  updateStaff: (id: string, updated: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  // Actions - Orders & Transactions
  addOrder: (order: Order) => void;

  // Actions - Shift & Petty Cash
  openShift: (cashierName: string, initialCash: number) => void;
  closeShift: (actualCash: number, notes?: string) => void;
  addCashMovement: (type: 'IN' | 'OUT', amount: number, reason: string) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  config: DEFAULT_VISTARA_CONFIG,
  products: INITIAL_PRODUCTS,
  customers: INITIAL_CUSTOMERS,
  tables: INITIAL_TABLES,
  staff: INITIAL_STAFF,
  orders: INITIAL_ORDERS,
  inventoryLogs: INITIAL_INVENTORY_LOGS,
  currentShift: {
    id: 'shf_demo_01',
    cashierName: 'Siti Rahmawati',
    openedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'OPEN',
    initialCash: 500000,
    cashSalesTotal: 98790,
    nonCashSalesTotal: 146520 + 155400 + 4834050,
    cashIn: 0,
    cashOut: 50000, // kas kecil beli air galon
    expectedCashTotal: 500000 + 98790 - 50000,
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

  addInventoryLog: (log) =>
    set((state) => {
      const product = state.products.find((p) => p.id === log.productId);
      if (!product) return state;

      let newStock = product.stock;
      if (log.type === 'IN') {
        newStock += log.quantity;
      } else if (log.type === 'OUT' || log.type === 'DAMAGE') {
        newStock = Math.max(0, newStock - log.quantity);
      } else if (log.type === 'ADJUSTMENT') {
        newStock = log.quantity; // direct override
      }

      const newLogRecord: InventoryLog = {
        ...log,
        id: `log_${Date.now()}`,
        currentStock: newStock,
        date: new Date().toISOString(),
      };

      const updatedProducts = state.products.map((p) =>
        p.id === log.productId ? { ...p, stock: newStock } : p
      );

      return {
        products: updatedProducts,
        inventoryLogs: [newLogRecord, ...state.inventoryLogs],
      };
    }),

  addCustomer: (customer) =>
    set((state) => ({ customers: [customer, ...state.customers] })),

  updateCustomerKasbon: (customerId, amountAdded) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId ? { ...c, kasbonBalance: Math.max(0, c.kasbonBalance + amountAdded) } : c
      ),
    })),

  addTable: (table) =>
    set((state) => ({ tables: [...state.tables, table] })),

  updateTable: (id, updated) =>
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    })),

  deleteTable: (id) =>
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== id),
    })),

  updateTableStatus: (tableId, status, orderId) =>
    set((state) => ({
      tables: state.tables.map((tbl) =>
        tbl.id === tableId ? { ...tbl, status, currentOrderId: orderId } : tbl
      ),
    })),

  addStaff: (member) =>
    set((state) => ({ staff: [...state.staff, member] })),

  updateStaff: (id, updated) =>
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    })),

  deleteStaff: (id) =>
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id),
    })),

  addOrder: (order) =>
    set((state) => {
      const updatedProducts = state.products.map((p) => {
        const itemInOrder = order.items.find((it) => it.productId === p.id);
        if (itemInOrder && !p.isService) {
          return { ...p, stock: Math.max(0, p.stock - itemInOrder.quantity) };
        }
        return p;
      });

      let updatedCustomers = state.customers;
      if (order.paymentMethod === 'TEMPO_KASBON' && order.customer) {
        updatedCustomers = state.customers.map((c) =>
          c.id === order.customer?.id
            ? { ...c, kasbonBalance: c.kasbonBalance + order.grandTotal }
            : c
        );
      }

      // Update Staff Commission today if service items exist
      let updatedStaff = state.staff;
      order.items.forEach((item) => {
        if (item.assignedStaffId) {
          const staffMember = updatedStaff.find((s) => s.id === item.assignedStaffId);
          if (staffMember) {
            const earned = Math.round((item.subtotal * (staffMember.commissionPercentage || 0)) / 100);
            updatedStaff = updatedStaff.map((s) =>
              s.id === staffMember.id ? { ...s, totalEarningsToday: s.totalEarningsToday + earned } : s
            );
          }
        }
      });

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
        staff: updatedStaff,
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

  addCashMovement: (type, amount, reason) =>
    set((state) => {
      if (!state.currentShift || state.currentShift.status !== 'OPEN') return state;
      const isCashIn = type === 'IN';
      const newCashIn = state.currentShift.cashIn + (isCashIn ? amount : 0);
      const newCashOut = state.currentShift.cashOut + (!isCashIn ? amount : 0);
      const newExpected =
        state.currentShift.initialCash +
        state.currentShift.cashSalesTotal +
        newCashIn -
        newCashOut;

      return {
        currentShift: {
          ...state.currentShift,
          cashIn: newCashIn,
          cashOut: newCashOut,
          expectedCashTotal: newExpected,
          notes: `${state.currentShift.notes || ''} [${type}: ${amount} - ${reason}]`,
        },
      };
    }),
}));
