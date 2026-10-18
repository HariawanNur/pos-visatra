'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Scissors,
  Boxes,
  Layers,
  LayoutDashboard,
  Clock,
  Keyboard,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { usePosStore } from '../../store/pos-store';
import { useBusinessStore } from '../../store/business-store';
import { IndustryMode } from '../../../core/types/industry';

interface CashierHeaderProps {
  onOpenShiftModal: () => void;
  onOpenShortcutHelp: () => void;
  onOpenPettyCashModal: () => void;
}

export const CashierHeader: React.FC<CashierHeaderProps> = ({
  onOpenShiftModal,
  onOpenShortcutHelp,
  onOpenPettyCashModal,
}) => {
  const { industryMode, setIndustryMode } = usePosStore();
  const { config, currentShift } = useBusinessStore();

  const modeButtons: { mode: IndustryMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'HYBRID', label: 'Universal (All)', icon: <Layers className="w-4 h-4" /> },
    { mode: 'RETAIL', label: 'Retail & Minimarket', icon: <Store className="w-4 h-4" /> },
    { mode: 'FNB', label: 'Resto & Cafe (F&B)', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { mode: 'SERVICE', label: 'Jasa & Barbershop', icon: <Scissors className="w-4 h-4" /> },
    { mode: 'WHOLESALE', label: 'Grosir & B2B', icon: <Boxes className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & PT Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>{config.productName}</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span className="font-medium text-slate-300">{config.companyLegalName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{config.storeName}</span>
          </div>
        </div>
      </div>

      {/* Multi-Industry Mode Filter Pills */}
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80 gap-1 overflow-x-auto">
        {modeButtons.map(({ mode, label, icon }) => {
          const isActive = industryMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setIndustryMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {icon}
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Controls & Cashier Info */}
      <div className="flex items-center gap-2">
        {/* Petty Cash Button */}
        <button
          onClick={onOpenPettyCashModal}
          title="Kas Kecil / Pengeluaran Toko"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition flex items-center gap-1.5 text-xs"
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Kas Kecil</span>
        </button>

        {/* Keyboard shortcut help */}
        <button
          onClick={onOpenShortcutHelp}
          title="Shortcut Keyboard (F1, F2, Esc)"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition flex items-center gap-1.5 text-xs"
        >
          <Keyboard className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">Shortcuts</span>
        </button>

        {/* Shift status */}
        <button
          onClick={onOpenShiftModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs transition"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <div className="text-left leading-tight">
            <div className="text-[10px] text-slate-400">Kasir</div>
            <div className="font-medium text-slate-200">
              {currentShift ? currentShift.cashierName : 'Shift Tutup'}
            </div>
          </div>
        </button>

        {/* Link to Admin Backoffice */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-500 text-xs font-medium transition"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Backoffice</span>
        </Link>
      </div>
    </header>
  );
};
