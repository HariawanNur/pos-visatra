'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, ChevronUp } from 'lucide-react';
import { CashierHeader } from '@/presentation/components/cashier/CashierHeader';
import { ProductGrid } from '@/presentation/components/cashier/ProductGrid';
import { CartPanel } from '@/presentation/components/cashier/CartPanel';
import { PaymentModal } from '@/presentation/components/cashier/PaymentModal';
import { ThermalReceiptModal } from '@/presentation/components/cashier/ThermalReceiptModal';
import { ModifierModal } from '@/presentation/components/cashier/ModifierModal';
import { StaffAssignModal } from '@/presentation/components/cashier/StaffAssignModal';
import { TableSelectModal } from '@/presentation/components/cashier/TableSelectModal';
import { CustomerSelectModal } from '@/presentation/components/cashier/CustomerSelectModal';
import { ShiftModal } from '@/presentation/components/cashier/ShiftModal';
import { ShortcutHelpModal } from '@/presentation/components/cashier/ShortcutHelpModal';
import { PettyCashModal } from '@/presentation/components/cashier/PettyCashModal';
import { Product } from '@/core/entities/product';
import { StaffMember } from '@/core/entities/staff';
import { SelectedModifier } from '@/core/entities/order';
import { usePosStore } from '@/presentation/store/pos-store';
import { useAuthStore } from '@/presentation/store/auth-store';
import { useCashierShortcuts } from '@/presentation/hooks/useCashierShortcuts';
import { formatRupiah } from '@/application/services/formatters';

export default function PosCashierPage() {
  const router = useRouter();
  const { addToCart, cart, getTotals, selectedTable, selectedCustomer } = usePosStore();
  const { isAuthenticated } = useAuthStore();
  const totals = getTotals();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);
  const [isPettyCashOpen, setIsPettyCashOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Active product for modifier or service staff modal
  const [activeModifierProduct, setActiveModifierProduct] = useState<Product | null>(null);
  const [activeServiceProduct, setActiveServiceProduct] = useState<Product | null>(null);

  // Keyboard shortcut listener
  useCashierShortcuts({
    onOpenPayment: () => {
      if (cart.length > 0) setIsPaymentOpen(true);
    },
    onOpenTables: () => setIsTableModalOpen(true),
    onOpenCustomers: () => setIsCustomerModalOpen(true),
    onEscape: () => {
      setIsPaymentOpen(false);
      setIsTableModalOpen(false);
      setIsCustomerModalOpen(false);
      setIsShiftModalOpen(false);
      setIsShortcutHelpOpen(false);
      setIsPettyCashOpen(false);
      setIsMobileCartOpen(false);
      setActiveModifierProduct(null);
      setActiveServiceProduct(null);
    },
  });

  // Handler for adding product with chosen modifiers (F&B)
  const handleConfirmModifiers = (modifiers: SelectedModifier[], kitchenNotes?: string) => {
    if (activeModifierProduct) {
      addToCart(activeModifierProduct, {
        modifiers,
        kitchenNotes,
      });
      setActiveModifierProduct(null);
    }
  };

  // Handler for adding service item with assigned staff (Barbershop/Salon/Bengkel)
  const handleConfirmStaff = (staff: StaffMember) => {
    if (activeServiceProduct) {
      addToCart(activeServiceProduct, {
        assignedStaffId: staff.id,
        assignedStaffName: staff.name,
      });
      setActiveServiceProduct(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span>Mengarahkan ke halaman login...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* 1. Top Navbar Header */}
      <CashierHeader
        onOpenShiftModal={() => setIsShiftModalOpen(true)}
        onOpenShortcutHelp={() => setIsShortcutHelpOpen(true)}
        onOpenPettyCashModal={() => setIsPettyCashOpen(true)}
      />

      {/* 2. Main POS Workspace: Left Catalog + Right Cart */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Product Catalog & Barcode Scanner */}
        <ProductGrid
          onSelectProductWithModifiers={(product) => setActiveModifierProduct(product)}
          onSelectServiceProduct={(product) => setActiveServiceProduct(product)}
        />

        {/* Right: Cart Panel & Checkout (Desktop only) */}
        <div className="hidden lg:flex w-[420px] h-full shrink-0">
          <CartPanel
            onOpenPaymentModal={() => setIsPaymentOpen(true)}
            onOpenTableModal={() => setIsTableModalOpen(true)}
            onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Floating Cart Summary Bar (When cart has items) */}
      {cart.length > 0 && !isMobileCartOpen && (
        <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30 animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl p-3 shadow-2xl shadow-blue-500/30 flex items-center justify-between border border-blue-400/30 active:scale-[0.98] transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-slate-950/40 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 bg-emerald-400 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totals.itemCount}
                </span>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-blue-100 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                  {selectedTable ? `Meja ${selectedTable}` : (selectedCustomer ? selectedCustomer.name : 'Pesanan Kasir')}
                </div>
                <div className="text-base font-black text-white leading-tight">
                  {formatRupiah(totals.grandTotal)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/30 hover:bg-slate-950/40 px-3 py-2 rounded-xl text-xs font-bold text-white transition">
              <span>Lihat Pesanan</span>
              <ChevronUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Empty Cart Button (When cart is empty so user can open cart to select Table/Customer) */}
      {cart.length === 0 && !isMobileCartOpen && (
        <div className="lg:hidden fixed bottom-3 right-3 z-30">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="flex items-center gap-2 bg-slate-800/90 backdrop-blur border border-slate-700 text-slate-200 px-3.5 py-2.5 rounded-full shadow-xl text-xs font-medium active:scale-95 transition"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>Keranjang (0)</span>
          </button>
        </div>
      )}

      {/* Mobile Bottom Sheet Cart Drawer */}
      {isMobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileCartOpen(false)}
          />

          {/* Bottom Sheet Container */}
          <div className="relative z-10 w-full max-h-[85vh] h-[85vh] bg-slate-950 border-t border-slate-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <CartPanel
              onOpenPaymentModal={() => {
                setIsMobileCartOpen(false);
                setIsPaymentOpen(true);
              }}
              onOpenTableModal={() => setIsTableModalOpen(true)}
              onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
              onCloseMobile={() => setIsMobileCartOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}

      {/* 3. Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <ThermalReceiptModal />

      <ModifierModal
        product={activeModifierProduct}
        isOpen={!!activeModifierProduct}
        onClose={() => setActiveModifierProduct(null)}
        onConfirm={handleConfirmModifiers}
      />

      <StaffAssignModal
        product={activeServiceProduct}
        isOpen={!!activeServiceProduct}
        onClose={() => setActiveServiceProduct(null)}
        onConfirm={handleConfirmStaff}
      />

      <TableSelectModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      <CustomerSelectModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />

      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
      />

      <ShortcutHelpModal
        isOpen={isShortcutHelpOpen}
        onClose={() => setIsShortcutHelpOpen(false)}
      />

      <PettyCashModal
        isOpen={isPettyCashOpen}
        onClose={() => setIsPettyCashOpen(false)}
      />
    </div>
  );
}
