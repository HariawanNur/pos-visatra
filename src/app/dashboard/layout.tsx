'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Receipt,
  Users,
  Settings,
  ShieldCheck,
  ArrowLeft,
  BarChart3,
  ClipboardList,
  Utensils,
  UserCheck,
  LogOut,
  Store,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useBusinessStore } from '../../presentation/store/business-store';
import { useAuthStore } from '../../presentation/store/auth-store';
import { DEMO_TENANTS } from '../../core/entities/user';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { config } = useBusinessStore();
  const { currentUser, logout, activeOutlet, switchOutlet } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
    }
  }, [currentUser, router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const navigation = [
    { name: 'Ringkasan & Metrik', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Laporan & Analitik Bisnis', href: '/dashboard/reports', icon: BarChart3, highlight: true },
    { name: 'Katalog Produk & Harga', href: '/dashboard/products', icon: Package },
    { name: 'Stok Opname & Mutasi', href: '/dashboard/inventory', icon: ClipboardList },
    { name: 'Riwayat Transaksi & Struk', href: '/dashboard/orders', icon: Receipt },
    { name: 'Pelanggan & Kasbon', href: '/dashboard/customers', icon: Users },
    { name: 'Staf & Bagi Hasil Komisi', href: '/dashboard/staff', icon: UserCheck },
    { name: 'Denah Meja Resto & Cafe', href: '/dashboard/tables', icon: Utensils },
    { name: 'Pengaturan PT Vistara', href: '/dashboard/settings', icon: Settings },
  ];

  if (!currentUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
        Mengarahkan ke halaman login...
      </div>
    );
  }

  const renderSidebarContent = (onLinkClick?: () => void) => (
    <>
      <div className="flex-1 overflow-y-auto">
        {/* Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span className="truncate">{config.productName}</span>
              </div>
              <div className="text-[10px] text-cyan-400 truncate font-semibold">
                {config.companyLegalName}
              </div>
            </div>
          </div>

          {onLinkClick && (
            <button
              onClick={onLinkClick}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* SaaS Multi-Outlet / Branch Selector */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
            <Store className="w-3 h-3 text-cyan-400" />
            <span>Cabang Outlet Aktif</span>
          </div>
          <select
            value={activeOutlet.id}
            onChange={(e) => {
              const found = DEMO_TENANTS.find((o) => o.id === e.target.value);
              if (found) switchOutlet(found);
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition truncate"
          >
            {DEMO_TENANTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Return to POS Terminal */}
        <div className="p-3">
          <Link
            href="/"
            onClick={onLinkClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Buka Kasir POS Terminal</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : item.highlight
                    ? 'text-cyan-300 hover:text-white hover:bg-slate-850 bg-cyan-950/20 border border-cyan-800/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        {currentUser ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.avatarInitials}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-cyan-400 truncate">{currentUser.roleLabel}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar / Ganti Akun"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full block py-2 text-center rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500"
          >
            Masuk ke Akun
          </Link>
        )}

        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>PT Vistara Teknologi Indonesia</span>
          <span>v2.5.0-PRO</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Mobile Top Navbar Bar (md:hidden) */}
      <div className="md:hidden flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block leading-tight">Backoffice</span>
              <span className="text-[10px] text-cyan-400 block leading-tight truncate max-w-[120px]">
                {activeOutlet.name}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-500 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Buka Kasir</span>
        </Link>
      </div>

      {/* Desktop Sidebar (Permanent on md and above) */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between select-none shrink-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Off-Canvas Drawer (When isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Off-canvas sidebar */}
          <div className="relative z-10 w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(() => setIsMobileMenuOpen(false))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
