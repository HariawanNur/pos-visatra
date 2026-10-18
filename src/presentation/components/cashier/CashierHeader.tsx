'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  LogOut,
  User,
} from 'lucide-react';
import { usePosStore } from '../../store/pos-store';
import { useBusinessStore } from '../../store/business-store';
import { useAuthStore } from '../../store/auth-store';
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
  const router = useRouter();
  const { industryMode, setIndustryMode } = usePosStore();
  const { config, currentShift } = useBusinessStore();
  const { currentUser, logout, activeOutlet } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const modeButtons: { mode: IndustryMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'HYBRID', label: 'Universal (All)', icon: <Layers className="w-4 h-4" /> },
    { mode: 'RETAIL', label: 'Retail & Minimarket', icon: <Store className="w-4 h-4" /> },
    { mode: 'FNB', label: 'Resto & Cafe (F&B)', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { mode: 'SERVICE', label: 'Jasa & Barbershop', icon: <Scissors className="w-4 h-4" /> },
    { mode: 'WHOLESALE', label: 'Grosir & B2B', icon: <Boxes className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 sm:gap-3 select-none shrink-0">
      {/* Brand & PT Info (Order 1 on all screens) */}
      <div className="order-1 flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
              <span>{config.productName}</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-cyan-400 inline shrink-0" />
            <span className="font-medium text-slate-300 hidden sm:inline">{config.companyLegalName}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-cyan-400 font-semibold truncate max-w-[120px] sm:max-w-none">
              {activeOutlet ? activeOutlet.name : config.storeName}
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls, User Profile & Cashier Info (Order 2 on mobile, Order 3 on desktop) */}
      <div className="order-2 lg:order-3 flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Petty Cash Button */}
        <button
          onClick={onOpenPettyCashModal}
          title="Kas Kecil / Pengeluaran Toko"
          className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition flex items-center gap-1.5 text-xs"
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span className="hidden xl:inline">Kas Kecil</span>
        </button>

        {/* Keyboard shortcut help */}
        <button
          onClick={onOpenShortcutHelp}
          title="Shortcut Keyboard (F1, F2, Esc)"
          className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition flex items-center gap-1.5 text-xs"
        >
          <Keyboard className="w-4 h-4 text-slate-400" />
          <span className="hidden xl:inline">Shortcuts</span>
        </button>

        {/* Shift status */}
        <button
          onClick={onOpenShiftModal}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs transition"
          title="Status Shift Kasir"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <div className="text-left leading-tight hidden xs:block sm:block">
            <div className="text-[9px] sm:text-[10px] text-slate-400 leading-none">Kasir</div>
            <div className="font-medium text-slate-200 text-[11px] sm:text-xs truncate max-w-[65px] sm:max-w-none">
              {currentShift ? currentShift.cashierName : 'Tutup'}
            </div>
          </div>
        </button>

        {/* Link to Admin Backoffice */}
        <Link
          href="/dashboard"
          title="Buka Backoffice Dashboard"
          className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-500 text-xs font-medium transition"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden md:inline">Backoffice</span>
        </Link>

        {/* User profile avatar & logout */}
        {currentUser ? (
          <div className="flex items-center gap-1 sm:gap-1.5 pl-1 border-l border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow shrink-0">
              {currentUser.avatarInitials}
            </div>
            <button
              onClick={handleLogout}
              title="Keluar / Ganti Akun Demo"
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Multi-Industry Mode Filter Pills (Order 3 on mobile, Order 2 on desktop) */}
      <div className="order-3 lg:order-2 w-full lg:w-auto flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80 gap-1 overflow-x-auto scrollbar-none shrink-0">
        {modeButtons.map(({ mode, label, icon }) => {
          const isActive = industryMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setIndustryMode(mode)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
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
    </header>
  );
};
