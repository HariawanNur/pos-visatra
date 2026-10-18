'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CashierHeader } from '../../presentation/components/cashier/CashierHeader';
import { ProductGrid } from '../../presentation/components/cashier/ProductGrid';
import { CartPanel } from '../../presentation/components/cashier/CartPanel';
import { PaymentModal } from '../../presentation/components/cashier/PaymentModal';
import { ThermalReceiptModal } from '../../presentation/components/cashier/ThermalReceiptModal';
import { ModifierModal } from '../../presentation/components/cashier/ModifierModal';
import { StaffAssignModal } from '../../presentation/components/cashier/StaffAssignModal';
import { TableSelectModal } from '../../presentation/components/cashier/TableSelectModal';
import { CustomerSelectModal } from '../../presentation/components/cashier/CustomerSelectModal';
import { ShiftModal } from '../../presentation/components/cashier/ShiftModal';
import { ShortcutHelpModal } from '../../presentation/components/cashier/ShortcutHelpModal';
import { PettyCashModal } from '../../presentation/components/cashier/PettyCashModal';
import { Product } from '../../core/entities/product';
import { StaffMember } from '../../core/entities/staff';
import { SelectedModifier } from '../../core/entities/order';
import { usePosStore } from '../../presentation/store/pos-store';
import { useAuthStore } from '../../presentation/store/auth-store';
import { useCashierShortcuts } from '../../presentation/hooks/useCashierShortcuts';

export default function PosCashierPage() {
  const router = useRouter();
  const { addToCart, cart } = usePosStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);
  const [isPettyCashOpen, setIsPettyCashOpen] = useState(false);

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
        Mengarahkan ke halaman login...
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Product Catalog & Barcode Scanner */}
        <ProductGrid
          onSelectProductWithModifiers={(product) => setActiveModifierProduct(product)}
          onSelectServiceProduct={(product) => setActiveServiceProduct(product)}
        />

        {/* Right: Cart Panel & Checkout */}
        <CartPanel
          onOpenPaymentModal={() => setIsPaymentOpen(true)}
          onOpenTableModal={() => setIsTableModalOpen(true)}
          onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
        />
      </div>

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
