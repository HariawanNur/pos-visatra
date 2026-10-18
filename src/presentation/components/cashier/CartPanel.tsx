'use client';

import React from 'react';
import {
  Trash2,
  Plus,
  Minus,
  User,
  Utensils,
  ShoppingBag,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePosStore } from '../../store/pos-store';
import { useBusinessStore } from '../../store/business-store';
import { formatRupiah } from '../../../application/services/formatters';
import { DineType } from '../../../core/types/industry';

interface CartPanelProps {
  onOpenPaymentModal: () => void;
  onOpenTableModal: () => void;
  onOpenCustomerModal: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  onOpenPaymentModal,
  onOpenTableModal,
  onOpenCustomerModal,
}) => {
  const {
    cart,
    industryMode,
    dineType,
    selectedTable,
    selectedCustomer,
    discountAmount,
    setDineType,
    updateQuantity,
    removeItem,
    clearCart,
    getTotals,
  } = usePosStore();

  const { config } = useBusinessStore();
  const totals = getTotals();

  const dineTypeOptions: { type: DineType; label: string }[] = [
    { type: 'DINE_IN', label: 'Dine In' },
    { type: 'TAKEAWAY', label: 'Take Away' },
    { type: 'DELIVERY', label: 'Delivery' },
  ];

  return (
    <div className="w-full lg:w-[420px] bg-slate-950 border-l border-slate-800 flex flex-col h-full select-none">
      {/* Top Context Bar: Customer, Table, DineType */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/40 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Customer Button */}
          <button
            onClick={onOpenCustomerModal}
            className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 text-xs transition"
          >
            <div className="flex items-center gap-2 truncate">
              <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="text-left truncate">
                <div className="text-[10px] text-slate-400">Pelanggan</div>
                <div className="font-semibold text-slate-200 truncate">
                  {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
                </div>
              </div>
            </div>
            {selectedCustomer?.allowKasbon && (
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Kasbon OK
              </span>
            )}
          </button>

          {/* Table Selector (shown in F&B or HYBRID) */}
          {(industryMode === 'FNB' || industryMode === 'HYBRID') && (
            <button
              onClick={onOpenTableModal}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs transition"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400">Meja</div>
                <div className="font-semibold text-slate-200">
                  {selectedTable || 'Pilih Meja'}
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Dine Type Switcher for F&B */}
        {(industryMode === 'FNB' || industryMode === 'HYBRID') && (
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800/80">
            {dineTypeOptions.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setDineType(type)}
                className={`py-1 text-[11px] font-medium rounded-lg transition ${
                  dineType === type
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <ShoppingBag className="w-12 h-12 mb-2 stroke-[1.2]" />
            <p className="text-sm font-medium text-slate-400">Keranjang masih kosong</p>
            <p className="text-xs text-slate-500 mt-1 text-center max-w-[200px]">
              Pilih produk di katalog atau scan barcode untuk menambahkan pesanan
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const isWholesaleDiscounted = item.unitPrice < item.basePrice;

            return (
              <div
                key={item.cartItemId}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-medium text-slate-200 text-sm">{item.productName}</h4>
                      {isWholesaleDiscounted && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-medium">
                          Tier Grosir
                        </span>
                      )}
                    </div>

                    {/* Modifiers display */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.modifiers.map((m) => (
                          <span
                            key={m.optionId}
                            className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                          >
                            {m.optionName} {m.priceDelta > 0 && `(+${formatRupiah(m.priceDelta)})`}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Assigned Staff for Service */}
                    {item.assignedStaffName && (
                      <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Kapster/Teknisi: {item.assignedStaffName}
                      </div>
                    )}

                    <div className="text-xs text-slate-400 mt-1">
                      {formatRupiah(item.unitPrice)} / {item.unit}
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <div className="font-bold text-sm text-cyan-400">
                      {formatRupiah(item.subtotal)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Hapus baris"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center bg-slate-850 hover:bg-slate-700 text-slate-300 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-semibold text-xs text-white px-2">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center bg-slate-850 hover:bg-slate-700 text-slate-300 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bill Calculation Summary */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Subtotal ({totals.itemCount} item)</span>
          <span className="text-slate-200 font-medium">{formatRupiah(totals.subtotal)}</span>
        </div>

        {totals.discountAmount > 0 && (
          <div className="flex justify-between text-xs text-emerald-400">
            <span>Potongan Diskon</span>
            <span>-{formatRupiah(totals.discountAmount)}</span>
          </div>
        )}

        {config.serviceChargePercent > 0 && (
          <div className="flex justify-between text-xs text-slate-400">
            <span>Service Charge ({config.serviceChargePercent}%)</span>
            <span className="text-slate-200 font-medium">
              {formatRupiah(totals.serviceChargeAmount)}
            </span>
          </div>
        )}

        {config.taxRatePercent > 0 && (
          <div className="flex justify-between text-xs text-slate-400">
            <span>PPN ({config.taxRatePercent}%)</span>
            <span className="text-slate-200 font-medium">{formatRupiah(totals.taxAmount)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
              Total Bayar
            </div>
            <div className="text-[10px] text-slate-500">Termasuk PPN & Biaya</div>
          </div>
          <div className="font-black text-2xl text-emerald-400 tracking-tight">
            {formatRupiah(totals.grandTotal)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="col-span-1 py-3 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear (Esc)
          </button>

          <button
            onClick={onOpenPaymentModal}
            disabled={cart.length === 0}
            className="col-span-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition duration-150 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Bayar (F2)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
